# OTP Email on Render – Setup

If **forgot password** API succeeds but **OTP email does not arrive**, the backend needs email configured on Render.

---

## ⚠️ Why “Connection timeout” (ETIMEDOUT) on Render?

**Render’s free tier blocks outbound SMTP.** Ports 25, 465, and 587 are blocked, so Gmail/Outlook SMTP will **always time out** on a free web service. This is by design to prevent abuse.

**You have two options:**

1. **Use Resend (recommended, works on free tier)** – sends over HTTPS (port 443), not blocked.
2. **Upgrade to a paid Render instance** – then SMTP (Gmail, etc.) on 465/587 works.

---

## Option A: Resend (works on Render free tier)

Resend uses an HTTP API, so it works even when SMTP is blocked.

### 1. Get a Resend API key

1. Sign up at [resend.com](https://resend.com).
2. **API Keys** → Create API Key → copy the key (starts with `re_`).
3. For testing you can use their sandbox domain; for production, add and verify your domain.

### 2. Set environment variables on Render

In **Render Dashboard** → your backend service → **Environment**, add:

| Key             | Example value                    | Notes |
|-----------------|----------------------------------|--------|
| RESEND_API_KEY  | re_xxxxxxxxxxxxxxxxxxxxxxxx      | Your Resend API key |
| RESEND_FROM     | WorkNex &lt;onboarding@resend.dev&gt; | Sandbox; or use `noreply@yourdomain.com` after verifying domain |

You can use **SMTP_FROM** instead of **RESEND_FROM** if you already have it set (e.g. `WorkNex <onboarding@resend.dev>`).

### 3. Deploy

Save env vars → Render redeploys. No SMTP_* variables are needed when using Resend.

### 4. Verify

In Render logs when you trigger “Send OTP” you should see:

- `📧 Sending via Resend API from: ...` and `✅ Email sent via Resend` → success; check inbox and spam.

---

## Option B: SMTP (paid Render only)

If your Render service is **paid** (not free), you can use Gmail or another SMTP provider.

### 1. Add environment variables on Render

| Key         | Example value        | Notes |
|------------|----------------------|--------|
| SMTP_HOST  | smtp.gmail.com       | Gmail; or your provider’s host |
| SMTP_PORT  | 587                  | 587 (TLS) or 465 (SSL) |
| SMTP_USER  | your@gmail.com       | Your email |
| SMTP_PASS  | xxxx xxxx xxxx xxxx  | **Gmail: App Password** (see below) |
| SMTP_FROM  | your@gmail.com       | Same as SMTP_USER or “Name &lt;email&gt;” |

### 2. Gmail App Password

- Gmail account password will **not** work (2FA/security).
- Use an **App Password**:
  1. Google Account → Security → turn on **2-Step Verification**.
  2. Open [App passwords](https://myaccount.google.com/apppasswords).
  3. Create an app password for “Mail” or “Other (WorkNex)”.
  4. Copy the 16-character password and set as **SMTP_PASS** on Render (spaces are OK).

### 3. Other SMTP providers

- **Outlook / Microsoft 365:** SMTP_HOST `smtp.office365.com`, PORT 587.
- **SendGrid / Mailgun:** Use their SMTP host and credentials in the same env vars.

---

## After setting email

- **Render Logs** when you click “Send OTP”:
  - `✅ OTP email sent successfully` or `✅ Email sent via Resend` → check inbox and **spam**.
  - `❌ OTP EMAIL NOT SENT` or connection/timeout errors → if on free tier, switch to **Resend** (Option A); if paid, check SMTP_* and App Password.
