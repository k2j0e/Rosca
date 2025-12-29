"use strict";

import { MOCK_USER, getCurrentUser } from "@/lib/data";
import ProfileView from "./ProfileView";

export default async function ProfileScreen() {
    const user = await getCurrentUser() || MOCK_USER;

    return <ProfileView user={user} />;
}
