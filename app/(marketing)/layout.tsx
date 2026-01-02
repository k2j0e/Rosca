import { MarketingHeader } from "../components/MarketingHeader";
import { MarketingFooter } from "../components/MarketingFooter";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col font-display bg-white dark:bg-gray-950 text-text-main dark:text-white overflow-x-hidden">
            <MarketingHeader />
            <main className="flex-1">
                {children}
            </main>
            <MarketingFooter />
        </div>
    );
}
