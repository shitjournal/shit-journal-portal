const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SITE_URL = "https://shitjournal.org";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DECISION_CONFIG: Record<string, { subject: string; heading: string; headingCn: string; body: string; bodyCn: string; color: string }> = {
  under_review: {
    subject: "Your manuscript has been approved — S.H.I.T Journal",
    heading: "Approved to 发酵池!",
    headingCn: "稿件已通过预审！",
    body: "Your manuscript has passed editorial screening and is now live in the Septic Tank (发酵池). Other researchers can browse and rate it.",
    bodyCn: "您的稿件已通过编辑预审，现已进入发酵池。其他研究者可以浏览和评分。",
    color: "#16a34a",
  },
  revisions_requested: {
    subject: "Revisions requested for your manuscript — S.H.I.T Journal",
    heading: "Revisions Requested",
    headingCn: "稿件需要修改",
    body: "Our editors have reviewed your manuscript and are requesting revisions before it can enter the Septic Tank. Please check the editor notes below and update your submission.",
    bodyCn: "编辑审阅了您的稿件，需要您进行修改后才能进入发酵池。请查看下方的编辑备注并更新您的投稿。",
    color: "#2563eb",
  },
  flushed: {
    subject: "Manuscript decision — S.H.I.T Journal",
    heading: "Desk Flushed",
    headingCn: "稿件未通过预审",
    body: "After editorial review, your manuscript has not been selected for the Septic Tank at this time. Thank you for your submission.",
    bodyCn: "经编辑审阅，您的稿件暂未通过预审。感谢您的投稿。",
    color: "#dc2626",
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, authorName, manuscriptTitle, submissionId, decision, notes } = await req.json();

    if (!email || !manuscriptTitle || !submissionId || !decision) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const config = DECISION_CONFIG[decision];
    if (!config) {
      return new Response(JSON.stringify({ error: "Unknown decision" }), { status: 400 });
    }

    const dashboardUrl = `${SITE_URL}/dashboard`;
    const preprintUrl = `${SITE_URL}/preprints/${submissionId}`;

    const notesHtml = notes
      ? `<div style="background: #fef3c7; border-left: 4px solid #d4a017; padding: 16px; margin: 24px 0;">
           <p style="margin: 0 0 4px; font-size: 12px; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">Editor Notes / 编辑备注</p>
           <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${notes}</p>
         </div>`
      : "";

    const actionButton = decision === "under_review"
      ? `<a href="${preprintUrl}" style="display: inline-block; padding: 12px 24px; background: #d4a017; color: white; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
           View in 发酵池 / 查看预印本
         </a>`
      : `<a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background: #d4a017; color: white; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
           Dashboard / 仪表台
         </a>`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
  <div style="border-bottom: 3px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -1px;">S.H.I.T</h1>
    <p style="font-size: 10px; color: #666; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 2px;">Sciences, Humanities, Information, Technology</p>
  </div>

  <h2 style="font-size: 20px; margin-bottom: 8px; color: ${config.color};">${config.heading}</h2>
  <p style="color: #666; font-size: 14px;">${config.headingCn}</p>

  <div style="background: #f5f5f5; border-left: 4px solid #333; padding: 16px; margin: 24px 0;">
    <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Manuscript Title / 稿件标题</p>
    <p style="margin: 0; font-size: 16px; font-weight: bold;">${manuscriptTitle}</p>
  </div>

  <p style="font-size: 14px; line-height: 1.6;">
    Dear ${authorName || "Author"},<br><br>
    ${config.body}
  </p>
  <p style="font-size: 14px; line-height: 1.6; color: #666;">
    ${config.bodyCn}
  </p>

  ${notesHtml}

  <div style="margin: 28px 0;">
    ${actionButton}
  </div>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0 16px;">
  <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
    S.H.I.T Journal — Sciences, Humanities, Information, Technology<br>
    构石（构建学术的基石）
  </p>
</body>
</html>`.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "S.H.I.T Journal <editor@shitjournal.org>",
        to: [email],
        subject: config.subject,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: "Email send failed", detail: result }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
