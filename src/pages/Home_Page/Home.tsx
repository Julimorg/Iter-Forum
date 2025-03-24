import React, { useEffect, useState } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import styles from './home.module.css';
import Header from '../../components/Header_HomePage/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Post_Card from '../../components/Post_Card/postcard';
import RecentPost from '../../components/Recent_Post_Card/recent_post_card';
import authorizedAxiosInstance from '../../services/Auth';
import { handleLogOutAPI } from '../../apis';


interface PostItem {
  id: string;
  user: string;
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  tags: string[];
  images?: string[];
  isTrending?: boolean;
}
interface Posts {
  user_id: string;
  user_name: string;
  ava_img_path: string;
  post_id: string;
  post_title: string;
  post_content: string;
  img_url?: string[];
  date_updated: string;
  upvote: number;
  downvote: number;
  comments_num: number;
  tags: string[];
}
interface RecentPost{
  user_id: string;
  user_name: string;
  ava_img_path: string;
  post_id: string;
  post_title: string;
  post_content: string;
  img_url?: string[];
  date_updated: string;
  comments_num: number;
}
interface PostsResponse {
  data: {
    recommend_posts: Posts[];
    recent_posts: Posts[];
  };
}
function PostDisplayComponent() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [recentPosts, setRecentPosts] = useState<Posts[]>([]);
  const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = localStorage.getItem("accessToken");

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchHomePosts = async () => {
      if (!accessToken) {
        setError("Please login to view posts");
        setLoading(false);
        return;
      }

      try {
        const response = await authorizedAxiosInstance.get<PostsResponse>(
          "http://localhost:3000/api/v1/recommend/home",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetched home posts:", response.data);

        // Lấy dữ liệu từ response.data
        const { recommend_posts, recent_posts } = response.data.data;

        // Cập nhật state
        setPosts(recommend_posts || []); // Nếu không có dữ liệu thì dùng mảng rỗng
        setRecentPosts(recent_posts || []); // Nếu không có dữ liệu thì dùng mảng rỗng
        setError(null);
      } catch (error) {
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

  const removePost = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== id));
    setRecentPosts((prevRecent) => prevRecent.filter((post) => post.post_id !== id));
  };

  const clearRecentPosts = () => {
    setShowRecentPosts(false);
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className={styles.flexContainer}>
        <div className={styles.content}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post_Card
                key={post.post_id}
                user={post.user_name}
                caption={post.post_content}
                likes={post.upvote}
                dislikes={post.downvote}
                comments={post.comments_num}
                tags={post.tags}
                images={post.img_url}
                onRemove={() => removePost(post.post_id)}
                isTrending={false} // Có thể thêm logic để xác định trending
              />
            ))
          ) : (
            <p>No recommended posts available.</p>
          )}
        </div>
        {showRecentPosts && (
          <div className={styles.recentPost}>
            <div className={styles.recentPostHeader}>
              <h2>Recent Post</h2>
              <button className={styles.clearButton} onClick={clearRecentPosts}>
                Clear
              </button>
            </div>
            <div className={styles.recentPostContent}>
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <RecentPost
                    key={post.post_id}
                    user={post.user_name}
                    caption={post.post_content}
                    comments={post.comments_num}
                    image={post.img_url && post.img_url.length > 0 ? post.img_url[0] : undefined}
                    likes={post.upvote}
                    dislikes={post.downvote}
                    tags={post.tags}
                    images={post.img_url}
                    isTrending={false}
                  />
                ))
              ) : (
                <p>No recent posts available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  const navigate = useNavigate();

  const handleLogOut = async () => {
    localStorage.removeItem('userInfo');
    await handleLogOutAPI();
    navigate('/login');
  };

  return (
    <>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.homeBody}>
        <Sidebar onSignOutClick={handleLogOut} />
        <div className={styles.mainContent}>
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