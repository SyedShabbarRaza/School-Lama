import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@/lib/settings";

type AttendanceType = {
  id: number;
  date: Date;
  status: string;
  studentName: string;
  className: string;
};

export default async function AttendanceListPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId!;

  // Search & pagination
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");
  const skip = (page - 1) * ITEM_PER_PAGE;

  // Role-based query
  const where: any = {};
  if (search) {
    where.student = { name: { contains: search, mode: "insensitive" } };
  }
  switch (role) {
    case "student":
      where.studentId = currentUserId;
      break;
    case "parent":
      where.student = { parentId: currentUserId };
      break;
    case "teacher":
      where.lesson = { teacherId: currentUserId };
      break;
    case "admin":
    default:
      break;
  }

  // Fetch data
  const [attendanceList, total] = await prisma.$transaction([
    prisma.attendance.findMany({
      where,
      include: {
        student: { select: { name: true } },
        lesson: {
          select: {
            class: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { date: "desc" },
      skip,
      take: ITEM_PER_PAGE,
    }),
    prisma.attendance.count({ where }),
  ]);

  // Map to display format
  const data: AttendanceType[] = attendanceList.map((a) => ({
    id: a.id,
    date: a.date,
    status: a.present ? "Present" : "Absent",
    studentName: a.student.name,
    className: a.lesson.class.name,
  }));

  // Define columns conditionally
  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Student", accessor: "studentName" },
    {
      header: "Class",
      accessor: "className",
      className: "hidden md:table-cell",
    },

    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Actions", accessor: "action" }]
      : []),
  ];

  // Render each row
  const renderRow = (item: AttendanceType) => (
    <tr
      key={item.id}
      className="border-b even:bg-gray-50 text-sm hover:bg-purple-100"
    >
      <td>{new Intl.DateTimeFormat("en-US").format(item.date)}</td>
      <td>{item.studentName}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className={`hidden md:table-cell text-lg ${item.status==='Present'?"text-green-500":"text-red-500"}`}>{item.status}</td>
      {(role === "admin" || role === "teacher") && (
        <td className="flex gap-2">
          <FormModal table="attendance" type="update" data={item} />
          <FormModal table="attendance" type="delete" id={item.id} />
        </td>
      )}
    </tr>
  );

  return (
    <div className="bg-white rounded-md p-6 m-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Attendance Records</h1>
        <div className="flex gap-4 items-center w-full md:w-auto mt-4 md:mt-0">
          <TableSearch />
          <button className="btn-icon">
            <Image src="/filter.png" alt="Filter" width={20} height={20} />
          </button>
          <button className="btn-icon">
            <Image src="/sort.png" alt="Sort" width={20} height={20} />
          </button>
          {(role === "admin" || role === "teacher") && (
            <FormModal table="attendance" type="create"></FormModal>
          )}
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={page} count={total} />
    </div>
  );
}
