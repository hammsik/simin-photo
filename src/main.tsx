import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LiveView } from './page/LiveView.tsx';
import './base.css';
import { AfterShot } from './page/AfterShot.tsx';
import { Intro } from './page/Intro.tsx';
import { Layout } from './components/Layout.tsx';
import { DuringShot } from './page/DuringShot.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Intro />} />
          <Route path='/during-shot' element={<DuringShot />} />
          <Route path='/after-shot' element={<AfterShot />} />
        </Route>
        <Route path='/live' element={<LiveView />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
