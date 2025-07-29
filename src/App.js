// import logo from './logo.svg';
import './App.css';
import'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomeComponents from './components/HomeComponents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeComponents/>} />

        </Routes>
    </Router>
  );
}

export default App;
