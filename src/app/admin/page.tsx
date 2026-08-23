import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { getAdminEvents } from "@/repositories/events";
import { getAdminPersons } from "@/repositories/persons";
import { getAdminTimelines } from "@/repositories/timelines";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isAdminApiEnabled } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminApiEnabled()) {
    notFound();
  }

  const authenticated = await isAdminAuthenticated();
  const [events, persons, timelines] = await Promise.all([
    getAdminEvents(),
    getAdminPersons(),
    getAdminTimelines()
  ]);

  return (
    <AdminConsole
      initialAuthenticated={authenticated}
      initialEvents={events}
      initialPersons={persons}
      initialTimelines={timelines}
    />
  );
}
