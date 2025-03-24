import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./viewuserprofile.module.css";
import authorizedAxiosInstance from "../../services/Auth";

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

interface ApiResponse {
  is_success: boolean;
  status_code: number;
  message: string;
  data: UserProfile;
  timestamp: number;
}

const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";

const ViewUserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          `http://localhost:3000/api/v1/users/user-detail/${userId}` // Endpoint đúng
        );
        console.log("API response:", response.data);

        if (response.data.is_success) {
          setUserProfile(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || "Failed to fetch user profile");
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        const errorMessage = err.response?.data?.message || "User not found or server error";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div className={styles.profileContainer}>Loading...</div>;
  }

  if (error || !userProfile) {
    return <div className={styles.profileContainer}>{error || "User not found"}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className="userProfileBody">
        <div className="userProfileContact">
          <div className={styles.userProfileInformation}>
            <div className={styles.userProfileImage}>
              <img src={userProfile.ava_img_path || fakeAvatar} alt={userProfile.user_name} />
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
            </div>
          </div>
        </div>
        <span />
        <div className="userProfileContent">
          {/* Thêm nội dung nếu cần, ví dụ: danh sách bài post */}
        </div>
      </div>
    </div>
  );
};

export default ViewUserProfile;