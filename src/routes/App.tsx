// import React, { useEffect } from "react";
import { Routes, Route,} from "react-router-dom";
import Welcome from "../pages/Welcome_Page/Welcome";
import Login from "../pages/Login_Page/Login";
import SignUp from "../pages/SignUp_Page/SignUp";
import Home from "../pages/Home_Page/Home";
import UserProfile from "../pages/Profile_Page/UserProfile";
import CreatePost from "../pages/CreatePost_Page/CreatePost";
import Sidebar from "../components/Sidebar/Sidebar";
import Popular from "../pages/Popular/Popular"; // Create this page
import Explore from "../pages/Explore/Explore"; // Create this page

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Home Layout with Sidebar */}
        <Route
          path="/home"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar /> {/* Sidebar remains static */}
              <Home /> {/* Main content area */}
            </div>
          }
        >
          <Route path="profile" element={<UserProfile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="popular" element={<Popular />} />
          <Route path="explore" element={<Explore />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
