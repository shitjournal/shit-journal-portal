const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SITE_URL = "https://shitjournal.org";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, authorName, manuscriptTitle, submissionId } = await req.json();

    if (!email || !manuscriptTitle || !submissionId) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const preprintUrl = `${SITE_URL}/preprints/${submissionId}`;
    const dashboardUrl = `${SITE_URL}/dashboard`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
  <div style="border-bottom: 3px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -1px;">S.H.I.T</h1>
    <p style="font-size: 10px; color: #666; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 2px;">Sciences, Humanities, Information, Technology</p>
  </div>

  <h2 style="font-size: 20px; margin-bottom: 8px;">Manuscript Received!</h2>
  <p style="color: #666; font-size: 14px;">稿件已收到，等待编辑预审</p>

  <div style="background: #fef3c7; border-left: 4px solid #d4a017; padding: 16px; margin: 24px 0;">
    <p style="margin: 0 0 4px; font-size: 12px; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">Manuscript Title / 稿件标题</p>
    <p style="margin: 0; font-size: 16px; font-weight: bold;">${manuscriptTitle}</p>
  </div>

  <p style="font-size: 14px; line-height: 1.6;">
    Dear ${authorName || "Author"},<br><br>
    Thank you for your submission to S.H.I.T Journal. Your manuscript has been received and is now awaiting editorial screening. You will be notified once a decision is made.
  </p>
  <p style="font-size: 14px; line-height: 1.6; color: #666;">
    感谢您向 S.H.I.T Journal 投稿。您的稿件已收到，正在等待编辑预审。审核结果将通过邮件通知您。
  </p>

  <div style="margin: 28px 0;">
    <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background: #d4a017; color: white; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
      Dashboard / 仪表台
    </a>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0 16px;">
  <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
    S.H.I.T Journal — Sciences, Humanities, Information, Technology<br>
    构石（构建学术的基石）
  </p>
</body>
</html>`.trim();

    // Send via Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "S.H.I.T Journal <editor@shitjournal.org>",
        to: [email],
        subject: `Manuscript received — S.H.I.T Journal`,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: "Email send failed", detail: result }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
