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
  img_url: string;
  upvote: number;
  downvote: number;
  comments_num: number;
}
interface PostsResponse {
  data: PostItem[];
}
const UserProfile = () => {
  const [profileEditModel, setProfileEditModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const profileEditModelRef = useRef<HTMLDivElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const userEmailRef = useRef<HTMLInputElement>(null);
  const userPhoneRef = useRef<HTMLInputElement>(null);
  const userAgeRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [fetchUser, setFetchUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);
  //? Handle Submit Form
  const handleSubmit = () => {
    const userName = userNameRef.current?.value || "";
    const userEmail = userEmailRef.current?.value || "";
    const userAge = userAgeRef.current?.value || "";

    if (userName.length > 20) {
      setError("Tên không được quá 20 ký tự");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userEmail)) {
      setError("Email không hợp lệ");
      return;
    }

    const age = Number(userAge);
    if (age < 13 || age > 100) {
      setError("Tuổi phải từ 13 đến 100");
      return;
    }

    setError("");
    alert("Thông tin hợp lệ!");
  };

  //? Hanlde Open User Profile Edit Modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileEditModelRef.current &&
        !profileEditModelRef.current.contains(event.target as Node)
      ) {
        setProfileEditModel(false);
        // console.log(profileEditModelRef.current);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setError("Vui lòng đăng nhập để xem danh sách bài post");
          return;
        }

        const userId = fetchUser.user_id; // Lấy user_id từ fetchUser

        const res = await authorizedAxiosInstance.get<PostsResponse>(
          `${API_BE}/api/v1/posts/user_posts/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Posts API Response:", res.data);

        if (res.data.data) {
          setPosts(res.data.data);
        } else {
          console.error("Dữ liệu API không đúng định dạng", res.data);
          setPosts([]);
          setError("Dữ liệu trả về không hợp lệ");
        }
      } catch (error: any) {
        console.error("Lỗi khi fetch API Posts:", error);
        if (error.response?.status === 404) {
          setError("Không tìm thấy bài post nào.");
        } else {
          setError(
            error.response?.data?.message || "Không thể tải danh sách bài post"
          );
        }
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [fetchUser]);

  //? Handle input only 1 img to avatar
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // --> Chỉ lấy 1 file duy nhất
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
  //? Handle Open User Profile Edit Modal
  function UserProfileEditForm({ isOpen }: { isOpen: boolean }) {
    // if (!isOpen) return null;
    return (
      <>
        {/* <div className={isOpen ? `${styles.editModel} ${styles.show}` : `${styles.editModel} ${styles.hide}`}> */}
        <div
          className={
            isOpen
              ? `${styles.editModel} ${styles.show}`
              : `${styles.editModel} ${styles.hide}`
          }
        >
          <div className={styles.editFormHeader}>
            <h2>Edit Profile</h2>
            <IconButton
              Icon={FaXmark}
              size={20}
              color="#333"
              onClick={() => setProfileEditModel(false)}
            />
          </div>
          <div className={styles.editFormBody}>
            {/* Edit Text */}
            <div className={styles.fillTextForm}>
              {/* User Name */}
              <div className={styles.editUserName}>
                {error ? (
                  <p className={styles.errorText}>
                    User name limit 20 chars or empty
                  </p>
                ) : (
                  <p>Your User Name</p>
                )}
                <input
                  ref={userNameRef}
                  className={styles.userNameInput}
                  type="text"
                  placeholder="Your user name..."
                />
              </div>

              {/* User Email */}
              <div className={styles.editUserEmail}>
                {error ? (
                  <p className={styles.errorText}>Email is unvalid or empty</p>
                ) : (
                  <p>Your Email </p>
                )}
                <input
                  ref={userEmailRef}
                  className={styles.userEmailInput}
                  type="email"
                  placeholder="Your email..."
                />
              </div>

              {/* User Phone */}
              <div className={styles.editUserPhone}>
                {error ? (
                  <p className={styles.errorText}>Phone is unvalid or empty</p>
                ) : (
                  <p>Your Phone</p>
                )}
                <input
                  ref={userPhoneRef}
                  className={styles.userPhoneInput}
                  type="text"
                  placeholder="Your phone number..."
                />
              </div>
              {/* User Age */}
              <div className={styles.editUserAge}>
                {error ? (
                  <p className={styles.errorText}>
                    Age limit from 13 to 100 or empty
                  </p>
                ) : (
                  <p>Your Age</p>
                )}
                <input
                  ref={userAgeRef}
                  className={styles.userAgeInput}
                  type="number"
                  placeholder="Your Age..."
                />
              </div>
            </div>
            {/* Edit Img Avatar */}
            <div className={styles.editAvartar}>
              <div className={styles.userEditAvatar}>
                <div className={styles.userImageInput}>
                  <img src={selectedImage || fakeAvatar} alt="Avatar" />
                </div>
              </div>
              <div className={styles.inputImgAvatarBtn}>
                {/* Input File Hidden */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatarUpload"
                  onChange={handleImageChange}
                />
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
        {/* </div > */}
      </>
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
                tags={[]}
                onRemove={() => removePost(post.post_id)}
                isTrending={index === 0}
              />
            ))
          : null}
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
        <div className="userProfileBody">
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
                <div className="editUserProfile" ref={profileEditModelRef}>
                  <ButtonIconLeft
                    Icon={FaUserPen}
                    size={20}
                    color="#333"
                    title="Edit Profile"
                    onclick={() => {
                      setProfileEditModel(!profileEditModel);
                    }}
                  />
                  <UserProfileEditForm isOpen={profileEditModel} />
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
