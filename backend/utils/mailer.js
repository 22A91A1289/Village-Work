const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  RESEND_API_KEY,
  RESEND_FROM
} = process.env;

const https = require('https');

/** Returns true if email can be sent (SMTP configured). */
function isEmailConfigured() {
  const smtpConfigured = !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM);
  const resendConfigured = !!(RESEND_API_KEY && (RESEND_FROM || SMTP_FROM));
  return smtpConfigured || resendConfigured;
}

function ensureEmailConfig() {
  console.log('📧 Email Configuration Check:');
  console.log('  SMTP_HOST:', SMTP_HOST || '❌ Missing');
  console.log('  SMTP_PORT:', SMTP_PORT || '❌ Missing');
  console.log('  SMTP_USER:', SMTP_USER || '❌ Missing');
  console.log('  SMTP_PASS:', SMTP_PASS ? '✅ Present' : '❌ Missing');
  console.log('  SMTP_FROM:', SMTP_FROM || '❌ Missing');

  const hasSmtp = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM;
  const hasResend = RESEND_API_KEY && (RESEND_FROM || SMTP_FROM);

  if (!hasSmtp && !hasResend) {
    throw new Error('Email service not configured. Set SMTP_* or RESEND_* vars in .env');
  }
  // Gmail App Password is 16 chars; if SMTP_PASS has spaces, use quotes in .env: SMTP_PASS="xxxx xxxx xxxx xxxx"
  const passLen = (SMTP_PASS || '').replace(/\s/g, '').length;
  if (passLen > 0 && passLen < 16 && (SMTP_HOST || '').includes('gmail')) {
    console.warn('⚠️ SMTP_PASS looks short (' + passLen + ' chars). In .env use quotes: SMTP_PASS="your app password"');
  }
}

/** OTP email HTML for nodemailer. */
function getOtpEmailContent(otp) {
  const text = `Your WorkNex password reset OTP is ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #4F46E5; margin-bottom: 20px;">🔐 WorkNex Password Reset</h2>
        <p style="color: #374151; font-size: 16px;">Your OTP for password reset is:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">
            ${otp}
          </div>
        </div>
        <p style="color: #6B7280; font-size: 14px;">⏱️ This OTP will expire in <strong>10 minutes</strong>.</p>
        <p style="color: #6B7280; font-size: 14px;">🔒 If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
          This is an automated email from WorkNex. Please do not reply.
        </p>
      </div>
    </div>
  `;
  return { text, html };
}

function createTransport() {
  ensureEmailConfig();
  
  // Remove any quotes and whitespace from SMTP_FROM
  const cleanFrom = SMTP_FROM.replace(/["']/g, '').trim();
  // Gmail App Password: strip spaces so it works with or without quotes in .env (use SMTP_PASS="xxxx xxxx xxxx xxxx")
  const smtpPass = (SMTP_PASS || '').replace(/["']/g, '').replace(/\s/g, '').trim();
  
  const port = Number(SMTP_PORT);
  const config = {
    host: SMTP_HOST,
    port,
    secure: port === 465, // true for 465, false for other ports (587 uses STARTTLS)
    auth: {
      user: (SMTP_USER || '').trim(),
      pass: smtpPass
    },
    // Prevent "Connection timeout" on slow networks or SMTP servers (e.g. Gmail)
    connectionTimeout: 60000,  // 60s to establish connection
    greetingTimeout: 30000,    // 30s for SMTP greeting
    socketTimeout: 60000,     // 60s for socket inactivity
    ...(port === 587 && { requireTLS: true })  // Use STARTTLS on port 587
  };

  console.log('📧 Creating SMTP transport with:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user
  });

  return nodemailer.createTransport(config);
}

async function sendViaResend({ to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    const from = RESEND_FROM || SMTP_FROM;
    const body = JSON.stringify({
      from: from,
      to: [to],
      subject: subject,
      html: html,
      text: text
    });

    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY.trim()}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Resend API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(body);
    req.end();
  });
}

async function sendOtpEmail({ to, otp }) {
  try {
    console.log('📧 Preparing to send OTP email...');
    console.log('  To:', to);

    // Skip actual send when testing
    const skipEnv = (process.env.SKIP_EMAIL_SEND || '').toString().trim().toLowerCase();
    if (skipEnv === '1' || skipEnv === 'true' || skipEnv === 'yes') {
      console.log('⏭️ SKIP_EMAIL_SEND is set – not sending email. OTP for', to, ':', otp);
      return { messageId: 'skip-' + Date.now() };
    }

    const subject = 'WorkNex Password Reset OTP';
    const { text, html } = getOtpEmailContent(otp);

    // Prefer Resend on Render/Vercel as it works via HTTP
    if (RESEND_API_KEY) {
      console.log('📧 Sending via Resend API...');
      try {
        const info = await sendViaResend({ to, subject, html, text });
        console.log('✅ Email sent via Resend:', info.id);
        return info;
      } catch (err) {
        console.error('⚠️ Resend failed, falling back to SMTP if possible:', err.message);
        if (!isSMTPConfigured()) throw err;
      }
    }

    // Fallback to SMTP
    const transporter = createTransport();
    const cleanFrom = SMTP_FROM.replace(/["']/g, '').trim();
    
    console.log('📧 Sending via SMTP...');
    const info = await transporter.sendMail({
      from: cleanFrom,
      to,
      subject,
      text,
      html
    });

    console.log('✅ Email sent via SMTP:', info.messageId);
    return info;

  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

function isSMTPConfigured() {
  return !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM);
}

module.exports = { sendOtpEmail, isEmailConfigured };