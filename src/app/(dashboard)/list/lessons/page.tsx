import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";


const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined};
}) => {

  const {sessionClaims,userId}=await auth();
  const role=(sessionClaims?.metadata as {role?:string})?.role;
  const currentUserId=userId;

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    ...(role==="admin"?[{
      header: "Actions",
      accessor: "action",
    },]:[])
  ];
  const renderRow = (item: Lesson &{subject:Subject}&{teacher:Teacher}&{class:Class
  }) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">{item.teacher.name}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="lesson" type="update" data={item} />
              <FormModal table="lesson" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );


  const {page,...QueryParams}=searchParams;

  const p=page ? parseInt(page):1;

 // URL PARAMS CONDITION

  const query: Prisma.LessonWhereInput = {};

  if (QueryParams) {
    for (const [key, value] of Object.entries(QueryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classId=parseInt(value);
            break;
          case "teacherId":
            query.teacherId=value;
            break;
          case "search":
            query.OR=[
              {
                subject:{name: { contains: value, mode: "insensitive" }}
              },
              {
                teacher:{name: { contains: value, mode: "insensitive" }}

              }
            ];
            break;
          default:
            break;
        }
      }
    }
  }


  // switch(role){
  //   case "admin":
  //     break;
  //   case "student":
  //     query.class={
  //       students:{
  //         some:{
  //           id:currentUserId!,
  //         }
  //       }
  //     }
  //     break;
  //   case "teacher":
  //     query.teacherId=currentUserId!;
  //     break;
  //     default:
  //       break;
  // }


   const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject:{select:{name:true}},
        class:{select:{name:true}},
        teacher:{select:{name:true}},
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({ where: query }), 
  ]);
  // console.log(data);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="lesson" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination count={count} page={p}/>
    </div>
  );
};

export default LessonListPage;