import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentSubmissions from "./StudentSubmissions"; // Імпортуємо новий компонент
import "./Audition.css";

const Audition = () => {
    const { auth } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        const fetchAuditionData = async () => {
            try {
                const response = await fetch(`/api/teacher/audition?teacher_id=${auth.id}`);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching audition data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditionData();
    }, [auth.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (selectedGroup) {
        return (
            <StudentSubmissions
                groupId={selectedGroup.group_id}
                courseId={selectedGroup.course_id}
                onBack={() => setSelectedGroup(null)}
            />
        );
    }

    return (
        <div className="audition">
            <h2>Groups Progress</h2>
            {data.length > 0 ? (
                <table className="audition-table">
                    <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>Course Name</th>
                        <th>Course ID</th>
                        <th>Progress</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row) => (
                        <tr
                            key={`${row.group_id}-${row.course_name}`}
                            onClick={() => setSelectedGroup({group_id: row.group_id, course_id: row.course_id})}
                            style={{cursor: "pointer"}}
                        >
                            <td>{row.group_name}</td>
                            <td>{row.course_name}</td>
                            <td>{row.course_id}</td>
                            <td>
                                {row.completed_students} of {row.total_students} students
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default Audition;
