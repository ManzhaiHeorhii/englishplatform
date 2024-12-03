import React, { useState, useEffect } from "react";
import "./GroupAssignments.css";

const GroupAssignments = () => {
    const [groups, setGroups] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [expandedGroupId, setExpandedGroupId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupsResponse, teachersResponse, studentsResponse] = await Promise.all([
                    fetch("http://localhost:5000/api/admin/groups"),
                    fetch("http://localhost:5000/api/admin/teachers"),
                    fetch("http://localhost:5000/api/admin/students"),
                ]);
                const groupsData = await groupsResponse.json();
                const teachersData = await teachersResponse.json();
                const studentsData = await studentsResponse.json();
                setGroups(groupsData);
                setTeachers(teachersData);
                setStudents(studentsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateGroup = async () => {
        if (!newGroupName.trim() || !selectedTeacher) {
            alert("Please provide a group name and select a teacher.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/admin/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group_name: newGroupName,
                    teacher_id: selectedTeacher,
                }),
            });
            const newGroup = await response.json();
            setGroups((prev) => [...prev, newGroup]);
            setNewGroupName("");
            setSelectedTeacher(null);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const handleAssignStudent = async () => {
        if (!selectedGroup || !selectedStudent) {
            alert("Please select a group and a student.");
            return;
        }

        try {
            await fetch("http://localhost:5000/api/admin/assign-student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group_id: selectedGroup,
                    student_id: selectedStudent,
                }),
            });
            alert("Student assigned successfully!");
        } catch (error) {
            console.error("Error assigning student:", error);
        }
    };

    const toggleGroup = async (groupId) => {
        if (expandedGroupId === groupId) {
            setExpandedGroupId(null);
        } else {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/admin/group-students?group_id=${groupId}`
                );
                const data = await response.json();
                setGroups((prevGroups) =>
                    prevGroups.map((group) =>
                        group.group_id === groupId ? { ...group, students: data } : group
                    )
                );
                setExpandedGroupId(groupId);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };

    return (
        <div className="group-assignments">
            <h2>Group Management</h2>

            {/* Додавання групи */}
            <div className="create-group">
                <input
                    type="text"
                    placeholder="Group Name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                />
                <select
                    value={selectedTeacher || ""}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                    <option value="" disabled>
                        Select Teacher
                    </option>
                    {teachers.map((teacher) => (
                        <option key={teacher.user_id} value={teacher.user_id}>
                            {teacher.username}
                        </option>
                    ))}
                </select>
                <button onClick={handleCreateGroup}>Create Group</button>
            </div>

            {/* Призначення студента до групи */}
            <div className="assign-student">
                <select
                    value={selectedGroup || ""}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="" disabled>
                        Select Group
                    </option>
                    {groups.map((group) => (
                        <option key={group.group_id} value={group.group_id}>
                            {group.group_name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedStudent || ""}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    <option value="" disabled>
                        Select Student
                    </option>
                    {students.map((student) => (
                        <option key={student.user_id} value={student.user_id}>
                            {student.username}
                        </option>
                    ))}
                </select>
                <button onClick={handleAssignStudent}>Assign Student</button>
            </div>

            {/* Список груп */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="groups-list">
                    {groups.map((group) => (
                        <div key={group.group_id} className="group-item">
                            <div
                                className="group-header"
                                onClick={() => toggleGroup(group.group_id)}
                            >
                                <span>{group.group_name}</span>
                                <span>{group.teacher_name || "No teacher assigned"}</span>
                            </div>
                            {expandedGroupId === group.group_id && group.students && (
                                <div className="students-list">
                                    {group.students.length > 0 ? (
                                        <ul>
                                            {group.students.map((student) => (
                                                <li key={student.user_id}>
                                                    {student.username}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No students in this group.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupAssignments;
