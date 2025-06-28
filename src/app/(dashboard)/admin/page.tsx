import React from 'react'
import UserCard from '@/components/UserCard'
import FinanceChart from '@/components/FinanceChart'
import EventCalendar from '@/components/EventCalender'
import Announcements from '@/components/Announcements'
import CountChartContainer from '@/components/CountChartContainer'
import AttendanceChartContainer from '@/components/AttendanceChartContainer'
import EventCalendarContainer from '@/components/EventCalendarContainer'
const AdminPage=async({searchParams}:{searchParams:{[key:string]:string |undefined}})=> {
  return (
    <div className='flex flex-col md:flex-row gap-4 p-4'>

      {/* LeftSide */}
      <div className="w-full flex flex-col gap-8 lg:w-2/3">
      {/* Cards */}
      <div className='justify-between gap-4 flex flex-wrap'>
      <UserCard type='admin'/>
      <UserCard type='teacher'/>
      <UserCard type='student'/>
      <UserCard type='parent'/>
      </div>

      {/* Middle Charts */}
      <div className="flex flex-col gap-4 lg:flex-row">
      {/* CountChart */}
      <div className="w-full lg:w-1/3 h-[450]">
    <CountChartContainer/>
      </div>
      
      {/* Attendance Chart */}
      <div className="w-full lg:w-2/3 h-[450]">
      <AttendanceChartContainer/>
      </div>

      </div>



      {/* Bottom Charts */}
      <div className="">
        <FinanceChart></FinanceChart>
      </div>
      </div>

      <div className="w-full lg:w-1/3">
      <EventCalendarContainer searchParams={searchParams}/>
      <Announcements></Announcements>
      </div>
    </div>
  )
}

export default AdminPage