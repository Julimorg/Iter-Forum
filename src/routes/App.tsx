import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Welcome from '../pages/Welcome_Page/Welcome';
import Login from '../pages/Login_Page/Login';
import SignUp from '../pages/SignUp_Page/SignUp';
import Home from '../pages/Home_Page/Home';
import UserProfile from '../pages/Profile_Page/UserProfile';
import CreatePost from '../pages/CreatePost_Page/CreatePost';
import Popular from '../pages/Popular/Popular';
import Explore from '../pages/Explore_Page/Explore';
import PostDetail from '../pages/Post_Detail/post_detail';
import TagDetail from '../pages/Tag_Detail/tag_detail';
import AllSubscribedTags from '../pages/All_Subscribed_Tags/all_subcribed_tags';
import ViewUserProfile from '../pages/ViewUser_Page/ViewUserProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '../hook/useAuthStore';

const AuthorizedRoute = () => {
  const access_token = useAuthStore((state) => state.access_token);
  if (!access_token) {
    console.log(access_token);
    console.log('No accessToken found, redirecting to /login');
    return <Navigate to="/login" replace={true} />;
  }
  console.log('AccessToken found, rendering Outlet');

  return <Outlet />;
};

const UnAuthorizedRoute = () => {
  const access_token = useAuthStore((state) => state.access_token);
  if (access_token) {
    console.log(access_token);
    console.log('AccessToken exists, redirecting to /home');
    return <Navigate to="/home" replace={true} />;
  }
  return <Outlet />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        {/* Unauthorize routes */}
        <Route element={<UnAuthorizedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        {/* Authorize routes */}
        <Route element={<AuthorizedRoute />}>
          <Route path="/home" element={<Home />}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="popular" element={<Popular />} />
            <Route path="explore" element={<Explore />} />
            <Route path="post-detail/:postId" element={<PostDetail />} />
            <Route path="tag/:tagId" element={<TagDetail />} />
            <Route path="all-subscribed-tags" element={<AllSubscribedTags />} />
            <Route path="user" element={<ViewUserProfile />} />
            <Route path="user-detail/:userId" element={<ViewUserProfile />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="bottom-left" theme="colored" />
    </>
  );
}

export default App;
