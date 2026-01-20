import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Importamos la página

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Momento Verde</h1>
        <Routes>
          <Route path="/" element={<Login />} /> {/* La página principal será el Login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;