import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background relative">
      {/* Dark mode subtle ribbon gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 dark:block hidden overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[hsl(234_68%_60%/0.04)] blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[hsl(174_58%_46%/0.03)] blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(270_60%_55%/0.03)] blur-3xl" />
        <div className="absolute top-2/3 right-1/3 w-[350px] h-[350px] rounded-full bg-[hsl(160_50%_50%/0.025)] blur-3xl" />
      </div>
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
