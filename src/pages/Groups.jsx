import React, { useContext, useEffect, useState } from "react";
import "./Groups.css";
import { AuthContext } from "../context/AuthContext";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showStudents, setShowStudents] = useState(false);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/groups?teacher_id=${auth.id}`
                );
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [auth.id]);

    const handleRowClick = async (groupId) => {
        setLoadingStudents(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/students?group_id=${groupId}`
            );
            const data = await response.json();
            setStudents(data);
            setShowStudents(true);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleBackClick = () => {
        setShowStudents(false);
        setStudents([]);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="groups">
            {showStudents ? (
                <>
                    <h2>Students</h2>
                    <button className="back-button" onClick={handleBackClick}>
                        Back
                    </button>
                    {loadingStudents ? (
                        <div>Loading students...</div>
                    ) : students.length > 0 ? (
                        <table className="students-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.map((student) => (
                                <tr key={student.user_id}>
                                    <td>{student.username}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No students found</div>
                    )}
                </>
            ) : (
                <>
                    <h2>Groups</h2>
                    <table className="groups-table">
                        <thead>
                        <tr>
                            <th>Group Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groups.map((group) => (
                            <tr key={group.group_id} onClick={() => handleRowClick(group.group_id)}>
                                <td>{group.group_name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Groups;
