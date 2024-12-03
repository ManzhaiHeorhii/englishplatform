import React, { useState } from "react";
import "./TaskPreview.css";

const TaskPreview = ({ task, onBack, onUpdateTask, onDeleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(task.task_content.name);
    const [description, setDescription] = useState(task.task_content.description);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [taskContent, setTaskContent] = useState(task.task_content);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile && (uploadedFile.type === "audio/mp3" || uploadedFile.type === "video/mp4")) {
            setFile(uploadedFile);
        } else {
            alert("Only MP3 and MP4 files are allowed.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task? This action cannot be undone."
        );

        if (!confirmDelete) return;

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${task.task_id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Task deleted successfully!");
                onDeleteTask(task.task_id); // Видалення завдання зі списку
                onBack(); // Повернення до списку завдань
            } else {
                alert("Failed to delete task.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            let mediaUrl = taskContent.media;

            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const fileResponse = await fetch("http://localhost:5000/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const fileData = await fileResponse.json();
                mediaUrl = fileData.url;
            }

            const updatedContent = {
                name: name.trim(),
                description: description.trim(),
                media: mediaUrl,
            };

            const response = await fetch(`http://localhost:5000/api/tasks/${task.task_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task_content: updatedContent }),
            });

            if (response.ok) {
                setTaskContent(updatedContent);
                onUpdateTask(task.task_id, updatedContent);
                setIsEditing(false);
            } else {
                alert("Failed to update task.");
            }
        } catch (error) {
            console.error("Error updating task:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="task-preview">
            <button className="back-button" onClick={onBack}>
                Back to Tasks
            </button>

            {isEditing ? (
                <div className="edit-form">
                    <input
                        type="text"
                        className="name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter task name"
                    />
                    <textarea
                        className="description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                    ></textarea>
                    <input type="file" accept="audio/mp3,video/mp4" onChange={handleFileChange} />
                    <button className="save-button" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="media-container">
                        {taskContent.media ? (
                            taskContent.media.endsWith(".mp4") ? (
                                <video controls>
                                    <source src={taskContent.media} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <audio controls>
                                    <source src={taskContent.media} type="audio/mp3" />
                                    Your browser does not support the audio tag.
                                </audio>
                            )
                        ) : (
                            <p>No media available</p>
                        )}
                    </div>
                    <div className="description">
                        <h3>{taskContent.name}</h3>
                        <p>{taskContent.description}</p>
                    </div>
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                    <button className="delete-button" onClick={handleDelete} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </>
            )}
        </div>
    );
};

export default TaskPreview;
