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

// Dữ liệu mẫu cho Post_Card
const postCardData: PostItem[] = [
  {
    id: 'post-1',
    user: 'User 1',
    caption: 'Optimizing Backend Performance with Node.js!',
    likes: 50,
    dislikes: 2,
    comments: 15,
    tags: ['NodeJS', 'Backend', 'Performance'],
    images: [
      'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
      'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
    ],
    isTrending: true,
  },
  {
    id: 'post-2',
    user: 'User 2',
    caption: 'Getting Started with React Hooks!',
    likes: 65,
    dislikes: 3,
    comments: 10,
    tags: ['ReactJS', 'JavaScript', 'Frontend'],
    images: [
      'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg',
    ],
    isTrending: false,
  },
  {
    id: 'post-3',
    user: 'User 3',
    caption: 'Introduction to Machine Learning with Python!',
    likes: 80,
    dislikes: 1,
    comments: 20,
    tags: ['MachineLearning', 'Python', 'AI'],
    images: [
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      'https://images.pexels.com/photos/8386667/pexels-photo-8386667.jpeg',
    ],
    isTrending: false,
  },
  {
    id: 'post-4',
    user: 'User 4',
    caption: 'Exploring Cloud Computing with AWS!',
    likes: 40,
    dislikes: 5,
    comments: 8,
    tags: ['CloudComputing', 'AWS', 'DevOps'],
    images: [],
    isTrending: false,
  },
];

// Dữ liệu mẫu cho RecentPost
const recentPostData: PostItem[] = [
  {
    id: 'recent-1',
    user: 'User 5',
    caption: 'Securing Your App with Cybersecurity Best Practices!',
    likes: 35,
    dislikes: 1,
    comments: 7,
    tags: ['Cybersecurity', 'Web Development', 'Security'],
    images: [
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
      'https://images.pexels.com/photos/5380792/pexels-photo-5380792.jpeg',
      'https://images.pexels.com/photos/5474029/pexels-photo-5474029.jpeg',
    ],
    isTrending: false,
  },
  {
    id: 'recent-2',
    user: 'User 6',
    caption: 'Building Scalable Apps with TypeScript!',
    likes: 55,
    dislikes: 2,
    comments: 12,
    tags: ['TypeScript', 'JavaScript', 'Scalability'],
    images: [
      'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg',
    ],
    isTrending: true,
  },
  {
    id: 'recent-3',
    user: 'User 7',
    caption: 'The Future of Blockchain Technology!',
    likes: 70,
    dislikes: 0,
    comments: 18,
    tags: ['Blockchain', 'Crypto', 'Technology'],
    images: [],
    isTrending: false,
  },
];


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
  const [posts, setPosts] = useState<PostItem[]>(postCardData);
  const [recentPosts, setRecentPosts] = useState<PostItem[]>(recentPostData);
  const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);
  const [user, setUser] = useState<string | null>('');
  const removePost = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const clearRecentPosts = () => {
    setShowRecentPosts(false);
  };
  return (
    <>
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
              images={post.images}
              onRemove={() => removePost(post.id)}
              isTrending={post.isTrending}
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
              {recentPosts.map((post) => (
                <RecentPost
                  key={post.id}
                  user={post.user}
                  caption={post.caption}
                  comments={post.comments}
                  image={post.images && post.images.length > 0 ? post.images[0] : undefined}
                  likes={post.likes}
                  dislikes={post.dislikes}
                  tags={post.tags}
                  images={post.images}
                  isTrending={post.isTrending}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
// function PostDisplayComponent() {
//   const [posts, setPosts] = useState<Posts[]>([]);
//   const [recentPosts, setRecentPosts] = useState<Posts[]>([]);
//   const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const accessToken = localStorage.getItem("accessToken");

//   // Fetch dữ liệu từ API
//   useEffect(() => {
//     const fetchHomePosts = async () => {
//       if (!accessToken) {
//         setError("Please login to view posts");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await authorizedAxiosInstance.get<PostsResponse>(
//           "http://localhost:3000/api/v1/recommend/home",
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("Fetched home posts:", response.data);

//         // Lấy dữ liệu từ response.data
//         const { recommend_posts, recent_posts } = response.data.data;

//         // Cập nhật state
//         setPosts(recommend_posts || []); // Nếu không có dữ liệu thì dùng mảng rỗng
//         setRecentPosts(recent_posts || []); // Nếu không có dữ liệu thì dùng mảng rỗng
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching home posts:", error);
//         if (error.response?.status === 401) {
//           setError("Unauthorized. Please login again.");
//         } else {
//           setError("Failed to load posts. Please try again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHomePosts();
//   }, [accessToken]);

//   const removePost = (id: string) => {
//     setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== id));
//     setRecentPosts((prevRecent) => prevRecent.filter((post) => post.post_id !== id));
//   };

//   const clearRecentPosts = () => {
//     setShowRecentPosts(false);
//   };

//   if (loading) {
//     return <div>Loading posts...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <>
//       <div className={styles.flexContainer}>
//         <div className={styles.content}>
//           {posts.length > 0 ? (
//             posts.map((post) => (
//               <Post_Card
//                 key={post.post_id}
//                 user={post.user_name}
//                 caption={post.post_content}
//                 likes={post.upvote}
//                 dislikes={post.downvote}
//                 comments={post.comments_num}
//                 tags={post.tags}
//                 images={post.img_url}
//                 onRemove={() => removePost(post.post_id)}
//                 isTrending={false} // Có thể thêm logic để xác định trending
//               />
//             ))
//           ) : (
//             <p>No recommended posts available.</p>
//           )}
//         </div>
//         {showRecentPosts && (
//           <div className={styles.recentPost}>
//             <div className={styles.recentPostHeader}>
//               <h2>Recent Post</h2>
//               <button className={styles.clearButton} onClick={clearRecentPosts}>
//                 Clear
//               </button>
//             </div>
//             <div className={styles.recentPostContent}>
//               {recentPosts.length > 0 ? (
//                 recentPosts.map((post) => (
//                   <RecentPost
//                     key={post.post_id}
//                     user={post.user_name}
//                     caption={post.post_content}
//                     comments={post.comments_num}
//                     image={post.img_url && post.img_url.length > 0 ? post.img_url[0] : undefined}
//                     likes={post.upvote}
//                     dislikes={post.downvote}
//                     tags={post.tags}
//                     images={post.img_url}
//                     isTrending={false}
//                   />
//                 ))
//               ) : (
//                 <p>No recent posts available.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

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