import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRScanner from './QRScanner';
import SuccessPage from './SuccessPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<QRScanner />} />
        <Route path="/SuccessPage" element={<SuccessPage />}/>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  </React.StrictMode>
);