/**
 * Sends a real live email OTP using Nodemailer & SMTP (Gmail App Password, Brevo, SendGrid, Outlook, etc.)
 */
async function sendRealEmailOTP(recipientEmail, otpCode) {
  const user = process.env.SMTP_EMAIL || process.env.GMAIL_USER;
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !rawPass) {
    console.log(`[NOTIFIER INFO] Real Email OTP (${otpCode}) generated for ${recipientEmail}.`);
    console.log(`[SMTP CONFIG NOTICE] To deliver live emails to user inboxes, add SMTP_EMAIL and SMTP_PASS (Gmail App Password) to your Render environment variables.`);
    return { sent: false, reason: 'Missing SMTP credentials in process.env' };
  }

  try {
    const pass = rawPass.replace(/\s+/g, ''); // Strip any spaces copied from Google App Password box
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false, // Port 587 uses STARTTLS
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
      greetingTimeout: 15000
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; border-radius: 16px; background: #ffffff; border: 1px solid #e5e7eb;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ea580c; font-size: 26px; margin: 0;">RentMyThing</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Verified Indian Campus Marketplace</p>
        </div>
        <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 24px; text-align: center;">
          <p style="color: #9a3412; font-size: 14px; margin: 0 0 12px 0; font-weight: 600;">YOUR 6-DIGIT VERIFICATION CODE</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #ea580c; font-family: monospace;">
            ${otpCode}
          </div>
        </div>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-top: 24px;">
          Use this code to complete your campus verification on RentMyThing. This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"RentMyThing Verification" <${user}>`,
      to: recipientEmail,
      subject: `${otpCode} is your RentMyThing Campus Verification Code`,
      text: `Your RentMyThing campus verification code is: ${otpCode}. It expires in 10 minutes.`,
      html: htmlContent
    });

    console.log(`[EMAIL SENT SUCCESS] Live OTP email delivered to ${recipientEmail} (Message ID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL SEND FAILED] Error sending email to ${recipientEmail}:`, err.message);
    return { sent: false, error: err.message };
  }
}

/**
 * Sends a real live SMS or WhatsApp Business OTP using Fast2SMS (+91 Indian numbers) or Meta WhatsApp Cloud API
 */
async function sendRealSmsOTP(phoneNumber, otpCode) {
  const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);

  // Option 1: Official Meta WhatsApp Business Cloud API (1,000 free OTP conversations/month)
  const waToken = process.env.WHATSAPP_TOKEN;
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (waToken && waPhoneId) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${waPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${waToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `91${cleanNumber}`,
          type: 'text',
          text: {
            body: `🔐 *RentMyThing Campus Verification*\n\nYour 6-digit OTP code is: *${otpCode}*\n\nValid for 10 minutes. Do not share this code.`
          }
        })
      });
      const data = await response.json();
      console.log(`[WHATSAPP BUSINESS SUCCESS] WhatsApp OTP sent to +91 ${cleanNumber}`);
      return { sent: true, provider: 'whatsapp_cloud', response: data };
    } catch (err) {
      console.error(`[WHATSAPP CLOUD ERROR]`, err.message);
    }
  }

  // Option 2: Fast2SMS API (Supports Quick OTP & WhatsApp routing for Indian +91 numbers)
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  if (fast2smsKey) {
    try {
      let url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(fast2smsKey.trim())}&route=q&message=${encodeURIComponent('Your RentMyThing verification OTP is: ' + otpCode + '. Valid for 10 mins.')}&language=english&flash=0&numbers=${cleanNumber}`;
      let response = await fetch(url);
      let data = await response.json();
      console.log(`[FAST2SMS QUICK RESPONSE]`, JSON.stringify(data));

      if (!data.return) {
        // Fallback to Fast2SMS OTP route if Quick SMS route is restricted
        const otpUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(fast2smsKey.trim())}&route=otp&variables_values=${otpCode}&numbers=${cleanNumber}`;
        const otpResp = await fetch(otpUrl);
        data = await otpResp.json();
        console.log(`[FAST2SMS OTP ROUTE RESPONSE]`, JSON.stringify(data));
      }

      return {
        sent: data.return === true,
        provider: 'fast2sms',
        response: data,
        reason: data.message || (data.return ? 'Success' : 'Fast2SMS delivery failed')
      };
    } catch (err) {
      console.error(`[FAST2SMS ERROR]`, err.message);
      return { sent: false, provider: 'fast2sms', reason: err.message };
    }
  }

  // Option 3: Twilio SMS / WhatsApp
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const formattedPhone = `+91${cleanNumber}`;
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', formattedPhone);
      params.append('From', twilioFrom);
      params.append('Body', `RentMyThing Campus verification code: ${otpCode}. Valid for 10 minutes.`);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      const data = await response.json();
      console.log(`[TWILIO SUCCESS] SMS delivered to ${formattedPhone}`);
      return { sent: true, provider: 'twilio', response: data };
    } catch (err) {
      console.error(`[TWILIO ERROR]`, err.message);
    }
  }

  console.log(`[NOTIFIER INFO] Real Mobile OTP (${otpCode}) generated for +91 ${cleanNumber}.`);
  console.log(`[SMS CONFIG NOTICE] To deliver live WhatsApp or SMS messages, add FAST2SMS_API_KEY or WHATSAPP_TOKEN to your Render environment variables.`);
  return { sent: false, reason: 'Missing Fast2SMS or WhatsApp API keys' };
}

module.exports = {
  sendRealEmailOTP,
  sendRealSmsOTP
};
