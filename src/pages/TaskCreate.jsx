import React, { useState } from "react";
import "./TaskCreate.css";

const TaskCreate = ({ onBack, courseId, onTaskCreated }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === "audio/mp3" || droppedFile.type === "video/mp4")) {
            setFile(droppedFile);
        } else {
            alert("Only MP3 and MP4 files are allowed.");
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("Please provide a task name.");
            return;
        }

        if (!description.trim() && !file) {
            alert("Please provide a description or upload a media file.");
            return;
        }

        setLoading(true);

        try {
            let mediaUrl = "";

            // Завантаження файлу на сервер
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const fileResponse = await fetch("http://localhost:5000/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const fileData = await fileResponse.json();
                mediaUrl = fileData.url; // Отримуємо URL завантаженого файлу
            }

            // Запис у базу даних
            const taskContent = JSON.stringify({
                name: name.trim(),
                media: mediaUrl,
                description: description.trim(),
            });

            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    course_id: courseId,
                    task_content: taskContent,
                }),
            });

            if (response.ok) {
                const newTask = await response.json();
                onTaskCreated(newTask); // Викликаємо функцію оновлення таблиці
                alert("Task created successfully!");
                setName("");
                setDescription("");
                setFile(null);
                onBack(); // Повертаємося до списку завдань
            } else {
                alert("Failed to create task.");
            }
        } catch (error) {
            console.error("Error creating task:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="task-create">
            <h2>Create a New Task</h2>
            <button className="back-button" onClick={onBack}>
                Back to Tasks
            </button>

            <input
                className="name-input"
                type="text"
                placeholder="Enter task name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <div
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
            >
                {file ? (
                    <p>Uploaded File: {file.name}</p>
                ) : (
                    <p>Drag and drop an MP3 or MP4 file here, or leave it empty</p>
                )}
            </div>

            <textarea
                className="description-input"
                placeholder="Enter task description or question"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <button className="submit-button" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>
        </div>
    );
};

export default TaskCreate;
