import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) return new Response('No message', { status: 400 });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: 'New Order Inquiry',
    text: message,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
