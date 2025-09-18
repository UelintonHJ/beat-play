import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <div className="flex h-screen bg-neutral-900 text-white">
            {/* Sidebar fixa */}
            <Sidebar user={session?.user || undefined} />

            {/* Conteúdo do Dashboard */}
            <main className="flex-1 pp-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}