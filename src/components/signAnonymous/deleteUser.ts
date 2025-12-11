
import { auth } from "@/app/lib/auth";

export async function deleteUser(idUser: string) {
    "use step"
    const {success} = await auth.api.removeUser({body:{userId:idUser}});
    return success;
}
