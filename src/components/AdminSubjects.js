// AdminSubjects.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaTrash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    lessons: "",
    students: "",
    startDate: "",
    schedule: "",
    time: "",
    team: "",
    price: "",
    oldPrice: "",
    image: "",
    discount: "",
    badge: "",
    modules: [],
  });
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage] = useState(8);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    const res = await axios.get("http://localhost:5000/subjects");
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (subject) => {
    setForm({ ...subject, modules: subject.modules || [] });
    setEditId(subject.id);
  };

  const handleDelete = async (id) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="custom-popup">
          <h2 className="text-lg font-semibold">Confirm Delete</h2>
          <p>Are you sure you want to delete this course?</p>
          <div className="mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg mr-4"
              onClick={async () => {
                await axios.delete(`http://localhost:5000/subjects/${id}`);
                fetchSubjects();
                toast.success("Deleted successfully!");
                onClose();
              }}
            >
              Delete
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      lessons: parseInt(form.lessons) || 0,
      students: parseInt(form.students) || 0,
      price: parseInt(form.price) || 0,
      oldPrice: parseInt(form.oldPrice) || 0,
      modules: form.modules || [],
    };

    if (editId) {
      await axios
        .put(`http://localhost:5000/subjects/${editId}`, payload)
        .then(() => {
          toast.success("Update successful!");
          setEditId(null);
          resetForm();
          fetchSubjects();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Update failed!");
        });
    } else {
      const newId =
        subjects.length > 0
          ? Math.max(...subjects.map((subject) => subject.id)) + 1
          : 1;
      const newPayload = { ...payload, id: newId };

      await axios
        .post("http://localhost:5000/subjects", newPayload)
        .then(() => {
          toast.success("Added successfully!");
          resetForm();
          fetchSubjects();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Add failed!");
        });
    }
  };

  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      lessons: "",
      students: "",
      startDate: "",
      schedule: "",
      time: "",
      team: "",
      price: "",
      oldPrice: "",
      image: "",
      discount: "",
      badge: "",
      modules: [],
    });
    setNewLessonTitle("");
  };
  const addLesson = () => {
    if (!newLessonTitle.trim()) return;

    const maxLessonId = form.modules.length
      ? Math.max(...form.modules.map((l) => l.lessonId || 0))
      : 0;

    const newLesson = {
      lessonId: maxLessonId + 1,
      title: newLessonTitle.trim(),
    };

    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, newLesson],
    }));

    setNewLessonTitle("");
  };

  const deleteLesson = (lessonId) => {
    const updated = form.modules.filter((l) => l.lessonId !== lessonId);
    setForm((prev) => ({
      ...prev,
      modules: updated,
    }));
  };

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );
  const totalPages = Math.ceil(subjects.length / subjectsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleBackToHome = () => navigate("/");

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
          Course{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Management
          </span>
        </h2>
      </div>

      {/* FORM INPUT */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {Object.keys(form).map(
            (field) =>
              !["id", "modules"].includes(field) && (
                <input
                  key={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="border p-2 rounded"
                  required={
                    field === "title" ||
                    field === "lessons" ||
                    field === "startDate" ||
                    field === "price"
                  }
                />
              )
          )}

          <div className="col-span-2">
            <label className="block font-semibold mb-2">Lessons:</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="Lesson title"
                className="border p-2 rounded w-full"
              />
              <button
                type="button"
                onClick={addLesson}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {form.modules?.map((l, idx) => (
                <li
                  key={l.lessonId}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>
                    {idx + 1}. {l.title}
                  </span>
                  <button
                    onClick={() => deleteLesson(l.lessonId)}
                    type="button"
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="col-span-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-2 rounded mt-4"
          >
            {editId ? "Update" : "Add New"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Course{" "}
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            List
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-2xl">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-100 rounded-t-2xl">
            <tr>
              <th className="p-4 text-left rounded-tl-2xl">ID</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Lessons</th>
              <th className="p-4 text-left rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentSubjects.map((subj, index) => (
              <tr key={subj.id} className="hover:bg-gray-50 transition">
                <td className="p-4">{subj.id}</td>
                <td className="p-4">{subj.title}</td>
                <td className="p-4">{subj.modules?.length || subj.lessons}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(subj)}
                      className="bg-yellow-400 px-3 py-1 rounded-lg flex items-center space-x-2 hover:bg-yellow-500 transition"
                    >
                      <FaEdit className="w-5 h-5" />
                      <span className="hidden sm:block">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(subj.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                      <span className="hidden sm:block">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {"<<"}
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {"<"}
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`w-10 h-10 p-2 rounded-lg ${
              currentPage === pageNumber
                ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
                : "bg-gray-200 text-gray-600"
            } flex items-center justify-center`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {">"}
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 w-10 h-10 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center justify-center"
        >
          {">>"}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default AdminSubjects;
