import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Experience from './pages/Experience';
import Publications from './pages/Publications';
import Workshops from './pages/Workshops';
import STTP from './pages/STTP';
import Courses from './pages/Courses';
import Patents from './pages/Patents';
import Projects from './pages/Projects';
import Committees from './pages/Committees';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/sttp" element={<STTP />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/patents" element={<Patents />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/committees" element={<Committees />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
