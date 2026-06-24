import { successResponse, withAdminJson } from "@/lib/admin-route";
import { validateEncyclopediaBody } from "@/lib/admin-validators";
import { addPerson } from "@/services/persons";

export const POST = withAdminJson(validateEncyclopediaBody, async (body) => {
  const person = await addPerson(body);
  return successResponse(person, 201);
});
