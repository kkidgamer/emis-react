import React from 'react';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';


const UserLayout = () => {
  return (
    <div className="d-flex" style={{ maxHeight: '100vh', position:"fixed" }}>
      <Sidebar />
        {/* Ensure the content is scrollable */}
        <div className="container-fluid flex-grow-1 p-4 bg-light" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
