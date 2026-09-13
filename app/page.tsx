import AppShell from "@/components/AppShell";
import { getAuthenticatedUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await getAuthenticatedUser();
  return <AppShell user={user} />;
}
