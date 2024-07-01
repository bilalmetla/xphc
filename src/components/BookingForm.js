import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDB } from '../awsConfig';
import './BookingForm.css';  // Import your CSS file here

const teamMembers = [
  'arshdeep',
  'preeti',
  'jagjeet',
  'ajit',
  'manjur',
  'humera',
  'ashraf',
  'suman',
  'khalid'
];

const BookingForm = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState({
    description: '',
    date: '',
    mobile: '',
    price: '',
    status: 'booked',
    assignees: [],
    jobDetails:''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await dynamoDB.scan({ TableName: 'BookingsTable' }).promise();
        const sortedBookings = result.Items.sort((a, b) => {
          if (a.status === 'booked' && b.status !== 'booked') return -1;
          if (a.status !== 'booked' && b.status === 'booked') return 1;
          return new Date(a.date) - new Date(b.date);
        });
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const saveBookings = async (updatedBookings) => {
    const sortedBookings = updatedBookings.sort((a, b) => {
      if (a.status === 'booked' && b.status !== 'booked') return -1;
      if (a.status !== 'booked' && b.status === 'booked') return 1;
      return new Date(a.date) - new Date(b.date);
    });
    setBookings(sortedBookings);

    for (const booking of sortedBookings) {
      try {
        await dynamoDB.put({
          TableName: 'BookingsTable',
          Item: booking,
        }).promise();
      } catch (error) {
        console.error("Error saving booking:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBooking({ ...currentBooking, [name]: value });
  };

  const handleAssigneeChange = (e) => {
    const { value, checked } = e.target;
    const newAssignees = checked
      ? [...currentBooking.assignees, value]
      : currentBooking.assignees.filter(assignee => assignee !== value);

    setCurrentBooking({ ...currentBooking, assignees: newAssignees });
  };

  const handleAddBooking = async () => {
    let updatedBookings;
    if (isEditing) {
      updatedBookings = bookings.map((booking, index) => 
        index === editingIndex ? currentBooking : booking
      );
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      const newBooking = { ...currentBooking, id: uuidv4() };
      updatedBookings = [...bookings, newBooking];

      try {
        await dynamoDB.put({
          TableName: 'BookingsTable',
          Item: newBooking,
        }).promise();
      } catch (error) {
        console.error("Error adding booking:", error);
      }
    }

    setCurrentBooking({
      description: '',
      date: '',
      mobile: '',
      price: '',
      status: 'booked',
      assignees: [],
      jobDetails:''
    });

    saveBookings(updatedBookings);
  };

  const handleEditBooking = (index) => {
    setCurrentBooking(bookings[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleRemoveBooking = async (index) => {
    const bookingToRemove = bookings[index];

    const updatedBookings = bookings.filter((_, i) => i !== index);
    saveBookings(updatedBookings);

    try {
      await dynamoDB.delete({
        TableName: 'BookingsTable',
        Key: { id: bookingToRemove.id },
      }).promise();
    } catch (error) {
      console.error("Error removing booking:", error);
    }
  };

  const handleCheckboxChange = (index) => {
    if (selectedBookings.includes(index)) {
      setSelectedBookings(selectedBookings.filter((i) => i !== index));
    } else {
      setSelectedBookings([...selectedBookings, index]);
    }
  };

  const handleBulkRemove = async () => {
    const updatedBookings = bookings.filter((_, index) => !selectedBookings.includes(index));

    const promises = selectedBookings.map(index => {
      const bookingToRemove = bookings[index];
      return dynamoDB.delete({
        TableName: 'BookingsTable',
        Key: { id: bookingToRemove.id },
      }).promise();
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error removing bookings:", error);
    }

    setSelectedBookings([]);
    saveBookings(updatedBookings);
  };

  const getRowClass = (date, status) => {
    const today = new Date();
    const bookingDate = new Date(date);
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);

    if (bookingDate.toDateString() === today.toDateString()) {
      return 'today';
    } else if (bookingDate.toDateString() === nextDay.toDateString()) {
      return 'next-day';
    } else {
      return status;
    }
  };

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
            <option value="payment pending">Payment Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>
        <label>
          Job Details:
          <textarea
            rows="8"
            name="jobDetails"
            value={currentBooking.jobDetails}
            onChange={handleInputChange}
          />
        </label>
        <label>Assignees:</label> 
        <br></br>
        <br></br>
        <div className="assignees">
          {teamMembers.map((member) => (
            <label key={member} className="assignee-label">
              <input
                type="checkbox"
                value={member}
                checked={currentBooking.assignees.includes(member)}
                onChange={handleAssigneeChange}
              />
              {member}
            </label>
          ))}
        </div>

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
            <th>Assignees</th>
            <th>jobDetails</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className={getRowClass(booking.date, booking.status)}>
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
              <td>{booking.assignees ? booking.assignees.join(', ') : ''}</td>
              <td>{booking.jobDetails}</td>
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
