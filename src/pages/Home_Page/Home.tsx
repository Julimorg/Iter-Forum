import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Post_Card from '../../components/Post_Card/postcard';
import RecentPost from '../../components/Recent_Post_Card/recent_post_card';
import authorizedAxiosInstance from '../../services/Auth';
import { API_BE } from '../../config/configApi';
import Header from './Header';
import Sidebar from './Sidebar';


interface Post {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  post_id: string;
  post_title: string;
  post_content: string;
  img_url: string[];
  date_updated: string;
  upvote: number;
  downvote: number;
  comments_num: number;
  tags: string[];
}

interface RecentPost {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  post_id: string;
  post_title: string;
  post_content: string;
  img_url?: string[];
  date_updated: string;
  comments_num: number;
}

interface PostsResponse {
  data: {
    recommend_posts: Post[];
    recent_posts: Post[];
  };
}

function PostDisplayComponent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken");


  useEffect(() => {
    const fetchHomePosts = async () => {
      if (!accessToken) {
        setError("Please login to view posts");
        setLoading(false);
        return;
      }

      try {
        const response = await authorizedAxiosInstance.get<PostsResponse>(
          `${API_BE}/api/v1/recommend/home`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched home posts:", response.data);
        const { recommend_posts, recent_posts } = response.data.data;
        setPosts(recommend_posts || []);
        setRecentPosts(recent_posts || []);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching home posts:", error);
        if (error.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to load posts. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomePosts();
  }, [accessToken]);

  const removePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
    setRecentPosts((prevRecent) => prevRecent.filter((post) => post.post_id !== postId));
  };

  const clearRecentPosts = () => {
    setShowRecentPosts(false);
  };

  if (loading) {
    return <div className="text-center text-gray-600 text-lg">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="flex gap-8 w-full max-w-[65rem] mx-auto">
      <div className="flex-1 p-5 overflow-hidden">
        {posts.length > 0 ? (
          posts.map((post) => (
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
          <p className="text-gray-600 text-center">No recommended posts available.</p>
        )}
      </div>
      {showRecentPosts && (
        <div className="fixed right-8 top-[12.5%] w-80 bg-gray-100 rounded-lg p-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-thumb-rounded-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Post</h2>
            <button
              className="text-blue-600 underline bg-transparent rounded px-3 py-1.5 text-sm hover:bg-gray-200 transition-colors duration-200"
              onClick={clearRecentPosts}
            >
              Clear
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
              <p className="text-gray-600 text-center">No recent posts available.</p>
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
        <div className="flex-1">
          {isHomePage ? (
            <PostDisplayComponent />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;