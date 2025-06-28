import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
// import EventCalendar from "@/components/EventCalender";

const TeacherPage = async() => {
  const {userId}=await auth();
  const currentUserId=userId;

  const students=await prisma.student.findMany({
    where:{
      parentId:currentUserId!, //Us students ka data laao jis ky Father field mein meri id ho
    }
  })
  return (
    <div className="p-4 flex flex-1 gap-4 flex-col lg:flex-row">
      {/* LEFT */}
      <div className="">
        {
          students.map((student)=>(
            <div key={student.id} className="w-full lg:w-2/3">
        <div className="h-[550px] bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule {student.name+ " " + student.surname}</h1>
          <BigCalendarContainer id={student.classId} type="classId"/>
        </div>
      </div>
          ))
        }
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* <EventCalendar /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;