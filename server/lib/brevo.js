let apiInstance = null;
function getApi() {
  if (!apiInstance) {
    try { const sdk = require('@getbrevo/brevo'); apiInstance = new sdk.TransactionalEmailsApi(); apiInstance.setApiKey(sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || ''); } catch {}
  }
  return apiInstance;
}
const FROM = { email: process.env.BREVO_FROM_EMAIL || 'noreply@eventverse.com', name: process.env.BREVO_FROM_NAME || 'EventVerse' };
async function sendEmail({ to, toName, subject, html }) {
  if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your_brevo_api_key_here') {
    console.log(`📧 [Brevo MOCK] To: ${to} | Subject: ${subject}`);
    return { messageId: 'mock-' + Date.now() };
  }
  try {
    const sdk = require('@getbrevo/brevo');
    const email = new sdk.SendSmtpEmail();
    email.sender = FROM; email.to = [{ email: to, name: toName || to }]; email.subject = subject; email.htmlContent = html;
    const api = getApi(); if (!api) return null;
    const res = await api.sendTransacEmail(email);
    return res.body;
  } catch (err) { console.error('Brevo error:', err.message); return null; }
}
function bookingConfirmHTML(b) {
  return `<!DOCTYPE html><html><body style="background:#0F0F1A;font-family:Inter,sans-serif;color:#E2E8F0;padding:20px"><div style="max-width:560px;margin:0 auto;background:#1A1A2E;border-radius:16px;overflow:hidden;border:1px solid rgba(108,43,217,0.3)"><div style="background:linear-gradient(135deg,#6C2BD9,#EC4899);padding:24px"><h1 style="color:#fff;margin:0;font-size:20px;font-weight:900">⚡ EventVerse — Booking Confirmed</h1></div><div style="padding:28px"><p style="color:#E2E8F0">Hi <strong>${b.userName}</strong>,</p><p style="color:#94a3b8">Your booking is confirmed and <strong>pending admin approval</strong>.</p><div style="background:rgba(108,43,217,0.08);border:1px solid rgba(108,43,217,0.2);border-radius:12px;padding:16px;margin:20px 0"><h2 style="color:#fff;margin:0 0 12px;font-size:16px">${b.eventTitle}</h2><p style="color:#94a3b8;margin:4px 0;font-size:13px">📅 ${b.eventDate || ''}</p><p style="color:#94a3b8;margin:4px 0;font-size:13px">📍 ${b.eventVenue || ''}</p><p style="color:#94a3b8;margin:4px 0;font-size:13px">🎫 ${b.ticketType} × ${b.quantity}</p><p style="color:#A78BFA;margin:12px 0 0;font-size:16px;font-weight:700">Total: $${b.total}</p></div><div style="background:rgba(108,43,217,0.05);border:1px solid rgba(108,43,217,0.15);border-radius:12px;padding:14px;text-align:center"><p style="color:#94a3b8;font-size:11px;margin:0 0 6px">🔐 TICKET CODE</p><p style="font-family:monospace;color:#A78BFA;font-size:22px;font-weight:900;margin:0;letter-spacing:4px">${b.ticketCode}</p></div><p style="color:#64748b;font-size:12px;margin-top:20px;text-align:center">Questions? <a href="mailto:support@eventverse.com" style="color:#A78BFA">support@eventverse.com</a></p></div></div></body></html>`;
}
function welcomeHTML(name) {
  return `<!DOCTYPE html><html><body style="background:#0F0F1A;font-family:Inter,sans-serif;color:#E2E8F0;padding:20px"><div style="max-width:520px;margin:0 auto;background:#1A1A2E;border-radius:16px;overflow:hidden;border:1px solid rgba(108,43,217,0.3)"><div style="background:linear-gradient(135deg,#6C2BD9,#EC4899);padding:28px;text-align:center"><h1 style="color:#fff;margin:0;font-size:22px;font-weight:900">⚡ EventVerse</h1><p style="color:rgba(255,255,255,0.8);margin:6px 0 0">Welcome to the world's best live event platform!</p></div><div style="padding:28px;text-align:center"><p style="color:#E2E8F0;font-size:17px">Hi <strong>${name}</strong> 👋</p><p style="color:#94a3b8;line-height:1.6">Your account is ready. Explore 187+ events across 40+ countries.</p><div style="background:rgba(108,43,217,0.08);border-radius:12px;padding:18px;margin:20px 0"><p style="color:#A78BFA;font-weight:700;margin:0 0 6px">🎁 Welcome Gift</p><p style="color:#E2E8F0;font-size:20px;font-weight:900;margin:0">Use code <span style="color:#A78BFA">SAVE25</span></p><p style="color:#94a3b8;font-size:12px;margin:4px 0 0">25% off your first booking!</p></div><a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#6C2BD9,#EC4899);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px">Browse Events →</a></div></div></body></html>`;
}
module.exports = { sendEmail, bookingConfirmHTML, welcomeHTML };
