import AdminLogsPanel from "../../components/AdminLogsPanel";

export default function AdminLogs() {
    return (
        <div className="min-h-screen bg-[#f4f7fa] font-sans">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-[#355872]">Admin Logs</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Order, activity, and auth logs
                    </p>
                </div>
            </div>

            <div className="px-6 py-5 max-w-screen-2xl mx-auto">
                <AdminLogsPanel title="Admin Logs" defaultTab="order" limit={20} />
            </div>
        </div>
    );
}
