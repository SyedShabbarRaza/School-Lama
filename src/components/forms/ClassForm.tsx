"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { classSchema, ClassSchema, } from "@/lib/formValidationSchemas";
import { createClass, updateClass } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClassForm = ({
  type,
  data,
  setOpen,
  relatedData
}: {
  type: "create" | "update";
  data?: any;
  setOpen:Dispatch<SetStateAction<boolean>>;
  relatedData:any
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });


  const [state,formAction]=useFormState(type==="create"?createClass:updateClass,{success:false,error:false})

  
  const onSubmit = handleSubmit((data) => {
    formAction(data)
  });
  
  const router=useRouter();

  useEffect(()=>{
    if(state.success){
      toast(`Class has been ${type==='create'?"created":"updated"} successfully`);
      setOpen(false);
      router.refresh();
    }
  },[state, router, type, setOpen])

  const {teachers,grades}=relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type==="create"?"Create a new class":"Update the class"}</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />
        {data&&<InputField
          label="Id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
          />}
          {/* <InputField
            label="Grade"
            name="gradeId" //Change kr ky dekhni hai {Kuch Masla hai}
            defaultValue={data?.gradeId}
            register={register}
            error={errors?.gradeId}
          /> */}
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grades</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
          >
          {grades.map((grades:{id:string;level:number})=>(
            <option value={grades.id} key={grades.id}>{grades.level}</option>
          ))} 
           {/* using map((i)=>{ Requires return }) onTheOtherHand map((i)=>( No need of return )) */}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
          >
          {teachers.map((teacher:{id:string;name:string})=>(
            <option value={teacher.id} key={teacher.id}>{teacher.name}</option>
          ))} 
           {/* using map((i)=>{ Requires return }) onTheOtherHand map((i)=>( No need of return )) */}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;