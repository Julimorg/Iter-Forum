import { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Post_Card from '../../components/Post_Card/postcard';
import RecentPost from '../../components/Recent_Post_Card/recent_post_card';
import Header from './Header';
import Sidebar from './Sidebar';
import { useGetRecentPosts, useGetRecommendPosts } from './Hooks/useGetHome';
import { Skeleton } from 'antd';

function PostDisplayComponent() {
  const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);
  const { data, isLoading, error } = useGetRecommendPosts();
  const { data: recentData, isLoading: isLoadingRecent, error: recentError } = useGetRecentPosts();
  console.log(data);

  const removePost = (postId: string) => {
    // Nếu cần xóa bài post khỏi UI mà không refetch API, bạn có thể sử dụng cache của react-query
    // Tuy nhiên, vì bạn muốn bỏ state, giải pháp tốt hơn là refetch hoặc xử lý phía server
    console.log(`Remove post with ID: ${postId}`);
    // Nếu cần, bạn có thể gọi API để xóa bài post và refetch dữ liệu
  };

  const clearRecentPosts = () => {
    setShowRecentPosts(false);
  };

  if (isLoading || isLoadingRecent) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(1)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 5 }} />
          ))}
        </div>
      </>
    );
  }

  if (error || recentError) {
    return <div className="text-center text-red-500 text-lg">Lỗi: {(error as Error).message}</div>;
  }

  const recommendPosts = data?.data.recommend_posts || [];
  const recentPosts = recentData?.data.recent_posts || [];

  return (
    <div className="flex gap-8 w-full max-w-[65rem] mx-auto">
      <div className="flex-1 p-5 overflow-hidden">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(1)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 5 }} />
          ))}
        </div> */}

        {recommendPosts.length > 0 ? (
          recommendPosts.map((post) => (
            <Post_Card
              key={post.post_id}
              post_id={post.post_id}
              user={post.user_name}
              user_id={post.user_id}
              title={post.post_title}
              caption={post.post_content}
              likes={post.upvote}
              dislikes={post.downvote}
              comments={post.comments_num}
              tags={post.tags}
              images={post.img_url}
              avatar={post.ava_img_path}
              onRemove={() => removePost(post.post_id)}
              isTrending={false}
              date_updated={post.date_updated}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center">Không có bài viết gợi ý nào.</p>
        )}
      </div>
      {showRecentPosts && (
        <div className="fixed right-8 top-[12.5%] w-80 bg-gray-100 rounded-lg p-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Bài viết gần đây</h2>
            <button
              className="text-blue-600 underline bg-transparent rounded px-3 py-1.5 text-sm hover:bg-gray-200 transition-colors duration-200"
              onClick={clearRecentPosts}
            >
              Xóa
            </button>
          </div>
          <div className="flex flex-col gap-4 min-h-[50vh]">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <RecentPost
                  key={post.post_id}
                  user={post.user_name}
                  user_id={post.user_id}
                  post_id={post.post_id}
                  title={post.post_title}
                  comments={post.comments_num}
                  image={post.img_url && post.img_url.length > 0 ? post.img_url[0] : undefined}
                  likes={post.upvote}
                  dislikes={post.downvote}
                  tags={post.tags}
                  images={post.img_url}
                  isTrending={false}
                  date_updated={post.date_updated}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center">Không có bài viết gần đây.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 bg-white border-b-2 border-gray-200 shadow-md z-10">
        <Header />
      </div>
      <div className="flex pt-16 pb-4 gap-8 h-[calc(100vh-4rem)]">
        <div className="sticky top-16 w-56 bg-gray-100 h-[calc(100vh-4rem)] mt-[10rem]">
          <Sidebar />
        </div>
        <div className="flex-1">{isHomePage ? <PostDisplayComponent /> : <Outlet />}</div>
      </div>
    </>
  );
};

export default Home;
