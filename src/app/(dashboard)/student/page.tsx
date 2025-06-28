import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalender";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { id } from "zod/v4/locales";

const StudentPage =async () => {
    const {userId}=await auth();
  const classItem=await prisma.class.findMany({
    where:{
      students:{some:{id:userId!}}
    }
  })
  return (
    <div className="p-4 flex gap-4 flex-col lg:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        <div className="h-[550] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendarContainer id={classItem[0].id} type="classId"/>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;