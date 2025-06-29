"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value instanceof Date) {
      const formatted = value.toISOString().split("T")[0];
      router.push(`?date=${formatted}`);
    }
  }, [value, router]);

  if (!mounted) return null; // ⛔ prevent hydration mismatch

  return <Calendar onChange={onChange} value={value} />;
};

export default EventCalendar;
