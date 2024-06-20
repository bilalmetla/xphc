import React, { useState, useEffect } from 'react';

const BookingForm = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState({
    description: '',
    date: '',
    mobile: '',
    price: '',
    status: 'booked',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    if(storedBookings.length > 0) {
        setBookings(storedBookings);
    }
    
  }, []);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBooking({ ...currentBooking, [name]: value });
  };

  const handleAddBooking = () => {
    if (isEditing) {
      const updatedBookings = bookings.map((booking, index) => 
        index === editingIndex ? currentBooking : booking
      );
      setBookings(updatedBookings);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      setBookings([...bookings, currentBooking]);
    }

    setCurrentBooking({
      description: '',
      date: '',
      mobile: '',
      price: '',
      status: 'booked',
    });
   
    
  };

  const handleEditBooking = (index) => {
    setCurrentBooking(bookings[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleRemoveBooking = (index) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
  };

  const handleCheckboxChange = (index) => {
    if (selectedBookings.includes(index)) {
      setSelectedBookings(selectedBookings.filter((i) => i !== index));
    } else {
      setSelectedBookings([...selectedBookings, index]);
    }
  };

  const handleBulkRemove = () => {
    const updatedBookings = bookings.filter((_, index) => !selectedBookings.includes(index));
    setBookings(updatedBookings);
    setSelectedBookings([]);
  };

  const sortedBookings = [...bookings].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <h1>Booking</h1>
      <div className="booking-form">
        <label>
          Description:
          <textarea
            rows="8"
            name="description"
            value={currentBooking.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={currentBooking.date}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Mobile:
          <input
            type="text"
            name="mobile"
            value={currentBooking.mobile}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            name="price"
            value={currentBooking.price}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Job Status:
          <select
            name="status"
            value={currentBooking.status}
            onChange={handleInputChange}
          >
            <option value="pending">Pending</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>
        <button onClick={handleAddBooking}>
          {isEditing ? 'Update Booking' : 'Add Booking'}
        </button>
      </div>

      <h2>All Bookings</h2>
      <button onClick={handleBulkRemove} disabled={selectedBookings.length === 0}>
        Remove Selected
      </button>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Description</th>
            <th>Date</th>
            <th>Mobile</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.map((booking, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedBookings.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>{booking.description}</td>
              <td>{booking.date}</td>
              <td>{booking.mobile}</td>
              <td>{booking.price}</td>
              <td>{booking.status}</td>
              <td>
                <button onClick={() => handleEditBooking(index)}>Edit</button>
                <button onClick={() => handleRemoveBooking(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingForm;
