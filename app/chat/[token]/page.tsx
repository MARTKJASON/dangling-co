// app/chat/[token]/page.tsx

import UserChat from "@/app/components/UserChat";


interface ChatPageProps {
  params: Promise<{ token: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { token } = await params;

  if (!token) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <p className="px-4 py-3 bg-cherry-100 text-cherry-700 rounded-field text-[15px]">Invalid chat link.</p>
      </div>
    );
  }

  return <UserChat token={token} />;
}
