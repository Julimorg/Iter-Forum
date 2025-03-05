import { Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome_Page/Welcome";
import Login from "../pages/Login_Page/Login";
import SignUp from "../pages/SignUp_Page/SignUp";
import Home from "../pages/Home_Page/Home";
import UserProfile from "../pages/Profile_Page/UserProfile";
import CreatePost from "../pages/CreatePost_Page/CreatePost";

function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      
      {/* Nested Route for Home */}
      <Route path="/home" element={<Home />}>
        <Route path="profile" element={<UserProfile />} />
        <Route path="create-post" element={<CreatePost />} />
      </Route>
    </Routes>
    </div>
  );
}

export default App;
