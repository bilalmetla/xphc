import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDB } from '../awsConfig';

const CreateUserForm = ({ onUserCreated }) => {
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'worker' // Default role
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleRoleChange = (e) => {
    setNewUser({ ...newUser, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { ...newUser, id: uuidv4() };

    try {
      await dynamoDB.put({
        TableName: 'UsersTable',
        Item: user,
      }).promise();
      onUserCreated(user);
      setNewUser({ username: '', password: '', role: 'worker' });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={newUser.username}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Role:
        <select name="role" value={newUser.role} onChange={handleRoleChange}>
          <option value="admin">Admin</option>
          <option value="worker">Worker</option>
        </select>
      </label>
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUserForm;
