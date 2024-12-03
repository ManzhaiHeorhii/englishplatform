import React, { useState, useEffect, useContext } from "react";
import AccountList from "./AccountList";
import GroupAssignments from "./GroupAssignments";
import { AuthContext } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [selectedSection, setSelectedSection] = useState("accounts");
    const { auth, logout } = useContext(AuthContext);

    return (
        <div className="dashboard">
            <aside className="dashboard-menu">
                <div className="user-info">
                    <div className="avatar"></div>
                    <div className="user-details">
                        <p className="user-name">{auth?.username || "Admin"}</p>
                        <button className="logout-button" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li
                            className={selectedSection === "accounts" ? "active" : ""}
                            onClick={() => setSelectedSection("accounts")}
                        >
                            Account List
                        </li>
                        <li
                            className={selectedSection === "assignments" ? "active" : ""}
                            onClick={() => setSelectedSection("assignments")}
                        >
                            Assignments
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="dashboard-content">
                <div className="content-container">
                    {selectedSection === "accounts" && <AccountList />}
                    {selectedSection === "assignments" && <GroupAssignments />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
