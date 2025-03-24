import React, { useEffect, useRef, useState } from "react";
import styles from "./userProfile.module.css";
import ButtonIconLeft from "../../components/ButtonIconLeft/ButtonIconLeft";
import { FaUserPen, FaXmark } from "react-icons/fa6";
import IconButton from "../../components/RoundButtonIcon/RoundButtonIcon";
import Post_Card from "../../components/Post_Card/postcard";
import ButtonTextComponent from "../../components/ButtonTextOnly/ButtonText";
import authorizedAxiosInstance from "../../services/Auth";
import { API_BE } from "../../config/configApi";
import Postcard from "../../components/Post_Card/postcard";
import axios from "axios";

const fakeAvatar: string =
  "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";
interface UserDetail {
  user_id: string;
  user_name: string;
  email: string;
  ava_img_path: string | null;
  age: string | null;
  phone_num: string | null;
}
interface ProfileResponse {
  data: UserDetail;
}

interface PostItem {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  post_id: string;
  post_content: string;
  img_url: string[];
  upvote: number;
  downvote: number;
  comments_num: number;
  
}
interface PostsResponse {
  data: PostItem[];
}

interface UserProfile {
  user_name?: string;
  email?: string;
  ava_img_path?: string | null;
  phone_num?: string;
  age?: number;
}
const UserProfile = () => {
  const [profileEditModel, setProfileEditModel] = useState(false);
  const [error, setError] = useState("");
  const [fetchUser, setFetchUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostItem[]>([]);


  //* ===================== FUNCTION HANDLE API ===================== **//

  //? Fetch API Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setError("Vui lòng đăng nhập để xem thông tin profile");
          return;
        }
        const res = await authorizedAxiosInstance.get<ProfileResponse>(
          `${API_BE}/api/v1/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Users API Response:", res.data);

        if (res.data && res.data.data) {
          setFetchUser(res.data.data); // Gán phần data bên trong
        } else {
          console.error("Dữ liệu API không đúng định dạng", res.data);
          setFetchUser(null);
          setError("Dữ liệu trả về không hợp lệ");
        }
      } catch (error: any) {
        console.error("Lỗi khi fetch API Users:", error);
        if (error.response?.status === 404) {
          setError("Không tìm thấy thông tin profile.");
        } else {
          setError(
            error.response?.data?.message ||
            "Không thể tải thông tin người dùng"
          );
        }
        setFetchUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //? Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!fetchUser?.user_id) return; // Chỉ chạy khi fetchUser có giá trị
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          setError('Vui lòng đăng nhập để xem danh sách bài post');
          return;
        }

        const userId = fetchUser.user_id;

        const res = await axios.get<PostsResponse>(
          `${API_BE}/api/v1/posts/user_posts/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log('Posts API Response:', res.data);

        if (res.data.data) {
          setPosts(res.data.data);
        } else {
          console.error('Dữ liệu API không đúng định dạng', res.data);
          setPosts([]);
          setError('Dữ liệu trả về không hợp lệ');
        }
      } catch (error: any) {
        console.error('Lỗi khi fetch API Posts:', error);
        if (error.response?.status === 404) {
          setError('Không tìm thấy bài post nào.');
        } else {
          setError(
            error.response?.data?.message || 'Không thể tải danh sách bài post'
          );
        }
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [fetchUser]);

  //? Handle Open User Profile Edit Modal
  function UserProfileEditForm({
    isOpen,
    onClose,
    setFetchUser,
  }: {
    isOpen: boolean;
    onClose: () => void;
    setFetchUser: React.Dispatch<React.SetStateAction<UserDetail | null>>;
  }) {
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const userNameRef = useRef<HTMLInputElement>(null);
    const userEmailRef = useRef<HTMLInputElement>(null);
    const userPhoneRef = useRef<HTMLInputElement>(null);
    const userAgeRef = useRef<HTMLInputElement>(null);
    const accessToken = localStorage.getItem("accessToken");

    // Fetch dữ liệu khi form mở
    useEffect(() => {
      const fetchProfile = async () => {
        if (!isOpen || !accessToken) return;

        try {
          const response = await authorizedAxiosInstance.get<ProfileResponse>(
            `${API_BE}/api/v1/users/profile`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const userData = response.data.data;
          console.log('Fetched user data:', userData);

          // Chỉ set giá trị ban đầu khi form mở, không ghi đè liên tục
          if (userNameRef.current && !userNameRef.current.value) userNameRef.current.value = userData.user_name || '';
          if (userEmailRef.current && !userEmailRef.current.value) userEmailRef.current.value = userData.email || '';
          if (userPhoneRef.current && !userPhoneRef.current.value) userPhoneRef.current.value = userData.phone_num || '';
          if (userAgeRef.current && !userAgeRef.current.value) userAgeRef.current.value = userData.age || '';
          if (userData.ava_img_path) setSelectedImage(userData.ava_img_path);
        } catch (error) {
          console.error('Fetch failed:', error);
          setError('Failed to load profile');
        }
      };

      fetchProfile();
    }, [isOpen, accessToken]);


    //? Update profile
    useEffect(() => {
      const updateProfile = async () => {
        if (!isSubmitting || !accessToken) return;

        try {
          const userName = userNameRef.current?.value || '';
          const email = userEmailRef.current?.value || '';
          const phoneNum = userPhoneRef.current?.value || '';
          const age = userAgeRef.current?.value ? parseInt(userAgeRef.current.value) : undefined;

          // Validation
          if (userName && userName.length > 20) {
            setError('User name limit 20 chars');
            return;
          }
          if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Email is invalid');
            return;
          }
          if (phoneNum && !/^\d{10}$/.test(phoneNum)) {
            setError('Phone is invalid');
            return;
          }
          if (age && (age < 13 || age > 100)) {
            setError('Age limit from 13 to 100');
            return;
          }

          // Lấy dữ liệu hiện tại để so sánh và gửi toàn bộ profile
          const response = await authorizedAxiosInstance.get<ProfileResponse>(
            `${API_BE}/api/v1/users/profile`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const userData = response.data.data;

          const profileData: UserProfile = {
            user_name: userName || userData.user_name || '',
            email: email || userData.email || '',
            ava_img_path: selectedImage !== null ? selectedImage : userData.ava_img_path,
            phone_num: phoneNum || userData.phone_num || '',
            age: age !== undefined ? age : (userData.age ? parseInt(userData.age) : undefined),
          };

          console.log('Sending PUT request with data:', profileData);

          const updateResponse = await authorizedAxiosInstance.put(
            `${API_BE}/api/v1/users/profile/${userData.user_id}`,
            profileData,
            { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
          );

          console.log('Profile updated successfully:', updateResponse.data);
          alert('Profile updated successfully!');
          setError(null);
          setFetchUser(updateResponse.data.data);
          onClose();
        } catch (error) {
          console.error('Request failed:', error);
          if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || 'Failed to process request');
            console.log('Error response:', error.response);
          } else {
            setError('An unexpected error occurred');
          }
        } finally {
          setIsSubmitting(false);
        }
      };

      updateProfile();
    }, [isSubmitting, accessToken, onClose, setFetchUser]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
      }
    };

    const eventClickOpenFile = () => {
      document.getElementById("avatarUpload")?.click();
    };

    const handleRemoveImage = () => {
      setSelectedImage(null);
    };

    const handleSubmit = () => {
      if (!accessToken) {
        setError('Please login first');
        return;
      }
      setIsSubmitting(true);
    };

    if (!isOpen) return null;

    return (
      <div className={`${styles.editModel} ${isOpen ? styles.show : styles.hide}`}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.editFormHeader}>
          <h2>Edit Profile</h2>
          <IconButton Icon={FaXmark} size={20} color="#333" onClick={onClose} />
        </div>
        {/* Form content giữ nguyên */}
        <div className={styles.editFormBody}>
          <div className={styles.fillTextForm}>
            <div className={styles.editUserName}>
              {error?.includes('User name') ? (
                <p className={styles.errorText}>User name limit 20 chars</p>
              ) : (
                <p>Your User Name</p>
              )}
              <input ref={userNameRef} className={styles.userNameInput} type="text" placeholder="Your user name..." />
            </div>
            <div className={styles.editUserEmail}>
              {error?.includes('Email') ? (
                <p className={styles.errorText}>Email is invalid</p>
              ) : (
                <p>Your Email</p>
              )}
              <input ref={userEmailRef} className={styles.userEmailInput} type="email" placeholder="Your email..." />
            </div>
            <div className={styles.editUserPhone}>
              {error?.includes('Phone') ? (
                <p className={styles.errorText}>Phone is invalid</p>
              ) : (
                <p>Your Phone</p>
              )}
              <input ref={userPhoneRef} className={styles.userPhoneInput} type="text" placeholder="Your phone number..." />
            </div>
            <div className={styles.editUserAge}>
              {error?.includes('Age') ? (
                <p className={styles.errorText}>Age limit from 13 to 100</p>
              ) : (
                <p>Your Age</p>
              )}
              <input ref={userAgeRef} className={styles.userAgeInput} type="number" placeholder="Your Age..." />
            </div>
          </div>
          <div className={styles.editAvartar}>
            <div className={styles.userEditAvatar}>
              <div className={styles.userImageInput}>
                <img src={selectedImage || fakeAvatar} alt="Avatar" />
              </div>
            </div>
            <div className={styles.inputImgAvatarBtn}>
              <input type="file" accept="image/*" style={{ display: "none" }} id="avatarUpload" onChange={handleImageChange} />
              <ButtonTextComponent
                $backgroundColor="rgb(200, 200, 200)"
                $hoverBackgroundColor="C5F6FF"
                $hoverColor="#333"
                title="Input image"
                onClick={eventClickOpenFile}
              />
              {selectedImage && (
                <ButtonTextComponent
                  $backgroundColor="rgb(200, 200, 200)"
                  $hoverBackgroundColor="C5F6FF"
                  $hoverColor="#333"
                  title="Remove image"
                  onClick={handleRemoveImage}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.confirmBtn}>
          <ButtonTextComponent
            $backgroundColor="rgb(200, 200, 200)"
            $hoverBackgroundColor="C5F6FF"
            $hoverColor="#333"
            title="Confirm new information"
            $width="15em"
            onClick={handleSubmit}
          />
        </div>
      </div>
    );
  }
  const DisplayPostComponent: React.FC<{
    posts: PostItem[];
    setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>;
  }> = ({ posts, setPosts }) => {
    const removePost = (id: string) => {
      setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== id));
    };

    return (
      <>
        <div className={styles.postContainer}>
        {posts.length > 0
          ? posts.map((post, index) => (
            <Post_Card
              key={post.post_id}
              // id={post.post_id}
              user={post.user_name}
              caption={post.post_content}
              likes={post.upvote}
              dislikes={post.downvote}
              comments={post.comments_num}
              images={post.img_url}
              tags={[]}
              onRemove={() => removePost(post.post_id)}
              isTrending={index === 0}
            />
          ))
          : null}
      </div >
      </>
    );
  };
