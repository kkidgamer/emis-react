// import logo from './logo.svg';
import './App.css';
import'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomeComponents from './components/HomeComponents';
import LoginComponent from './components/LoginComponent';
import RegisterUserComponent from './components/RegisterUserComponent';
import NotFound from './components/NotFoundComponent';
import RegisterAdminComponent from './components/RegisterAdminComponent';
import RegisterWorkerComponent from './components/RegisterWorkerComponent';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeComponents/>} />
        <Route path="/login" element={<LoginComponent/>} />
        <Route path="/register/user" element={<RegisterUserComponent/>} />
        <Route path="/register/admin" element={<RegisterAdminComponent/>} />
        <Route path="/register/worker" element={<RegisterWorkerComponent/>} />
        

        <Route path="*" element={<NotFound/>} />

        </Routes>
    </Router>
  );
}

export default App;
