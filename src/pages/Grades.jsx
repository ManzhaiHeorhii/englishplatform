import React, { useState, useEffect, useContext } from "react";
import "./Grades.css";
import { AuthContext } from "../context/AuthContext";

const Grades = () => {
    const { auth } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch(
                    `/api/student/grades?student_id=${auth.id}`
                );
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching grades:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGrades();
    }, [auth.id]);

    if (loading) {
        return <div>Loading grades...</div>;
    }

    return (
        <div className="grades">
            <h2>Your Grades</h2>
            {courses.length > 0 ? (
                <div className="grades-list">
                    {courses.map((course) => (
                        <div key={course.course_id} className="course-item">
                            <div
                                className="course-header"
                                onClick={() =>
                                    setExpandedCourse(
                                        expandedCourse === course.course_id ? null : course.course_id
                                    )
                                }
                            >
                                <h3>{course.course_name}</h3>
                                <p>Average Grade: {course.average_grade}%</p>
                            </div>
                            {expandedCourse === course.course_id && (
                                <table className="tasks-table">
                                    <thead>
                                    <tr>
                                        <th>Task Name</th>
                                        <th>Description</th>
                                        <th>Grade</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {course.tasks.map((task) => (
                                        <tr key={task.task_id}>
                                            <td>{task.name}</td>
                                            <td>{task.description}</td>
                                            <td>{task.grade ?? "Not Graded"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No completed courses found.</p>
            )}
        </div>
    );
};

export default Grades;
