import { notFound } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
import { getEvents } from "@/repositories/events";
import { getPersons } from "@/repositories/persons";
import { getTimelines } from "@/repositories/timelines";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isAdminApiEnabled } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminApiEnabled()) {
    notFound();
  }

  const authenticated = await isAdminAuthenticated();
  const [events, persons, timelines] = await Promise.all([
    getEvents(),
    getPersons(),
    getTimelines()
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
