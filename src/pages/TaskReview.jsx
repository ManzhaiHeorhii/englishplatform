import React, { useState, useEffect } from "react";
import "./TaskReview.css";

const TaskReview = ({ studentId, courseId, onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(
                    `/api/teacher/review-tasks?student_id=${studentId}&course_id=${courseId}`
                );
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [studentId, courseId]);

    const handleGradeChange = (value) => {
        setGrades((prevGrades) => ({
            ...prevGrades,
            [tasks[currentTaskIndex]?.task_id]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/teacher/submit-grades", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: studentId,
                    grades,
                }),
            });

            if (response.ok) {
                alert("Grades submitted successfully!");
                onBack();
            } else {
                alert("Failed to submit grades.");
            }
        } catch (error) {
            console.error("Error submitting grades:", error);
            alert("An error occurred while submitting grades.");
        }
    };

    if (loading) {
        return <div>Loading task review...</div>;
    }

    const currentTask = tasks[currentTaskIndex];
    const currentGrade = grades[currentTask?.task_id] || 0;

    return (
        <div className="task-review">
            <button className="back-button" onClick={onBack}>
                Back to Submissions
            </button>
            {currentTask ? (
                <div className="task-container">
                    <h3>{currentTask.task_content.name}</h3>
                    <p>{currentTask.task_content.description}</p>
                    <textarea
                        className="student-response"
                        value={currentTask.submission_content}
                        readOnly
                    ></textarea>
                    <div className="grading-panel">
                        <div className="slider-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={currentGrade}
                                onChange={(e) => handleGradeChange(parseInt(e.target.value, 10))}
                            />
                            <span className="slider-value">{currentGrade}</span>
                        </div>
                        <div className="quick-grades">
                            {[0, 25, 50, 75, 100].map((grade) => (
                                <button
                                    key={grade}
                                    onClick={() => handleGradeChange(grade)}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>No more tasks to review.</p>
            )}
            <div className="task-navigation">
                {currentTaskIndex > 0 && (
                    <button
                        className="previous-button"
                        onClick={() => setCurrentTaskIndex((prev) => prev - 1)}
                    >
                        Previous
                    </button>
                )}
                {currentTaskIndex < tasks.length - 1 ? (
                    <button
                        className="next-button"
                        onClick={() => setCurrentTaskIndex((prev) => prev + 1)}
                    >
                        Next
                    </button>
                ) : (
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit Grades
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskReview;
