import React, { useState, useEffect } from "react";
import "./AccountList.css";

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [newUser, setNewUser] = useState({ username: "", password: "", role: "student" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch("/api/admin/accounts");
                const data = await response.json();
                setAccounts(data);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleAddUser = async () => {
        try {
            const response = await fetch("/api/admin/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            const addedUser = await response.json();
            setAccounts((prev) => [...prev, addedUser]);
            setNewUser({ username: "", password: "", role: "student" });
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await fetch(`/api/admin/accounts/${userId}`, {
                method: "DELETE",
            });
            setAccounts((prev) => prev.filter((account) => account.user_id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="account-list">
            <h2>Account List</h2>
            <div className="add-account">
                <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={handleAddUser}>Add User</button>
            </div>
            {loading ? (
                <p>Loading accounts...</p>
            ) : accounts.length > 0 ? (
                <table className="accounts-table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map((account) => (
                        <tr key={account.user_id}>
                            <td>{account.username}</td>
                            <td>{account.role}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(account.user_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No accounts found.</p>
            )}
        </div>
    );
};

export default AccountList;
