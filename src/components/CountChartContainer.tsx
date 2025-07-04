import Image from "next/image";
import React from "react";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
let data: any = [];
try {
  data = await prisma.student.groupBy({
    by: ["sex"],
    _count: { sex: true },
  });
} catch (err) {
  console.error("Error fetching count:", err);
}

const boys = data?.find((d: { sex: string; }) => d.sex === "MALE")?._count.sex || 0;
const girls = data?.find((d: { sex: string; }) => d.sex === "FEMALE")?._count.sex || 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="moreDark" width={20} height={20} />
      </div>
      <CountChart boys={boys} girls={girls} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-blue-500 rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-500">
            Boys (
            {boys + girls > 0 ? Math.round((boys / (boys + girls)) * 100) : 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-yellow-500 rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-500">
            Girls (
            {boys + girls > 0 ? Math.round((girls / (boys + girls)) * 100) : 0}
            %)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
