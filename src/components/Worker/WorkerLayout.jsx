import React from 'react';
import WorkerSidebar from './WorkerSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Outlet } from 'react-router-dom';

const WorkerLayout = () => {
  return (
    <div className="d-flex" style={{ maxHeight: '100vh' }}>
      <WorkerSidebar />
      <div className="flex-grow-1 p-4 bg-light">
        <div className="container-fluid" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WorkerLayout;