import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';

const CONVERSATIONS_DIR = path.join(process.cwd(), 'data/conversations');

async function loadConversation(token: string) {
  const filePath = path.join(CONVERSATIONS_DIR, `${token}.json`);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function saveConversation(token: string, data: any) {
  const filePath = path.join(CONVERSATIONS_DIR, `${token}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, message, sender } = body;

    if (!token || !message || !sender) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Load conversation
    let conversation;
    try {
      conversation = await loadConversation(token);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: 'Conversation not found' }),
        { status: 404 }
      );
    }

    // Add new message
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: message,
      sender: sender,
      timestamp: new Date().toISOString(),
    };

    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date().toISOString();

    // Save updated conversation
    await saveConversation(token, conversation);

    // If user sent reply, email admin
    if (sender === 'user' && conversation.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const adminLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reply/${token}`;

        await transporter.sendMail({
          from: `"Website Inquiry" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `📨 Reply from ${conversation.email}: ${conversation.productName}`,
          html: `
            <p>New reply from customer:</p>
            <blockquote style="border-left: 3px solid #3b82f6; padding-left: 15px;">
              ${message.replace(/\n/g, '<br>')}
            </blockquote>
            <p><a href="${adminLink}">View conversation</a></p>
          `,
          text: message,
        });

        console.log(`✅ Admin notified of new reply from ${conversation.email}`);
      } catch (emailError) {
        console.error('⚠️ Failed to send admin notification:', emailError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: newMessage,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('🔥 addReply error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}