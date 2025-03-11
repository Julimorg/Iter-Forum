import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import styles from './home.module.css';
import Header from '../../components/Header_HomePage/Header';
// import Footer from '../../components/Footer_HomePage/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import Post_Card from '../../components/Post_Card/postcard';
import RecentPost from '../../components/Recent_Post_Card/recent_post_card';

const Home = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  const [posts, setPosts] = useState([1, 2, 3]); // Manage posts state
  const [showRecentPosts, setShowRecentPosts] = useState(true); // Manage visibility of recent posts

  // Function to remove a post by its index
  const removePost = (index: number) => {
    setPosts((prevPosts) => prevPosts.filter((_, i) => i !== index));
  };

  // Function to toggle the visibility of recent posts
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
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          {/* Config child routes here */}
          {isHomePage ? (
            <>
              <div className={styles.content}>
              {posts.map((post, index) => (
                <Post_Card
                    key={index}
                    user={`User ${index + 1}`} // Replace with dynamic user if available
                    caption={`This is caption ${index + 1}`}
                    likes={Math.floor(Math.random() * 100)} // Example: Random like count
                    dislikes={Math.floor(Math.random() * 10)} // Example: Random dislike count
                    comments={Math.floor(Math.random() * 50)} // Example: Random comment count
                    tags={["ReactJS", "JavaScript", "Web Development"]}
                    onRemove={() => removePost(index)}
                    isTrending={index === 0} // First post is trending
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
                      { id: 1, avatar: "https://via.placeholder.com/40" },
                      { id: 2, avatar: "https://via.placeholder.com/40" },
                      { id: 3, avatar: "https://via.placeholder.com/40" },
                    ].map((post) => (
                      <RecentPost key={post.id} avatarUrl={post.avatar} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
      {/* FOOTER */}
      {/* <div className={styles.footer}>
        <Footer />
      </div> */}
    </>
  );
};

export default Home;
