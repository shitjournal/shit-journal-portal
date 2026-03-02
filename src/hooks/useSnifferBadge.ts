import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ZONE_THRESHOLDS } from '../lib/constants';

interface SnifferBadgeResult {
  isSnifferToday: boolean;
  latrineCount: number;
  loading: boolean;
}

export function useSnifferBadge(userId: string | undefined): SnifferBadgeResult {
  const [latrineCount, setLatrineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    supabase
      .from('daily_latrine_ratings')
      .select('latrine_count')
      .eq('user_id', userId)
      .eq('rating_date', today)
      .maybeSingle()
      .then(({ data }) => {
        setLatrineCount(data?.latrine_count || 0);
        setLoading(false);
      });
  }, [userId]);

  return {
    isSnifferToday: latrineCount >= ZONE_THRESHOLDS.SNIFFER_BADGE_THRESHOLD,
    latrineCount,
    loading,
  };
}

/**
 * Check sniffer badge status for multiple users at once.
 * Returns a Set of user IDs that have the sniffer badge today.
 */
export async function fetchSnifferUsers(userIds: string[]): Promise<Set<string>> {
  if (userIds.length === 0) return new Set();

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('daily_latrine_ratings')
    .select('user_id, latrine_count')
    .eq('rating_date', today)
    .in('user_id', userIds)
    .gte('latrine_count', ZONE_THRESHOLDS.SNIFFER_BADGE_THRESHOLD);

  return new Set((data || []).map(d => d.user_id));
}
