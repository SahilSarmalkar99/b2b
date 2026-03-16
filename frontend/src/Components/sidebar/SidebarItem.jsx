import { Link } from "react-router-dom";

export default function SidebarItem({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}