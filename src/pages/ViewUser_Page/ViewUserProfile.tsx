import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./viewuserprofile.module.css";
import authorizedAxiosInstance from "../../services/Auth";
import { API_BE } from "../../config/configApi";
import Post_Card from "../../components/Post_Card/postcard";
import ReportPopup from "../../components/Report_Popup/Report_popup";

interface UserProfile {
  user_id: string;
  user_name: string;
  age: number;
  ava_img_path: string | null;
  phone_num: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  status: string;
}

interface PostItem {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  post_id: string;
  post_title: string;
  post_content: string;
  img_url: string[];
  upvote: number;
  downvote: number;
  comments_num: number;
}

interface ApiResponse {
  is_success: boolean;
  status_code: number;
  message: string;
  data: UserProfile;
  timestamp: number;
}

interface PostsResponse {
  is_success: boolean;
  status_code: number;
  message: string;
  data: PostItem[];
  timestamp: number;
}

const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";

const ViewUserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError("User ID not provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user profile for userId:", userId);
        const response = await authorizedAxiosInstance.get<ApiResponse>(
          `${API_BE}/api/v1/users/user-detail/${userId}`
        );
        console.log("User Profile API response:", response.data);

        if (response.data.is_success) {
          setUserProfile(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || "Failed to fetch user profile");
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        const errorMessage =
          err.response?.data?.message || "User not found or server error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      if (!userId) return;

      try {
        console.log("Fetching posts for userId:", userId);
        const response = await authorizedAxiosInstance.get<PostsResponse>(
          `${API_BE}/api/v1/posts/user_posts/${userId}`
        );
        console.log("Posts API response:", response.data);

        if (response.data.is_success) {
          setPosts(response.data.data);
        } else {
          console.error("Failed to fetch user posts:", response.data.message);
          setPosts([]);
        }
      } catch (err: any) {
        console.error("Error fetching user posts:", err);
        setPosts([]);
      }
    };

    fetchUserProfile();
    fetchUserPosts();
  }, [userId]);

  const handleRemovePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
  };
  
  const togglePopup = () => setPopupVisible(!popupVisible);


  if (loading) {
    return <div className={styles.profileContainer}>Loading...</div>;
  }

  if (error || !userProfile) {
    return (
      <div className={styles.profileContainer}>{error || "User not found"}</div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className="userProfileBody">
        <div className="userProfileContact">
          <div className={styles.userProfileInformation}>
            <div className={styles.userProfileImage}>
              <img
                src={userProfile.ava_img_path || fakeAvatar}
                alt={userProfile.user_name}
              />
            </div>
            <div className={styles.userProfileName}>
              <h1>{userProfile.user_name}</h1>
              <p>Status: {userProfile.status}</p>
            </div>
            <div className={styles.userProfileBio}>
              <div className={styles.userBasicInfo}>
                <h1>My Information</h1>
                <p>Email: {userProfile.email}</p>
                {userProfile.phone_num && <p>Phone: {userProfile.phone_num}</p>}
                {userProfile.age && <p>Age: {userProfile.age}</p>}
              </div>
              <div className={styles.dotsContainer}>
                <div className={styles.dotsButton} onClick={togglePopup}>
                  ⋮
                </div>
                {popupVisible && (
                  <div className={styles.popup} ref={popupRef}>
                    <ReportPopup
                      type="User"
                      user_id={userProfile.user_id}
                      // post_id={userProfile.post_id}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <span />
        <div className="userProfileContent">
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
                tags={[]} // API không trả về tags, truyền mảng rỗng
                images={post.img_url}
                avatar={post.ava_img_path}
                onRemove={() => handleRemovePost(post.post_id)}
                isTrending={false}
                // Không truyền date_updated vì API không trả về
              />
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserProfile;
