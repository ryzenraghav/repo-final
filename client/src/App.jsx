import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OtpLogin from "./pages/OtpLogin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OtpLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

