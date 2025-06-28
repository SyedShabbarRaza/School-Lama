import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Announcements =async () => {

  const {sessionClaims,userId}=await auth();
  const role=(sessionClaims?.metadata as {role?:string})?.role;
  const currentUserId=userId;

  // teacher:{
  //   lessons:{some:{teacherId:currentUserId!}}
  // },

//  teacher:{
//     lessons:{teacherId:currentUserId!}
//   },
  //ROLE CONDITIONS
  const roleConditions={
    teacher:{
      lessons:{some:{teacherId:currentUserId!}}  
      /* Aggar lesson [] na hoti to simply (some "A prisma filter") ky bgair query lga sakty thy BUT Abhi [] ki waja sy some =>Which means: "at least one of the lessons has teacherId === currentUserId".*/
    },
    student:{
      students:{some:{id:currentUserId!}}
    },
    parent:{
      students:{some:{parentId:currentUserId!}}
    },
  }
  const data=await prisma.announcement.findMany({
    take:3,
    orderBy:{date:'desc'},
  where:{
    ...(role!=="admin"&&{
          OR:[
      {classId:null},
      {
        class:roleConditions[role as keyof typeof roleConditions]||{}
      }
    ]
    })
  }
}  
  )
   return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
          </div>
        )}
        {data[1] && (
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;