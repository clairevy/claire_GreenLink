// Welcome email template
// Exports a function that returns the HTML string for the welcome/onboarding email.
// Usage: const html = welcomeEmail({ name, verifyUrl, profileUrl, startUrl, companyName });

export default function welcomeEmail(opts = {}) {
  const {
    name = "",
    verifyUrl = "#",
    profileUrl = "#",
    startUrl = "#",
    companyName = "GreenBanana Coop",
  } = opts;

  // Inline styles tailored for email clients
  return `<!doctype html>
	<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Welcome to ${companyName}</title>
		<style>
			/* Reset & base */
			body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:0; padding:0; background:#f3f4f6; }
			.email-wrap { width:100%; background:#f3f4f6; padding:40px 12px; }
			.email-body { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(2,6,23,0.08); }
			.email-header { background: #fff; text-align:center; padding: 28px 18px 8px; }
			.brand-mark { width:48px; height:48px; display:block; margin:0 auto 8px; }
			.hero-image { width:100%; height:140px; background: linear-gradient(90deg,#e6f3ff,#eef6ff); display:block; }
			.email-content { padding: 20px 28px; color:#111827; }
			h1 { font-size:22px; margin: 8px 0 12px; font-weight:600; }
			p { color:#374151; margin:0 0 16px; font-size:14px; line-height:1.5 }
			.section { border-top:1px solid #eef2f7; padding:20px 0; }
			.section h2 { font-size:18px; margin:0 0 8px; }
			.btn { display:inline-block; padding:10px 16px; border-radius:6px; text-decoration:none; color:#fff; background:#0ea36f; font-weight:600; }
			.btn-outline { display:inline-block; padding:8px 14px; border-radius:6px; text-decoration:none; color:#0b79d0; border:1px solid #0b79d0; background:transparent; }
			.small { font-size:13px; color:#6b7280; }
			.footer { text-align:center; padding:18px; color:#9ca3af; font-size:13px; }
			.social-row { padding: 8px 0 0; }
			@media screen and (max-width:420px){ .email-body{ margin:0 8px; } h1{ font-size:20px } }
		</style>
	</head>
	<body>
		<div class="email-wrap">
			<div class="email-body">
				<div class="email-header">
					<img class="brand-mark" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34c.png" alt="logo" />
				</div>

				<div class="hero-image" role="img" aria-label="welcome illustration"></div>

				<div class="email-content">
					<h1>Welcome To ${companyName}!</h1>
					<p>Hi ${
            escapeHtml(name) || "there"
          }, welcome to ${companyName}. Great to have you on board.</p>

					<div class="section">
						<h2>1. Verify your account</h2>
						<p class="small">To ensure you're legitimate and not some fake person, please verify your account by clicking the button below.</p>
						<p style="margin-top:12px;"><a class="btn" href="${verifyUrl}">Verify My Account</a></p>
					</div>

					<div class="section">
						<h2>2. Complete your profile</h2>
						<p class="small">With your account confirmed, it's time to complete your profile. Add a profile photo and other information to increase your chances of connecting with partners.</p>
						<p style="margin-top:12px;"><a class="btn-outline" href="${profileUrl}">Complete My Profile</a></p>
					</div>

					<div class="section">
						<h2>3. Start meeting people</h2>
						<p class="small">Now you're ready to start working with other members. Good luck on your journey.</p>
						<p style="margin-top:12px;"><a class="btn-outline" href="${startUrl}">Start Meeting People</a></p>
					</div>

					<div style="margin-top:18px; text-align:center;">
						<a class="btn" href="${startUrl}" style="background:#10b981; display:block; padding:12px 16px; border-radius:8px;">Great to have you on board ${
    escapeHtml(name) || ""
  } :-)</a>
					</div>
				</div>

				<div class="footer">
					<div class="small">${companyName} • 7-11 Commercial Ct • Sample Address</div>
					<div class="social-row">Social icons placeholders</div>
				</div>
			</div>
		</div>
	</body>
	</html>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
