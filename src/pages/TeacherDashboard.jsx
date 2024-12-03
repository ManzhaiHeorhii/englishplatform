import React, { useState, useContext } from "react";
import Groups from "./Groups";
import Courses from "./Courses";
import Assignments from "./Assignments";
import Audition from "./Audition";
import Statistics from "./Statistics";
import { AuthContext } from "../context/AuthContext";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
    const [selectedSection, setSelectedSection] = useState("groups");
    const { auth, logout } = useContext(AuthContext);

    return (
        <div className="dashboard">
            <aside className="dashboard-menu">
                <div className="user-info">
                    <div className="avatar"></div>
                    <div className="user-details">
                        <p className="user-name">{auth?.username || "User"}</p>
                        <button className="logout-button" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li
                            className={selectedSection === "groups" ? "active" : ""}
                            onClick={() => setSelectedSection("groups")}
                        >
                            Groups
                        </li>
                        <li
                            className={selectedSection === "courses" ? "active" : ""}
                            onClick={() => setSelectedSection("courses")}
                        >
                            Courses
                        </li>
                        <li
                            className={selectedSection === "assignments" ? "active" : ""}
                            onClick={() => setSelectedSection("assignments")}
                        >
                            Assignments
                        </li>
                        <li
                            className={selectedSection === "audition" ? "active" : ""}
                            onClick={() => setSelectedSection("audition")}
                        >
                            Audition
                        </li>
                        <li
                            className={selectedSection === "statistics" ? "active" : ""}
                            onClick={() => setSelectedSection("statistics")}
                        >
                            Statistics
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="dashboard-content">
                <div className="content-container">
                    {selectedSection === "groups" && <Groups />}
                    {selectedSection === "courses" && <Courses />}
                    {selectedSection === "assignments" && <Assignments />}
                    {selectedSection === "audition" && <Audition />}
                    {selectedSection === "statistics" && <Statistics />}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
