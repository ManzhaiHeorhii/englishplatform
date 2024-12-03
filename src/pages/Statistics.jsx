import React, {useState, useEffect, useContext} from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Statistics.css";
import {AuthContext} from "../context/AuthContext";

// Реєструємо модулі
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [studentPerformance, setStudentPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const {auth} = useContext(AuthContext);

    useEffect(() => {
        // Fetch groups for the dropdown
        const fetchGroups = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/teacher/groups?teacher_id=${auth.id}`);
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        if (!selectedGroup) return;

        // Fetch performance data for the selected group
        const fetchPerformance = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/api/teacher/statistics?group_id=${selectedGroup}`
                );
                const data = await response.json();
                setStudentPerformance(data);
            } catch (error) {
                console.error("Error fetching performance data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, [selectedGroup]);

    const chartData = {
        labels: studentPerformance.map((student) => student.name || `Student ${student.student_id}`),
        datasets: [
            {
                label: "Average Grade (%)",
                data: studentPerformance.map((student) => student.average_grade),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="statistics">
            <h2>Group Statistics</h2>
            <div className="group-selector">
                <label htmlFor="group-select">Select Group:</label>
                <select
                    id="group-select"
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    value={selectedGroup || ""}
                >
                    <option value="" disabled>
                        Choose a group
                    </option>
                    {groups.map((group) => (
                        <option key={group.group_id} value={group.group_id}>
                            {group.group_name}
                        </option>
                    ))}
                </select>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : studentPerformance.length > 0 ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            title: { display: true, text: "Student Performance" },
                        },
                        scales: {
                            x: { title: { display: true, text: "Students" } },
                            y: { title: { display: true, text: "Average Grade (%)" } },
                        },
                    }}
                />
            ) : (
                <p>No data available for this group.</p>
            )}
        </div>
    );
};

export default Statistics;
