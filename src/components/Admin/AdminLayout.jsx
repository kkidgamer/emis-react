import React from 'react';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light">
        <div className="container-fluid">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;