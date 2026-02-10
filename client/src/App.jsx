import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import Report from "./pages/Report";

import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

