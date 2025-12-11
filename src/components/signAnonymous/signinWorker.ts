
import { sleep } from "workflow";
import { deleteUser } from "./deleteUser";

export async function signinWorker(userId: string) {
    "use workflow";
    const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await sleep(twoWeeksFromNow);
    await deleteUser(userId);
}