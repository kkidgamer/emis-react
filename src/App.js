// App.js
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeComponents from './components/HomeComponents';
import RegisterUserComponent from './components/RegisterUserComponent';
import NotFound from './components/NotFoundComponent';
import RegisterAdminComponent from './components/RegisterAdminComponent';
import RegisterWorkerComponent from './components/RegisterWorkerComponent';
import LoginAdminComponent from './components/LoginAdminComponent';
import LoginUserComponent from './components/LoginUserComponent';
import LoginWorkerComponent from './components/LoginWorkerComponent';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageUsers from './components/Admin/ManageUsers'; // New import
import ManageWorkers from './components/Admin/ManageWorkers'; // New import
import Reports from './components/Admin/Reports'; // New import
import Settings from './components/Admin/Settings'; // New import
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoutes from './components/context/ProtectedRoutes';
import WorkerDashboard from './components/Worker/WorkerDashboard';
import WorkerLayout from './components/Worker/WorkerLayout';
import ManageServices from './components/Worker/ManageServices';
import { ToastContainer } from 'react-toastify';
import UserDashboard from './components/User/UserDashboard';
import UserLayout from './components/User/UserLayout';
import BookService from './components/User/BookService';
import MyBookings from './components/User/MyBookings';
import ServicesList from './components/User/ServicesList';
import ServiceDetails from './components/User/ServiceDetails';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeComponents />} />

          {/* Admin protected routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoutes allowedRoles={['admin']}>
                <AdminLayout/>
              </ProtectedRoutes>
            }
          >
            <Route path="" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="workers" element={<ManageWorkers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Worker protected routes */}
          <Route
            path="/worker-dashboard"
            element={
             <ProtectedRoutes allowedRoles={['worker']}>
                <WorkerLayout/>
              </ProtectedRoutes>
            }
          >
            <Route path="" element={<WorkerDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="workers" element={<ManageWorkers />} />
            <Route path='services' element={<ManageServices/>}/>
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* User protected routes */}
          <Route
            path="/user-dashboard"
            element={
             
                <UserLayout/>
              
            }
          >
            <Route path="" element={<UserDashboard />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/:id" element={<ServiceDetails />} />
            <Route path="book/:id" element={<BookService />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="settings" element={<Settings />} />
            
          </Route>


          <Route path="/register/user" element={<RegisterUserComponent />} />
          <Route path="/register/admin" element={<RegisterAdminComponent />} />
          <Route path="/register/worker" element={<RegisterWorkerComponent />} />
          <Route path="/login/user" element={<LoginUserComponent />} />
          <Route path="/login/admin" element={<LoginAdminComponent />} />
          <Route path="/login/worker" element={<LoginWorkerComponent />} />

          <Route path="*" element={<NotFound />} />
        </Routes>


        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss={false}
          limit={1} // 🔹 This ensures only ONE toast at a time
        />

      </AuthProvider>
    </Router>
  );
}

export default App;