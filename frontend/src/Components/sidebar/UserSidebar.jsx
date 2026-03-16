import SidebarItem from "./SidebarItem";
import { Home, PlusCircle, Ticket } from "lucide-react";

export default function UserSidebar() {
  return (
    <div className="w-64 bg-white shadow-md p-4 min-h-screen">

      <h2 className="text-xl font-bold mb-6">
        User Panel
      </h2>

      <div className="flex flex-col gap-2">

        <SidebarItem
          icon={<Home size={18} />}
          label="Dashboard"
          to="/user/dashboard"
        />

        <SidebarItem
          icon={<PlusCircle size={18} />}
          label="Create Ticket"
          to="/user/create-ticket"
        />

        <SidebarItem
          icon={<Ticket size={18} />}
          label="My Tickets"
          to="/user/my-tickets"
        />

      </div>

    </div>
  );
}