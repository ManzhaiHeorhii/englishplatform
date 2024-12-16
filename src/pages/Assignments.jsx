import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import "./Assignments.css"

const Assignments = () => {
    const [groups, setGroups] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        // Завантаження груп з сервера
        const fetchGroups = async () => {
            try {
                const response = await fetch(`/api/groups?teacher_id=${auth.id}`);
                const data = await response.json();
                setGroups(data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        // Завантаження курсів з сервера
        const fetchCourses = async () => {
            try {
                const response = await fetch(`/api/courses?teacher_id=${auth.id}`);
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchGroups();
        fetchCourses();
    }, [auth.id]);

    const handleAssign = async () => {
        if (!selectedGroup || !selectedCourse) {
            alert("Please select both a group and a course.");
            return;
        }

        try {
            const response = await fetch("/api/assignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group_id: selectedGroup,
                    course_id: selectedCourse,
                }),
            });

            if (response.ok) {
                alert("Assignment successful!");
            } else {
                alert("Failed to assign group to course.");
            }
        } catch (error) {
            console.error("Error assigning group to course:", error);
        }
    };

    return (
        <div className="assignments">
            <h2>Assign Groups to Courses</h2>
            <div className="assignment-controls">
                <select
                    value={selectedGroup || ""}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="" disabled>
                        Select a group
                    </option>
                    {groups.map((group) => (
                        <option key={group.group_id} value={group.group_id}>
                            {group.group_name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedCourse || ""}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option value="" disabled>
                        Select a course
                    </option>
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAssign}>Assign</button>
            </div>
        </div>
    );
};

export default Assignments;
