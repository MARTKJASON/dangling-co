import fs from 'fs/promises';
import path from 'path';

const CONVERSATIONS_DIR = path.join(process.cwd(), 'data/conversations');

async function loadConversation(token: string) {
  const filePath = path.join(CONVERSATIONS_DIR, `${token}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token required' }),
        { status: 400 }
      );
    }

    const conversation = await loadConversation(token);

    if (!conversation) {
      return new Response(
        JSON.stringify({ success: false, error: 'Conversation not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          token: conversation.token,
          email: conversation.email,
          productName: conversation.productName,
          productPrice: conversation.productPrice,
          productImage: conversation.productImage,
          userMessage: conversation.message,
          messages: conversation.messages || [],
          createdAt: conversation.createdAt,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('🔥 GET conversation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
