import UserSidebar from "../Components/sidebar/UserSidebar";

export default function UserLayout({ children }) {
  return (
    <div className="flex">

      <UserSidebar />

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        {children}
      </main>

    </div>
  );
}