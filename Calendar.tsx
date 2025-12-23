"use client";
import { get } from "http";
import styles from "./Calendar.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";
import { date } from "yup";
import { set } from "react-hook-form";

const Calendar: React.FC<CalendarProps> = ({
  label,
  initialDate,
  minDate,
  maxDate,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || null
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    initialDate || new Date()
  );
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "Choose Date";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getMonthName = (date: Date): string => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[date.getMonth()];
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const renderWeekDay = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days.map((day) => (
      <div key={day} className={styles.weekDay}>
        {day}
      </div>
    ));
  };

  const getDayInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCaledarDays = () => {
    const days: (number | null)[] = [];
    const dayInMonth = getDayInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const emptyState = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < emptyState; i++) {
      days.push(null);
    }
    for (let day = 1; day <= dayInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const renderDay = () => {
    const days = generateCaledarDays();

    return days.map((day, index) => {
      if (day === null) {
        return <div key={index} className={styles.emptyDay}></div>;
      }
      const today = new Date();
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear();

      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      return (
        <div
          key={index}
          className={`${styles.day} ${isToday ? styles.today : ""} ${
            isSelected ? styles.selectedDay : ""
          }`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    });
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(selected);
    setIsOpen(false);

    if (onChange) {
      onChange(selected);
    }
  }

  return (
    <div className={styles.calendar} ref={calendarRef}>
      <label className={styles.label}>{label}</label>

      <div className={styles.calendarWrapper}>
        <div className={styles.dateInput} onClick={() => setIsOpen(!isOpen)}>
          <span className={styles.selectedText}>
            {formatDate(selectedDate)}
          </span>
          <span className={styles.icon}>
            <FaRegCalendarAlt />
          </span>
        </div>

        {isOpen && (
          <div className={styles.calendarPopup}>
            <div className={styles.header}>
              <button type="button" className={styles.navButton} onClick={goToPreviousMonth}>
                <TiArrowLeftThick />
              </button>
              <span className={styles.monthYear}>
                {getMonthName(currentMonth)} {currentMonth.getFullYear()}
              </span>
              <button type="button" className={styles.navButton} onClick={goToNextMonth}>
                <TiArrowRightThick />
              </button>
            </div>
            <div className={styles.weekdays}>{renderWeekDay()}</div>
            <div className={styles.daysGrid}>{renderDay()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
