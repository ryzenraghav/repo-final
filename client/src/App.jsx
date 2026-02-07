import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import OAuthSuccess from "./pages/OAuthSuccess";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/report" element={<Report />} />
        
        
        
      </Routes>
    </Router>
  );
}

export default App;

