import React, { useState, useEffect } from "react";
import TaskReview from "./TaskReview";
import "./StudentSubmissions.css";

const StudentSubmissions = ({ groupId, courseId, onBack }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = async () => {
        try {
            const response = await fetch(
                `/api/teacher/submissions?group_id=${groupId}&course_id=${courseId}`
            );
            const result = await response.json();

            // Додаємо статус і обробляємо ім'я
            const enhancedStudents = result.map((student) => ({
                ...student,
                name:
                    student.submission_count === 0 || student.ungraded_count > 0
                        ? "Anonymous"
                        : student.name,
                status:
                    student.submission_count === 0
                        ? "Не здано"
                        : student.ungraded_count > 0
                            ? "Не перевірено"
                            : "Перевірено",
            }));

            // Сортуємо за статусом
            enhancedStudents.sort((a, b) => {
                if (a.status === "Не перевірено" && b.status === "Перевірено") return -1;
                if (a.status === "Перевірено" && b.status === "Не перевірено") return 1;
                if (a.status === "Не здано" && b.status !== "Не здано") return -1;
                if (b.status === "Не здано" && a.status !== "Не здано") return 1;
                return 0;
            });

            setStudents(enhancedStudents);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [groupId, courseId]);

    if (loading) {
        return <div>Loading student submissions...</div>;
    }

    if (selectedStudent) {
        return (
            <TaskReview
                studentId={selectedStudent}
                courseId={courseId}
                onBack={() => {
                    setSelectedStudent(null);
                    fetchSubmissions(); // Оновлюємо дані після повернення
                }}
            />
        );
    }

    return (
        <div className="student-submissions">
            <button className="back-button" onClick={onBack}>
                Back to Groups
            </button>
            <h2>Student Submissions</h2>
            {students.length > 0 ? (
                <table className="submissions-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Submission Count</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr
                            key={student.student_id}
                            onClick={() =>
                                student.status === "Перевірено"
                                    ? null
                                    : setSelectedStudent(student.student_id)
                            }
                            style={{
                                cursor: student.status === "Перевірено" ? "not-allowed" : "pointer",
                                backgroundColor:
                                    student.status === "Перевірено"
                                        ? "#e8f5e9"
                                        : student.status === "Не перевірено"
                                            ? "#ffebee"
                                            : "#f5f5f5",
                            }}
                        >
                            <td>{student.name}</td>
                            <td>{student.submission_count}</td>
                            <td
                                style={{
                                    color:
                                        student.status === "Перевірено"
                                            ? "green"
                                            : student.status === "Не перевірено"
                                                ? "red"
                                                : "gray",
                                    fontWeight: "bold",
                                }}
                            >
                                {student.status}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No submissions found.</p>
            )}
        </div>
    );
};

export default StudentSubmissions;
