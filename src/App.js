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

          <Route path="/register/user" element={<RegisterUserComponent />} />
          <Route path="/register/admin" element={<RegisterAdminComponent />} />
          <Route path="/register/worker" element={<RegisterWorkerComponent />} />
          <Route path="/login/user" element={<LoginUserComponent />} />
          <Route path="/login/admin" element={<LoginAdminComponent />} />
          <Route path="/login/worker" element={<LoginWorkerComponent />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;