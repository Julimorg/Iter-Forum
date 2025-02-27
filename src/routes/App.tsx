import { Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome-Page/Welcome";
import Login from "../pages/Login-Page/Login";
import SignUp from "../pages/SignUp-Page/SignUp";
import Home from "../pages/Home-Page/Home";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/home" element={<Home />} />

    </Routes>
  );
}

export default App;
