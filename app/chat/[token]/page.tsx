// app/chat/[token]/page.tsx

import UserChat from "@/app/components/UserChat";


interface ChatPageProps {
  params: { token: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  // params might be async in App Router
  const token = await params.token; // unwrap if needed

  if (!token) return <p>Invalid token</p>;

  return <UserChat token={token} />;
}
