import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import PostDisplayComponent from './Components/PostDisplayComponent';
import { useAuthStore } from '../../hook/useAuthStore';
import { useEffect } from 'react';
import { socketService } from '../../services/socket-service';

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  const user_id = useAuthStore.getState().user_id;

  useEffect(() => {
    if (user_id) {
      socketService.connect(user_id); 
    }

    return () => {
      socketService.disconnect(); 
    };
  }, [user_id]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-12 bg-white border-b border-gray-200 shadow-md z-10">
        <Header />
      </div>
      <div className="flex pt-12 pb-2 gap-0.5 h-[calc(100vh-3rem)] sm:gap-1 md:gap-1.5 xl:gap-2">
        <div className="sticky top-12 w-[13vw] min-w-[9rem] bg-gray-100 h-[calc(100vh-3rem)] sm:w-[12vw] sm:min-w-[10rem] md:w-[11vw] md:min-w-[11rem] xl:w-[10vw] xl:min-w-[12rem]">
          <Sidebar />
        </div>
        <div className="flex-1 ">{isHomePage ? <PostDisplayComponent /> : <Outlet />}</div>
      </div>
    </>
  );
};

export default Home;
