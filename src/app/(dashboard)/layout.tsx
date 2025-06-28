import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import AdminPage from "./admin/page";
import StudentPage from "./student/page";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
                  //h-screen=Scrolling (applied on parent)
    <div className="h-screen flex">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xlg:w[14%] overflow-scroll">
        <Menu></Menu>
      </div>

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w[86%] overflow-scroll flex flex-col">
        <Navbar></Navbar>
        {children}
      </div>
    </div>
  );
}
