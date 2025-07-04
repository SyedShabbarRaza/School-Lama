import React from 'react'
import FormModal from './FormModal';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
export type FormContainerProps={
  table:
    | "teacher"
    | "student"
    | "subject"
    | "class"
    | "exam"
    | "parent"
    | "lesson"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number|string;
}

const FormContainer=async ({
  table,
  type,
  data,
  id,
}: FormContainerProps)=> {
    let relatedData={};//For updating
    const {sessionClaims,userId}=await auth();
    const role=(sessionClaims?.metadata as {role: string})?.role;
    const currentUserId=userId;

    if(type!="delete"){

        switch(table){
            case "subject":
                const subjectTeachers= await prisma.teacher.findMany({
                    select:{id:true,name:true},
                })
                relatedData={teachers:subjectTeachers};
                break;
            case "class":
                const classTeachers= await prisma.teacher.findMany({
                    select:{id:true,name:true},
                })
                const classGrades= await prisma.grade.findMany({
                    select:{id:true,level:true},
                })
                relatedData={teachers:classTeachers,grades:classGrades};
                break;
            case "teacher":
                const teacherSubjects= await prisma.subject.findMany({
                    select:{id:true,name:true},
                })
                relatedData={subjects:teacherSubjects};
                break;
            case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;

      default:
        break;
        }
    }
  return (
    <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData}/>
  )
}

export default FormContainer