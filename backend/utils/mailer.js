const nodemailer = require('nodemailer');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM
} = process.env;

/** Returns true if email can be sent (SMTP configured). */
function isEmailConfigured() {
  return !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM);
}

function ensureEmailConfig() {
  console.log('📧 Email Configuration Check:');
  console.log('  SMTP_HOST:', SMTP_HOST || '❌ Missing');
  console.log('  SMTP_PORT:', SMTP_PORT || '❌ Missing');
  console.log('  SMTP_USER:', SMTP_USER || '❌ Missing');
  console.log('  SMTP_PASS:', SMTP_PASS ? '✅ Present' : '❌ Missing');
  console.log('  SMTP_FROM:', SMTP_FROM || '❌ Missing');

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error('Email service not configured. Set SMTP_* vars in .env');
  }
  // Gmail App Password is 16 chars; if SMTP_PASS has spaces, use quotes in .env: SMTP_PASS="xxxx xxxx xxxx xxxx"
  const passLen = (SMTP_PASS || '').replace(/\s/g, '').length;
  if (passLen > 0 && passLen < 16 && (SMTP_HOST || '').includes('gmail')) {
    console.warn('⚠️ SMTP_PASS looks short (' + passLen + ' chars). In .env use quotes: SMTP_PASS="your app password"');
  }
}

/** OTP email HTML (shared by Resend and SMTP). */
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

async function sendOtpEmail({ to, otp }) {
  try {
    console.log('📧 Preparing to send OTP email...');
    console.log('  To:', to);
    console.log('  OTP:', otp);

    // Skip actual send when testing (e.g. Thunder Client) - set SKIP_EMAIL_SEND=1 in .env
    const skipEnv = (process.env.SKIP_EMAIL_SEND || '').toString().trim().toLowerCase();
    const skipSend = skipEnv === '1' || skipEnv === 'true' || skipEnv === 'yes';
    if (skipSend) {
      console.log('⏭️ SKIP_EMAIL_SEND is set – not sending email. OTP for', to, ':', otp);
      return { messageId: 'skip-' + Date.now(), response: 'Skipped for testing' };
    }

    const transporter = createTransport();
    
    // Remove any quotes from SMTP_FROM
    const cleanFrom = SMTP_FROM.replace(/["']/g, '').trim();
    
    const subject = 'WorkNex Password Reset OTP';
    const { text, html } = getOtpEmailContent(otp);

    console.log('📧 Sending email from:', cleanFrom);
    console.log('📧 Sending email to:', to);
    
    const sendWithRetry = async (attempt = 1) => {
      const maxAttempts = 2;
      try {
        return await transporter.sendMail({
          from: cleanFrom,
          to,
          subject,
          text,
          html
        });
      } catch (err) {
        const isTimeout = err.code === 'ETIMEDOUT' || err.code === 'ESOCKET' || /timeout/i.test(err.message || '');
        if (isTimeout && attempt < maxAttempts) {
          console.log(`📧 Send attempt ${attempt} timed out, retrying (${attempt + 1}/${maxAttempts})...`);
          return sendWithRetry(attempt + 1);
        }
        throw err;
      }
    };

    const info = await sendWithRetry();

    console.log('✅ Email sent successfully!');
    console.log('  Message ID:', info.messageId);
    console.log('  Response:', info.response);
    
    return info;

  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('  Error name:', error.name);
    console.error('  Error message:', error.message);
    console.error('  Error code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.error('\n🚨 AUTHENTICATION FAILED:');
      console.error('  - Check if SMTP_USER is correct:', SMTP_USER);
      console.error('  - Check if SMTP_PASS (App Password) is correct');
      console.error('  - For Gmail, enable 2FA and create App Password at: https://myaccount.google.com/apppasswords');
      console.error('  - App Password format: "xxxx xxxx xxxx xxxx" (4 groups of 4)');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('\n🚨 CONNECTION FAILED:');
      console.error('  - Check SMTP_HOST:', SMTP_HOST, 'SMTP_PORT:', SMTP_PORT);
    } else if (error.responseCode === 550 || error.responseCode === 554) {
      console.error('\n🚨 EMAIL REJECTED:');
      console.error('  - Recipient email might be invalid');
      console.error('  - Check spam/junk folder');
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

module.exports = { sendOtpEmail, isEmailConfigured };