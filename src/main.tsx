import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LiveView } from './page/LiveView.tsx';
import './base.css';
import { Shot } from './page/Shot.tsx';
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
          <Route path='/shot' element={<Shot />} />
        </Route>
        <Route path='/live' element={<LiveView />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
