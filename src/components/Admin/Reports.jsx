// import React, { useState, useEffect, useContext } from 'react';
// import { Bar } from 'react-chartjs-2';
// import axios from 'axios';
// import AdminLayout from './AdminLayout';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { AuthContext } from '../context/AuthContext';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Reports = () => {
//   const [data, setData] = useState({ bookingStatusCounts: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { token } = useContext(AuthContext)

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const response = await axios.get('https://emis-sh54.onrender.com/api/admin', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setData({ bookingStatusCounts: response.data.bookingStatusCounts });
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch report data.');
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [token]);

//   const chartData = {
//     labels: data.bookingStatusCounts.map(item => item._id),
//     datasets: [{
//       label: 'Booking Status Counts',
//       data: data.bookingStatusCounts.map(item => item.count),
//       backgroundColor: ['#2e7d32', '#43a047', '#66bb6a', '#a5d6a7'],
//       borderColor: ['#1b5e20', '#2e7d32', '#43a047', '#81c784'],
//       borderWidth: 1,
//     }],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Booking Status Distribution', color: '#2e7d32', font: { size: 18 } },
//     },
//     scales: {
//       y: { beginAtZero: true, title: { display: true, text: 'Number of Bookings' } },
//       x: { title: { display: true, text: 'Status' } },
//     },
//   };

//   return (
//     <AdminLayout>
//       <h1 className="text-success mb-4">Reports</h1>

//       {loading && <div className="alert alert-info" role="alert">Loading report data...</div>}
//       {error && <div className="alert alert-danger" role="alert">{error}</div>}

//       <div className="card shadow">
//         <div className="card-body">
//           <h4 className="card-title text-success">Booking Status Report</h4>
//           {data.bookingStatusCounts.length > 0 ? (
//             <div style={{ maxWidth: '600px', margin: 'auto' }}>
//               <Bar data={chartData} options={chartOptions} />
//             </div>
//           ) : (
//             <p className="text-muted">No booking data available.</p>
//           )}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default Reports;