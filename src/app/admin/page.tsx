import { AdminConsole } from "@/components/admin-console";
import { getEvents } from "@/services/events";
import { getPersons } from "@/services/persons";
import { getTimelines } from "@/services/timelines";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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
