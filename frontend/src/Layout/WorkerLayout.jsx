import WorkerSidebar from "../Components/sidebar/WorkerSidebar";

export default function WorkerLayout({ children }) {
  return (
    <div className="flex">

      <WorkerSidebar />

      <main className="flex-1 p-6 bg-blue-50 min-h-screen">
        {children}
      </main>

    </div>
  );
}