-- ============================================================
-- 构石 (GouShi) Zone System Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- 1. submissions 表新增列
-- ============================================================

-- 学科分类（与 viscosity 并存）
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS discipline TEXT NOT NULL DEFAULT 'interdisciplinary';

-- 检查约束（如果不存在才加）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'check_discipline'
  ) THEN
    ALTER TABLE submissions
      ADD CONSTRAINT check_discipline
      CHECK (discipline IN ('science','engineering','medical','agriculture','law_social','humanities','interdisciplinary'));
  END IF;
END $$;

-- Zone 晋升时间戳
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS promoted_to_septic_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS promoted_to_stone_at TIMESTAMPTZ DEFAULT NULL;


-- ============================================================
-- 2. 嗅探兽追踪表
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_latrine_ratings (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating_date DATE NOT NULL DEFAULT CURRENT_DATE,
  latrine_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, rating_date)
);

ALTER TABLE daily_latrine_ratings ENABLE ROW LEVEL SECURITY;

-- RLS: 用户只能读自己的
DROP POLICY IF EXISTS "Users can read own daily ratings" ON daily_latrine_ratings;
CREATE POLICY "Users can read own daily ratings"
  ON daily_latrine_ratings FOR SELECT
  USING (auth.uid() = user_id);


-- ============================================================
-- 3. 重建 preprints_with_ratings 视图
--    新增: zone, comment_count, unique_commenters,
--          latrine_recency, latrine_sort_key
-- ============================================================
-- ⚠️ 注意：如果你的 weighted_score 公式不同于下面的
--    AVG(score) * LN(COUNT(*) + 1)，请自行替换。
--    可以先执行:
--    SELECT pg_get_viewdef('preprints_with_ratings'::regclass);
--    来查看当前公式。

DROP VIEW IF EXISTS preprints_with_ratings;

CREATE VIEW preprints_with_ratings AS
SELECT
  s.*,
  COALESCE(avg(r.score), 0) AS avg_score,
  (count(r.score))::INT AS rating_count,
  -- 贝叶斯加权分（与原 view 公式一致：prior=全局均分, weight=3）
  COALESCE(
    (
      ((SELECT COALESCE(avg(preprint_ratings.score), 0) FROM preprint_ratings) * 3
       + COALESCE(avg(r.score), 0) * count(r.score))
      / NULLIF((3 + count(r.score)), 0)::numeric
    ), 0
  ) AS weighted_score,
  COALESCE(c.comment_count, 0)::INT AS comment_count,
  COALESCE(c.unique_commenters, 0)::INT AS unique_commenters,
  -- Zone 计算（完全动态，按优先级判断）
  CASE
    WHEN count(r.score) > 100 AND COALESCE(avg(r.score), 0) >= 4.5 THEN 'stone'
    WHEN count(r.score) >= 30 AND COALESCE(avg(r.score), 0) >= 3.8 THEN 'septic'
    WHEN count(r.score) >= 30 AND COALESCE(avg(r.score), 0) < 3.8 THEN 'sediment'
    ELSE 'latrine'
  END AS zone,
  -- 旱厕排序辅助列
  CASE WHEN s.created_at > NOW() - INTERVAL '3 days' THEN 0 ELSE 1 END AS latrine_recency,
  md5(s.id::text || CURRENT_DATE::text) AS latrine_sort_key
FROM submissions s
LEFT JOIN preprint_ratings r ON r.submission_id = s.id
LEFT JOIN (
  SELECT
    submission_id,
    COUNT(*)::INT AS comment_count,
    COUNT(DISTINCT user_id)::INT AS unique_commenters
  FROM preprint_comments
  GROUP BY submission_id
) c ON s.id = c.submission_id
WHERE s.status IN ('under_review', 'accepted')
GROUP BY s.id, c.comment_count, c.unique_commenters;


-- ============================================================
-- 4. 合并 Trigger: zone 晋升 + 嗅探兽计数
-- ============================================================

CREATE OR REPLACE FUNCTION on_rating_inserted()
RETURNS TRIGGER AS $$
DECLARE
  v_count INT;
  v_avg NUMERIC;
BEGIN
  -- 聚合当前评分（preprint_ratings.submission_id 应有索引）
  SELECT COUNT(*), AVG(score) INTO v_count, v_avg
  FROM preprint_ratings
  WHERE submission_id = NEW.submission_id;

  -- Zone 晋升时间戳（仅首次达标写入）
  IF v_count >= 30 AND v_avg >= 3.8 THEN
    UPDATE submissions
    SET promoted_to_septic_at = COALESCE(promoted_to_septic_at, NOW())
    WHERE id = NEW.submission_id AND promoted_to_septic_at IS NULL;
  END IF;

  IF v_count > 100 AND v_avg >= 4.5 THEN
    UPDATE submissions
    SET promoted_to_stone_at = COALESCE(promoted_to_stone_at, NOW())
    WHERE id = NEW.submission_id AND promoted_to_stone_at IS NULL;
  END IF;

  -- 嗅探兽计数（rating_count <= 30 视为旱厕文章）
  IF v_count <= 30 THEN
    INSERT INTO daily_latrine_ratings (user_id, rating_date, latrine_count)
    VALUES (NEW.user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, rating_date)
    DO UPDATE SET latrine_count = daily_latrine_ratings.latrine_count + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 绑定 trigger
DROP TRIGGER IF EXISTS trg_on_rating_inserted ON preprint_ratings;
CREATE TRIGGER trg_on_rating_inserted
  AFTER INSERT ON preprint_ratings
  FOR EACH ROW
  EXECUTE FUNCTION on_rating_inserted();


-- ============================================================
-- 5. 确保索引存在
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_preprint_ratings_submission_id
  ON preprint_ratings(submission_id);

CREATE INDEX IF NOT EXISTS idx_preprint_comments_submission_id
  ON preprint_comments(submission_id);

CREATE INDEX IF NOT EXISTS idx_daily_latrine_ratings_date
  ON daily_latrine_ratings(rating_date);


-- ============================================================
-- 6. 回填现有数据
-- ============================================================

-- 回填 promoted_to_septic_at
UPDATE submissions s
SET promoted_to_septic_at = s.created_at
FROM (
  SELECT submission_id
  FROM preprint_ratings
  GROUP BY submission_id
  HAVING COUNT(*) >= 30 AND AVG(score) >= 3.8
) r
WHERE s.id = r.submission_id
  AND s.promoted_to_septic_at IS NULL
  AND s.status IN ('under_review', 'accepted');

-- 回填 promoted_to_stone_at
UPDATE submissions s
SET promoted_to_stone_at = s.created_at
FROM (
  SELECT submission_id
  FROM preprint_ratings
  GROUP BY submission_id
  HAVING COUNT(*) > 100 AND AVG(score) >= 4.5
) r
WHERE s.id = r.submission_id
  AND s.promoted_to_stone_at IS NULL
  AND s.status IN ('under_review', 'accepted');
