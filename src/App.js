import React, { useState } from 'react';

import DownloadInvoice from './components/DownloadInvoice';
import BookingForm from './components/BookingForm';

import './App.css';  // Import App.css here



function App() {
  

  const [currentView, setCurrentView] = useState('booking'); // State to manage current view

  return (
    <div className="App">
      <h1>XP House Cleaning Service</h1>
      <nav>
        <ul>
          <li><button onClick={() => setCurrentView('invoice')}>Invoice Generator</button></li>
          <li><button onClick={() => setCurrentView('booking')}>Booking Form</button></li>
        </ul>
      </nav>
      {currentView === 'invoice' &&  <DownloadInvoice /> }
      {currentView === 'booking' && <BookingForm />}
    </div>
  );
}

export default App;
