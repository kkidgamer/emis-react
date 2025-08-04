// import logo from './logo.svg';
import './App.css';
import'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomeComponents from './components/HomeComponents';

import RegisterUserComponent from './components/RegisterUserComponent';
import NotFound from './components/NotFoundComponent';
import RegisterAdminComponent from './components/RegisterAdminComponent';
import RegisterWorkerComponent from './components/RegisterWorkerComponent';
import LoginAdminComponent from './components/LoginAdminComponent';
import LoginUserComponent from './components/LoginUserComponent';
import LoginWorkerComponent from './components/LoginWorkerComponent';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeComponents/>} />
        <Route path="/register/user" element={<RegisterUserComponent/>} />
        <Route path="/register/admin" element={<RegisterAdminComponent/>} />
        <Route path="/register/worker" element={<RegisterWorkerComponent/>} />
        <Route path="/login/user" element={<LoginUserComponent/>} />
        <Route path="/login/admin" element={<LoginAdminComponent/>} />
        <Route path="/login/worker" element={<LoginWorkerComponent/>} />
        
        

        <Route path="*" element={<NotFound/>} />

        </Routes>
    </Router>
  );
}

export default App;
