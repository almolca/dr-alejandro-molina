import AdminLoginForm from "./LoginForm";
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  return <AdminLoginForm resetSuccess={(await searchParams).reset === "success"} />;
}
