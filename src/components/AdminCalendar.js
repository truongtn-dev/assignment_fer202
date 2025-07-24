import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [calendarRes, subjectsRes] = await Promise.all([
        axios.get("http://localhost:5000/calendar"),
        axios.get("http://localhost:5000/subjects"),
      ]);

      const calendarEvents = calendarRes.data.map((e) => ({
        id: `cal-${e.id}`,
        title: e.title,
        start: e.date,
        source: "calendar",
      }));

      const subjectEvents = subjectsRes.data
        .filter((s) => s.startDate)
        .map((s) => {
          const [day, month, year] = s.startDate.split("/");
          const formattedDate = `${year}-${month.padStart(
            2,
            "0"
          )}-${day.padStart(2, "0")}`;
          return {
            id: `sub-${s.id}`,
            title: `${s.title} (${s.time || ""})`,
            start: formattedDate,
            backgroundColor: "#E0F7FA",
            borderColor: "#00ACC1",
            textColor: "#006064",
            source: "subject",
          };
        });

      setEvents([...calendarEvents, ...subjectEvents]);
    };

    fetchData();
  }, []);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleDateClick = async (info) => {
    const { value: title } = await Swal.fire({
      title: "Add new event",
      input: "text",
      inputLabel: "Event title:",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Please enter an event title";
      },
    });

    if (title) {
      const newEvent = { title, date: info.dateStr };
      const res = await axios.post("http://localhost:5000/calendar", newEvent);
      setEvents((prev) => [
        ...prev,
        {
          id: `cal-${res.data.id}`,
          title: res.data.title,
          start: res.data.date,
          source: "calendar",
        },
      ]);
      toast.success("New event added!");
    }
  };

  const handleEventClick = async (info) => {
    if (!info.event.id.startsWith("cal-")) return;

    const { value: action } = await Swal.fire({
      title: "Edit event",
      input: "text",
      inputValue: info.event.title,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Update",
      denyButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    const eventId = info.event.id.replace("cal-", "");

    if (action === false) {
      const confirmDelete = await Swal.fire({
        title: "Are you sure to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (confirmDelete.isConfirmed) {
        await axios.delete(`http://localhost:5000/calendar/${eventId}`);
        setEvents((prev) => prev.filter((e) => e.id !== info.event.id));
        toast.success("Event deleted!");
      }
    }

    if (typeof action === "string" && action.trim() !== "") {
      await axios.patch(`http://localhost:5000/calendar/${eventId}`, {
        title: action,
      });
      setEvents((prev) =>
        prev.map((e) => (e.id === info.event.id ? { ...e, title: action } : e))
      );
      toast.success("Event updated successfully!");
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <button
        onClick={handleBackToHome}
        className="mb-10 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Class{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Calendar
          </span>
        </h2>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />
      <ToastContainer position="top-right" theme="colored" autoClose={2000} />
    </div>
  );
};

export default AdminCalendar;
