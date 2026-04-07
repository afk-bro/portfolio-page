import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL ?? "blockandflow@gmail.com";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, message, honeypot } = body;

  // Silent discard for bots
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  // Server-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 },
    );
  }
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const senderName = name?.trim() || "Anonymous";
  const subject = name?.trim()
    ? `Portfolio contact from ${name.trim()}`
    : "New portfolio contact form message";

  const autoReplyText = [
    `Hi${name?.trim() ? ` ${name.trim()}` : ""},`,
    "",
    "Thanks for reaching out — I've received your message and will get back to you within 24–48 hours.",
    "",
    "— Tom Horne",
    "https://tomhorne.dev",
    "",
    "---",
    "Your message:",
    message,
  ].join("\n");

  const autoReplyHtml = `
    <p>Hi${name?.trim() ? ` ${name.trim()}` : ""},</p>
    <p>Thanks for reaching out — I've received your message and will get back to you within 24–48 hours.</p>
    <p>— Tom Horne<br /><a href="https://tomhorne.dev">tomhorne.dev</a></p>
    <hr />
    <p style="color:#888;font-size:13px"><em>Your message:</em></p>
    <p style="color:#555;white-space:pre-wrap;font-size:13px">${message}</p>
  `;

  try {
    await Promise.all([
      resend.emails.send({
        from: "Portfolio Contact <contact@tomhorne.dev>",
        to: TO_EMAIL,
        replyTo: email,
        subject,
        text: `From: ${senderName}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>From:</strong> ${senderName}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><hr /><p style="white-space:pre-wrap">${message}</p>`,
      }),
      resend.emails.send({
        from: "Tom Horne <contact@tomhorne.dev>",
        to: email,
        subject: "Thanks for your message",
        text: autoReplyText,
        html: autoReplyHtml,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try emailing directly." },
      { status: 500 },
    );
  }
}
