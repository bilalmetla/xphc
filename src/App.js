// import React, { useState } from 'react';

import DownloadInvoice from './components/DownloadInvoice';
import BookingForm from './components/BookingForm';
import UserJobs from './components/UserJobs';

import './App.css';  // Import App.css here



// function App() {
  

//   const [currentView, setCurrentView] = useState('booking'); // State to manage current view

//   return (
//     <div className="App">
//       <h1>XP House Cleaning Service</h1>
//       <nav>
//         <ul>
//           <li><button onClick={() => setCurrentView('invoice')}>Invoice Generator</button></li>
//           <li><button onClick={() => setCurrentView('booking')}>Booking Form</button></li>
//         </ul>
//       </nav>
//       {currentView === 'invoice' &&  <DownloadInvoice /> }
//       {currentView === 'booking' && <BookingForm />}
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import CreateUserForm from './components/CreateUserForm';
import { dynamoDB } from './awsConfig';

const App = () => {
  const [currentView, setCurrentView] = useState('booking'); // State to manage current view
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await dynamoDB.scan({ TableName: 'UsersTable' }).promise();
        setUsers(result.Items);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const storedCredentials = localStorage.getItem('loginCredentials');
    if (storedCredentials) {
      // If credentials exist in local storage, set current user
      const { username, password } = JSON.parse(storedCredentials);
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        setCurrentUser(user);
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
    } else {
      setShowLogin(true);
    }
  }, [users]);

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = loginCredentials;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('loginCredentials', JSON.stringify({ username, password }));
      setShowLogin(false);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('loginCredentials');
    setShowLogin(true);
  };

  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
  };

  if (showLogin) {
    return (
      <div className="login-popup">
        <h1>XP House Cleaning Service</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginCredentials.username}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginCredentials.password}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (

<div className="App">
      
      <h1>Welcome, {currentUser?currentUser.username:''}</h1>
       
      <nav>
        {currentUser && currentUser.role === 'admin' &&
          <ul>
          
            <li><button onClick={() => setCurrentView('invoice')}>Invoice Generator</button></li>
            <li><button onClick={() => setCurrentView('booking')}>Booking Form</button></li>
          
          
            <li><button onClick={() => setCurrentView('create-user')}>Create User</button></li>
          </ul>
        }
        </nav>
      {currentUser && currentUser.role === 'worker' &&
         <UserJobs />}
      
      
      {currentUser && currentUser.role === 'admin' &&
        currentView === 'invoice' && <DownloadInvoice />}
      {currentUser && currentUser.role === 'admin' &&
        currentView === 'booking' && <BookingForm />}
      {currentUser && currentUser.role === 'admin' &&
        currentView === 'create-user' && 
       <div>
       <h2>Create New User</h2>
       <CreateUserForm onUserCreated={handleUserCreated} />
      </div>
      }
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
