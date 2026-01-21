import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Importamos la página
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Momento Verde</h1>
        <Routes>
          <Route path="/" element={<Login />} /> {/* La página principal será el Login */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;