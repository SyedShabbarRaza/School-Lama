import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Assignment, Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined};
}) => {
  
  const { userId, sessionClaims } =await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;
  
  
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
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role==="teacher"||role==="admin"?[
      {
      header: "Actions",
      accessor: "action",
    },
    ]:[])   

    //Can't use it like:

  // role === "admin"
  // ? { header: "Actions", accessor: "action" }
  // : {}
  //because Coulums is an array and when adding condition for actions it must be spreaded and as mentioned column is an array therefore it only accepts array to be added in it not the simple object as written all objects (that are not conditionally driven)

  ];
  
  const renderRow = (item: Assignment &{lesson:{subject:Subject,class:Class,teacher:Teacher}}) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-300"
    >
      <td className="flex items-center gap-4 p-4">{item.lesson.subject.name}</td>
      <td>{item.lesson.class.name}</td>
      <td className="hidden md:table-cell">{item.lesson.teacher.name}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.dueDate)}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" || role === "teacher" && (
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  
  const {page,...QueryParams}=searchParams;
  
  const p=page ? parseInt(page):1;
  
  // URL PARAMS CONDITION

  const query: Prisma.AssignmentWhereInput = {};
  query.lesson={};
  
  if (QueryParams) {
    for (const [key, value] of Object.entries(QueryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.lesson = {
              teacherId:value
            };
            break;
          case "search":
            query.lesson = { 
              subject:{
                name:{contains:value, mode:"insensitive"}
              }
             };
            break;
          default:
            break;
        }
      }
    }
  }

   switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = currentUserId!;
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: currentUserId!,
          },
        },
      };
      break;
    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      break;
    default:
      break;
  }

   const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson:{
          select:{
            subject:{select:{name:true}},
            class:{select:{name:true}},
            teacher:{select:{name:true}}
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.assignment.count({ where: query }), 
  ]);
  // console.log(data);


  
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-300">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-300">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" || role === "teacher" && <FormModal table="assignment" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentListPage;