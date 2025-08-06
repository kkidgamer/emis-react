import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ maxHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-light">
        <div className="container-fluid" style={{overflowY:"auto" , maxHeight:"100vh"}}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;