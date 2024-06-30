import React, { useState, useEffect } from 'react';
import { dynamoDB } from '../awsConfig';

const UserJobs = () => {
  const [userJobs, setUserJobs] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Get username from localStorage
    const loginCredentials = JSON.parse(localStorage.getItem('loginCredentials'));
    const storedUsername = loginCredentials.username;
    
    if (storedUsername) {
      setUsername(storedUsername);
      fetchUserJobs(storedUsername);
    }
  }, []);

  const fetchUserJobs = async (username) => {
    try {
      const result = await dynamoDB.scan({ TableName: 'BookingsTable' }).promise();
      const filteredJobs = result.Items.filter(booking =>
        !booking.status.includes('payment pending', 'completed')  && booking.assignees && booking.assignees.includes(username) 
      );
      setUserJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching user jobs:", error);
    }
  };

  const handleCompleteJob = async (jobId) => {
    try {
      const updatedJobs = userJobs.map(job =>
        job.id === jobId ? { ...job, status: 'completed' } : job
      );
      setUserJobs(updatedJobs);

      // Update status in DynamoDB
      await dynamoDB.update({
        TableName: 'BookingsTable',
        Key: { id: jobId },
        UpdateExpression: 'set #s = :s',
        ExpressionAttributeNames: {
          '#s': 'status',
        },
        ExpressionAttributeValues: {
          ':s': 'completed',
        },
      }).promise();

      console.log(`Job ${jobId} marked as complete.`);
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };
  
  const handlePaymentPendingJob = async (jobId) => {
    try {
      const updatedJobs = userJobs.map(job =>
        job.id === jobId ? { ...job, status: 'payment pending' } : job
      );
      setUserJobs(updatedJobs);

      // Update status in DynamoDB
      await dynamoDB.update({
        TableName: 'BookingsTable',
        Key: { id: jobId },
        UpdateExpression: 'set #s = :s',
        ExpressionAttributeNames: {
          '#s': 'status',
        },
        ExpressionAttributeValues: {
          ':s': 'payment pending',
        },
      }).promise();

      alert(`Job ${jobId} marked as payment pending.`);
    } catch (error) {
      console.error("Error payment pending job:", error);
    }
  };

  return (
    <div>
      <h2>{ username} Assigned Jobs</h2>
      <table>
        <thead>
          <tr key="heading">
            <th>Date</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Assignees</th>
            <th>Job Details</th>
            <th>Action</th> {/* New column for action button */}
          </tr>
        </thead>
        <tbody>
          {userJobs.map((job, index) => (
            <tr key={index}>
              <td>{job.date}</td>
              <td>{job.mobile}</td>
              <td>{job.status}</td>
              <td>{job.assignees ? job.assignees.join(', ') : ''}</td>
              <td>{job.jobDetails}</td>
              <td>
                {!job.status.includes('payment pending', 'completed') && (  
                  <button onClick={() => handleCompleteJob(job.id)}>Complete</button>
                  
                )}
                {!job.status.includes('payment pending', 'completed') && (  
                  <button onClick={() => handlePaymentPendingJob(job.id)}>Payment Pending</button>
                  
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserJobs;
