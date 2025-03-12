import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import styles from './home.module.css';
import Header from '../../components/Header_HomePage/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Post_Card from '../../components/Post_Card/postcard';
import RecentPost from '../../components/Recent_Post_Card/recent_post_card';

interface PostItem {
  id: string;
  user: string;
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  tags: string[];
}

// Khởi tạo dữ liệu cho các bài post
const initialPosts: PostItem[] = [
  { 
    id: 'post-1', 
    user: 'User 1', 
    caption: 'This is caption 1', 
    likes: 45, 
    dislikes: 3, 
    comments: 12, 
    tags: ["ReactJS", "JavaScript", "Web Development"]
  },
  { 
    id: 'post-2', 
    user: 'User 2', 
    caption: 'This is caption 2', 
    likes: 78, 
    dislikes: 5, 
    comments: 8, 
    tags: ["ReactJS", "JavaScript", "Web Development"]
  },
  { 
    id: 'post-3', 
    user: 'User 3', 
    caption: 'This is caption 3', 
    likes: 100, 
    dislikes: 4, 
    comments: 15, 
    tags: ["ReactJS", "JavaScript", "Web Development"]
  }
];

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";

  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);

  // Hàm xóa bài đăng dựa vào id
  const removePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  // Hàm xóa các bài đăng Recent
  const clearRecentPosts = () => {
    setShowRecentPosts(false);
  };

  return (
    <>
      {/* HEADER */}
      <div className={styles.header}>
        <Header />
      </div>
      {/* BODY */}
      <div className={styles.homeBody}>
        <Sidebar />
        <div className={styles.mainContent}>
          {isHomePage ? (
            <div className={styles.flexContainer}>
              <div className={styles.content}>
                {posts.map((post) => (
                  <Post_Card
                    key={post.id}
                    user={post.user}
                    caption={post.caption}
                    likes={post.likes}
                    dislikes={post.dislikes}
                    comments={post.comments}
                    tags={post.tags}
                    onRemove={() => removePost(post.id)}
                    isTrending={post.id === 'post-1'}  // Ví dụ: chỉ post đầu tiên là trending
                  />
                ))}
              </div>
              {showRecentPosts && (
                <div className={styles.recentPost}>
                  <div className={styles.recentPostHeader}>
                    <h2>Recent Post</h2>
                    <button
                      className={styles.clearButton}
                      onClick={clearRecentPosts}
                    >
                      Clear
                    </button>
                  </div>
                  <div className={styles.recentPostContent}>
                    {[
                      { id: 1,},
                      { id: 2,},
                      { id: 3,},
                    ].map(post => (
                      <RecentPost key={post.id} />
                    ))}
                  </div>
                  <div className={styles.recentPostHeader}>
                    <h2>Recent Post</h2>
                    <button
                      className={styles.clearButton}
                      onClick={clearRecentPosts}
                    >
                      Clear
                    </button>
                  </div>
                  <div className={styles.recentPostContent}>
                    {[
                      { id: 1,},
                      { id: 2,},
                      { id: 3,},
                    ].map(post => (
                      <RecentPost key={post.id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
      {/* FOOTER (nếu cần) */}
      {/* <div className={styles.footer}> <Footer /> </div> */}
    </>
  );
};

export default Home;
