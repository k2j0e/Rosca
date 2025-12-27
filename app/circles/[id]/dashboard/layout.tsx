import { notFound } from "next/navigation";
import { getCircle, getCurrentUser } from "@/lib/data";
import DashboardNav from "./DashboardNav";

export default async function DashboardLayout(props: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const { children } = props;
    const circle = await getCircle(params.id);
    const currentUser = await getCurrentUser();

    if (!circle) {
        notFound();
    }

    const isAdmin = currentUser?.id === circle.adminId;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col antialiased selection:bg-primary/20 max-w-md mx-auto relative overflow-x-hidden font-display text-text-main dark:text-white">
            <DashboardNav
                circleId={circle.id}
                circleName={circle.name}
                isAdmin={isAdmin}
            />
            {children}
        </div>
    );
}
