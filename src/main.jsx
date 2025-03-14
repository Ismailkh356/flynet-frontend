import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './d8fdj39jfksl3ap23.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/video-downloader" element={<App />} />
        <Route path="/video-downloader/:platform" element={<App />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);




// import './bj39dfg8f439dap5.css';
// import './i18n.js';
// import './components/h93jdk8si6n.css';
// import Faq from './components/fj39dk@d3F983';
// import Footer from './components/u8df9jh2ujF23';
// import Nbar from './components/yi93df8s@d4n';