//** Main View */
if (loading) {
  return <p>Loading...</p>;
}
if (!fetchUser) {
  return <p>Không tìm thấy thông tin người dùng</p>;
}
return (
  <>
    <div className={styles.profileContainer}>
      <div className={styles.userProfileBody}>
        {/* Header Profile */}
        <div className="userProfileContact">
          {/* User Basic info */}
          <div className={styles.userProfileInformation}>
            <div className={styles.userProfileImage}>
              <img
                src={fetchUser?.ava_img_path || fakeAvatar}
                alt={fetchUser?.user_name || "unknown"}
              />
            </div>
            <div className={styles.userProfileName}>
              <h1>{fetchUser?.user_name || "Chưa có tên"}</h1>
              <p>Status: Active</p>
            </div>
            <div className={styles.userProfileBio}>
              <div className={styles.userBasicInfo}>
                <h1>My information</h1>
                <p>Email: {fetchUser?.email || "N/A"}</p>
                <p>Phone: {fetchUser?.phone_num || "N/A"}</p>
                <p>Age: {fetchUser?.age || "N/A"}</p>
              </div>
              {/* Ovelay khi modal hiện lên */}
              {profileEditModel && (
                <div
                  className={styles.overlay}
                  onClick={() => setProfileEditModel(false)}
                ></div>
              )}
              <div className="editUserProfile" >
                <ButtonIconLeft
                  Icon={FaUserPen}
                  size={20}
                  color="#333"
                  title="Edit Profile"
                  onclick={() => setProfileEditModel(true)}
                />
                <UserProfileEditForm
                  isOpen={profileEditModel}
                  onClose={() => setProfileEditModel(false)}
                  setFetchUser={setFetchUser}
                />
              </div>
            </div>
          </div>
        </div>
        <span />
        {/* User Profile Post, ... etc */}
        <div className="userProfileContent">
          <DisplayPostComponent posts={posts} setPosts={setPosts} />
        </div>
      </div>
    </div>
  </>
);
};
export default UserProfile;
