import { useEffect, useState } from "react";

const API_URL =
  "https://effective-memory-gx5p69xp5jwq2vpwr-5000.app.github.dev/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Nhập dữ liệu vào form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // CÂU 77 - PUT cập nhật
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Cập nhật thất bại");
        }

        alert("Cập nhật sinh viên thành công!");
        setEditingId(null);
      } else {
        // Thêm sinh viên
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Thêm sinh viên thất bại");
        }

        alert("Thêm sinh viên thành công!");
      }

      setFormData({
        studentId: "",
        name: "",
        email: "",
      });

      fetchStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  // Bấm nút Sửa
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });
  };

  // CÂU 78 - Xóa sinh viên
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Xóa thất bại");
      }

      alert("Xóa sinh viên thành công!");

      fetchStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi xóa!");
    }
  };

  // Hủy sửa
  const handleCancel = () => {
    setEditingId(null);

    setFormData({
      studentId: "",
      name: "",
      email: "",
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Quản Lý Sinh Viên</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Cập nhật sinh viên" : "Thêm Sinh Viên"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </form>

      <hr />

      <h2>Danh sách sinh viên</h2>

      {students.map((student) => (
        <div key={student._id} style={{ marginBottom: "15px" }}>
          <strong>{student.studentId}</strong> - {student.name} -{" "}
          {student.email}

          {" "}

          <button onClick={() => handleEdit(student)}>
            Sửa
          </button>

          {" "}

          <button onClick={() => handleDelete(student._id)}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
