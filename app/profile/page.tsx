
import { signOutAction } from "../actions";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { getLedgerHistory } from "@/lib/ledger";
import ProfileView from "./ProfileView";

export default async function ProfileScreen() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/welcome');
    }

    if (user.isBanned) {
        redirect('/suspended');
    }

    // Fetch immutable history instead of JSON blob
    const history = await getLedgerHistory({
        userId: user.id,
        limit: 10
    });

    return <ProfileView user={user} history={history} />;
}
