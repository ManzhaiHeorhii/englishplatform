import React, { useState, useContext, useEffect } from "react";
import TaskView from "./TaskView";
import Grades from "./Grades";
import { AuthContext } from "../context/AuthContext";
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const [selectedSection, setSelectedSection] = useState("courses");
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { auth, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchAvailableCourses = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/student/available-courses?student_id=${auth.id}`
                );
                const data = await response.json();
                setAvailableCourses(data);
            } catch (error) {
                console.error("Error fetching available courses:", error);
            }
        };

        fetchAvailableCourses();
    }, [auth.id]);

    return (
        <div className="dashboard">
            <aside className="dashboard-menu">
                <div className="user-info">
                    <div className="avatar"></div>
                    <div className="user-details">
                        <p className="user-name">{auth?.username || "Student"}</p>
                        <button className="logout-button" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li
                            className={selectedSection === "courses" ? "active" : ""}
                            onClick={() => {
                                setSelectedSection("courses");
                                setSelectedCourse(null); // Повернення до списку курсів
                            }}
                        >
                            Courses
                        </li>
                        <li
                            className={selectedSection === "grades" ? "active" : ""}
                            onClick={() => setSelectedSection("grades")}
                        >
                            Grades
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="dashboard-content">
                <div className="content-container">
                    {selectedSection === "courses" && !selectedCourse && (
                        <div className="courses">
                            <h2>Available Courses</h2>
                            {availableCourses.length > 0 ? (
                                <table className="courses-table">
                                    <thead>
                                    <tr>
                                        <th>Course Name</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {availableCourses.map((course) => (
                                        <tr
                                            key={course.course_id}
                                            onClick={() => setSelectedCourse(course.course_id)}
                                        >
                                            <td>{course.course_name}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No available courses at the moment.</p>
                            )}
                        </div>
                    )}
                    {selectedSection === "courses" && selectedCourse && (
                        <TaskView
                            courseId={selectedCourse}
                            onBack={() => setSelectedCourse(null)} // Повернення до списку курсів
                        />
                    )}
                    {selectedSection === "grades" && <Grades />}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
