import SidebarItem from "./SidebarItem";
import { Home, ClipboardList, CheckCircle } from "lucide-react";

export default function WorkerSidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white p-4 min-h-screen">

      <h2 className="text-xl font-bold mb-6">
        Worker Panel
      </h2>

      <div className="flex flex-col gap-2">

        <SidebarItem
          icon={<Home size={18} />}
          label="Dashboard"
          to="/worker/dashboard"
        />

        <SidebarItem
          icon={<ClipboardList size={18} />}
          label="Available Tickets"
          to="/worker/tickets"
        />

        <SidebarItem
          icon={<CheckCircle size={18} />}
          label="Accepted Work"
          to="/worker/work"
        />

      </div>

    </div>
  );
}