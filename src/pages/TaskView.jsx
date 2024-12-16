import React, {useState, useEffect, useContext} from "react";
import "./TaskView.css";
import {AuthContext} from "../context/AuthContext";

const TaskView = ({ courseId, onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const { auth} = useContext(AuthContext);

    useEffect(() => {
        // Завантаження завдань для курсу
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/student/tasks?course_id=${courseId}`);
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [courseId]);

    const handleAnswerChange = (e) => {
        const value = e.target.value;
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [tasks[currentTaskIndex]?.task_id]: value,
        }));
    };

    const handleNext = () => {
        if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentTaskIndex > 0) {
            setCurrentTaskIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (!tasks || tasks.length === 0) {
            alert("No tasks available to submit.");
            return;
        }

        const submissions = tasks.map((task) => ({
            task_id: task.task_id,
            submission_content: answers[task.task_id]?.trim() || "",
        }));

        try {
            // Відправляємо відповіді з додаванням student_id
            const response = await fetch(`/api/student/submissions?student_id=${auth.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: auth.id, // Додаємо student_id до тіла запиту
                    submissions,
                }),
            });

            if (!response.ok) {
                alert("Failed to submit tasks.");
                return;
            }

            // Позначаємо курс завершеним
            const completionResponse = await fetch("/api/student/complete-course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: auth.id, // Передаємо student_id
                    course_id: courseId, // Передаємо course_id
                }),
            });

            if (completionResponse.ok) {
                alert("All tasks submitted, and course marked as completed!");
                onBack(); // Повертаємося до списку курсів
            } else {
                const error = await completionResponse.json();
                alert(`Failed to mark course as completed: ${error.message || "Unknown error."}`);
            }
        } catch (error) {
            console.error("Error submitting tasks or completing course:", error);
            alert("An error occurred while submitting tasks or completing the course.");
        }
    };




    if (loading) {
        return <div>Loading tasks...</div>;
    }

    const currentTask = tasks[currentTaskIndex];

    return (
        <div className="task-view">
            <button className="back-button" onClick={onBack}>
                Back to Courses
            </button>

            {currentTask ? (
                <div className="task-container">
                    <div className="media-container">
                        {currentTask.task_content.media ? (
                            currentTask.task_content.media.endsWith(".mp4") ? (
                                <video controls>
                                    <source src={currentTask.task_content.media} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <audio controls>
                                    <source src={currentTask.task_content.media} type="audio/mp3" />
                                    Your browser does not support the audio tag.
                                </audio>
                            )
                        ) : (
                            <p>No media available</p>
                        )}
                    </div>
                    <div className="description">
                        <h3>{currentTask.task_content.name}</h3>
                        <p>{currentTask.task_content.description}</p>
                    </div>
                    <textarea
                        className="answer-input"
                        placeholder="Enter your answer here..."
                        value={answers[currentTask.task_id] || ""}
                        onChange={handleAnswerChange}
                    ></textarea>
                </div>
            ) : (
                <div>No tasks available</div>
            )}

            <div className="task-navigation">
                {currentTaskIndex > 0 && (
                    <button className="previous-button" onClick={handlePrevious}>
                        Previous
                    </button>
                )}
                {currentTaskIndex < tasks.length - 1 ? (
                    <button className="next-button" onClick={handleNext}>
                        Next
                    </button>
                ) : (
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskView;
