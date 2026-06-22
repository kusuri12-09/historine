import { AdminConsole } from "@/components/admin-console";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  return <AdminConsole initialAuthenticated={authenticated} />;
}
