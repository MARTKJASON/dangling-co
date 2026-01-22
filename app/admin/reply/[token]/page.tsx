import AdminReplyPage from "../AdminReplyPage";


interface PageProps {
  params: {
    token: string;
  };
}

export default function Page({ params }: PageProps) {
  const { token } = params;
  return <AdminReplyPage token={token} />;
}
