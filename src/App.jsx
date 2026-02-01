import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Intro from './components/Intro';
import LoginPage from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import FocusScan from './pages/FocusScan';
import Reader from './pages/Reader';

const LandingWrapper = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!introComplete && (
          <Intro onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* Show Login after Intro, or if Intro is already done */}
      {introComplete && <LoginPage />}
    </>
  );
};



import TestResults from './pages/TestResults';

import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus-scan" element={<FocusScan />} />
        <Route path="/test-results" element={<TestResults />} />
        <Route path="/reader" element={<Reader />} />
      </Routes>
    </Router>
  );
}

export default App;
