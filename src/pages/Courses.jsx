import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Courses.css";
import TaskCreate from "./TaskCreate";
import TaskPreview from "./TaskPreview";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null); // Для прев'ю завдання
    const [newCourseName, setNewCourseName] = useState("");
    const [showTaskCreate, setShowTaskCreate] = useState(false);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(
                    `/api/courses?teacher_id=${auth.id}`
                );
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [auth.id]);

    const handleCourseClick = async (courseId) => {
        setSelectedCourse(courseId);
        setLoading(true);
        try {
            const response = await fetch(
                `/api/tasks?course_id=${courseId}`
            );
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleUpdateTask = (taskId, updatedContent) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.task_id === taskId
                    ? { ...task, task_content: updatedContent }
                    : task
            )
        );
    };
    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== taskId));
    };
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/tasks?course_id=${selectedCourse}`);
            const data = await response.json();
            setTasks(data); // Оновлюємо список завдань
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleAddCourse = async () => {
        if (!newCourseName.trim()) {
            alert("Please enter a course name.");
            return;
        }

        try {
            const response = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course_name: newCourseName, teacher_id: auth.id }),
            });
            if (response.ok) {
                const newCourse = await response.json();
                setCourses((prevCourses) => [...prevCourses, newCourse]);
                setNewCourseName("");
            } else {
                console.error("Error adding course:", await response.json());
            }
        } catch (error) {
            console.error("Error adding course:", error);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setCourses((prevCourses) => prevCourses.filter((course) => course.course_id !== courseId));
            } else {
                console.error("Error deleting course:", await response.json());
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };



    const handleBackToCourses = () => {
        setSelectedCourse(null);
        setTasks([]);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task); // Зберігаємо вибране завдання
    };

    const handleBackToTasks = () => {
        setSelectedTask(null); // Повернення до списку завдань
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (showTaskCreate) {
        return (
            <TaskCreate onBack={() => {
                setShowTaskCreate(false);
                fetchTasks(); // Оновлюємо список завдань після створення
            }} courseId={selectedCourse} />
        );
    }

    if (selectedTask) {
        return <TaskPreview task={selectedTask} onBack={handleBackToTasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />;
    }

    return (
        <div className="courses">
            {selectedCourse ? (
                <>
                    <h2>Tasks for Course {selectedCourse}</h2>
                    <button className="back-button" onClick={handleBackToCourses}>
                        Back to Courses
                    </button>
                    <button
                        className="create-task-button"
                        onClick={() => setShowTaskCreate(true)}
                    >
                        Create Task
                    </button>
                    {tasks.length > 0 ? (
                        <table className="tasks-table">
                            <thead>
                            <tr>
                                <th>Task ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Media</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks.map((task) => (
                                <tr key={task.task_id} onClick={() => handleTaskClick(task)}>
                                    <td>{task.task_id}</td>
                                    <td>{task.task_content.name}</td>
                                    <td>{task.task_content.description}</td>
                                    <td>
                                        {task.task_content.media ? (
                                            <a href={task.task_content.media} target="_blank" rel="noopener noreferrer">
                                                View Media
                                            </a>
                                        ) : (
                                            "No Media"
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>No tasks found for this course</div>
                    )}
                </>
            ) : (
                <>
                    <h2>Courses</h2>
                    <div className="add-course">
                        <input
                            type="text"
                            placeholder="Enter course name"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                        />
                        <button onClick={handleAddCourse}>Add Course</button>
                    </div>
                    <table className="courses-table">
                        <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map((course) => (
                            <tr key={course.course_id}>
                                <td onClick={() => handleCourseClick(course.course_id)}>{course.course_name}</td>
                                <td>
                                    <button onClick={() => handleDeleteCourse(course.course_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );

};

export default Courses;
