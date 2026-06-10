import nodemailer from 'nodemailer';

export const id = 'email';
export const label = 'Email';

export function isConfigured() {
  return Boolean(
    process.env.SMTP_HOST
    && process.env.SMTP_USER
    && process.env.SMTP_PASS
    && process.env.EMAIL_FROM
    && process.env.EMAIL_TO
  );
}

export async function publish({ body, image_url }) {
  if (!isConfigured()) {
    throw new Error('Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const html = [
    body ? `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;white-space:pre-wrap">${escapeHtml(body)}</div>` : '',
    image_url ? `<div style="margin-top:16px"><img src="${escapeAttr(image_url)}" alt="" style="max-width:100%;height:auto;border-radius:8px"/></div>` : '',
  ].join('');

  const subject = (body || '').split('\n')[0].slice(0, 80) || 'New post';

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject,
    text: body || '',
    html,
  });

  return { messageId: info.messageId };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(s) {
  return escapeHtml(s);
}
