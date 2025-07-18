import { useEffect, useRef, useState } from "react";
import authorizedAxiosInstance from "../../../services/Auth";
import { API_BE } from "../../../config/configApi";
import axios from "axios";
import IconButton from "../../../components/RoundButtonIcon/RoundButtonIcon";
import ButtonTextComponent from "../../../components/ButtonTextOnly/ButtonText";
import { fakeAvatar } from "../../../utils/utils";
import { FaXmark } from "react-icons/fa6";

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
  post_title: string;
  tags: string[];
  date_updated: string;
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


  function UserProfileEditForm({
    isOpen,
    onClose,
    // setFetchUser,
  }: {
    isOpen: boolean;
    onClose: () => void;
    // setFetchUser: React.Dispatch<React.SetStateAction<UserDetail | null>>;
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
          console.log("Fetched user data:", userData);

          if (userNameRef.current && !userNameRef.current.value) userNameRef.current.value = userData.user_name || "";
          if (userEmailRef.current && !userEmailRef.current.value) userEmailRef.current.value = userData.email || "";
          if (userPhoneRef.current && !userPhoneRef.current.value) userPhoneRef.current.value = userData.phone_num || "";
          if (userAgeRef.current && !userAgeRef.current.value) userAgeRef.current.value = userData.age || "";
          if (userData.ava_img_path) setSelectedImage(userData.ava_img_path);
        } catch (error) {
          console.error("Fetch failed:", error);
          setError("Không thể tải thông tin hồ sơ");
        }
      };

      fetchProfile();
    }, [isOpen, accessToken]);

    //? Update profile
    useEffect(() => {
      const updateProfile = async () => {
        if (!isSubmitting || !accessToken) return;

        try {
          const userName = userNameRef.current?.value || "";
          const email = userEmailRef.current?.value || "";
          const phoneNum = userPhoneRef.current?.value || "";
          const age = userAgeRef.current?.value ? parseInt(userAgeRef.current.value) : undefined;

          // Validation
          if (userName && userName.length > 20) {
            setError("Tên người dùng tối đa 20 ký tự");
            return;
          }
          if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            setError("Email không hợp lệ");
            return;
          }
          if (phoneNum && !/^\d{10}$/.test(phoneNum)) {
            setError("Số điện thoại không hợp lệ");
            return;
          }
          if (age && (age < 13 || age > 100)) {
            setError("Tuổi phải từ 13 đến 100");
            return;
          }

          const response = await authorizedAxiosInstance.get<ProfileResponse>(
            `${API_BE}/api/v1/users/profile`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const userData = response.data.data;

          const profileData: UserProfile = {
            user_name: userName || userData.user_name || "",
            email: email || userData.email || "",
            ava_img_path: selectedImage !== null ? selectedImage : userData.ava_img_path,
            phone_num: phoneNum || userData.phone_num || "",
            age: age !== undefined ? age : userData.age ? parseInt(userData.age) : undefined,
          };

          console.log("Sending PUT request with data:", profileData);

          const updateResponse = await authorizedAxiosInstance.put(
            `${API_BE}/api/v1/users/profile/${userData.user_id}`,
            profileData,
            { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
          );

          console.log("Profile updated successfully:", updateResponse.data);
          alert("Cập nhật hồ sơ thành công!");
          setError(null);
          setFetchUser(updateResponse.data.data);
          onClose();
        } catch (error) {
          console.error("Request failed:", error);
          if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || "Không thể xử lý yêu cầu");
            console.log("Error response:", error.response);
          } else {
            setError("Đã xảy ra lỗi không mong muốn");
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
        setError("Vui lòng đăng nhập trước");
        return;
      }
      setIsSubmitting(true);
    };

    if (!isOpen) return null;

    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Chỉnh sửa hồ sơ</h2>
            <IconButton
              Icon={FaXmark}
              size={20}
              color="#4b5563"
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-6 text-center">{error}</p>}
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${error?.includes("User name") ? "text-red-500" : "text-gray-700"}`}>
                {error?.includes("User name") ? "Tên người dùng tối đa 20 ký tự" : "Tên người dùng"}
              </label>
              <input
                ref={userNameRef}
                type="text"
                placeholder="Nhập tên người dùng..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${error?.includes("Email") ? "text-red-500" : "text-gray-700"}`}>
                {error?.includes("Email") ? "Email không hợp lệ" : "Email"}
              </label>
              <input
                ref={userEmailRef}
                type="email"
                placeholder="Nhập email..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${error?.includes("Phone") ? "text-red-500" : "text-gray-700"}`}>
                {error?.includes("Phone") ? "Số điện thoại không hợp lệ" : "Số điện thoại"}
              </label>
              <input
                ref={userPhoneRef}
                type="text"
                placeholder="Nhập số điện thoại..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${error?.includes("Age") ? "text-red-500" : "text-gray-700"}`}>
                {error?.includes("Age") ? "Tuổi phải từ 13 đến 100" : "Tuổi"}
              </label>
              <input
                ref={userAgeRef}
                type="number"
                placeholder="Nhập tuổi..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={selectedImage || fakeAvatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border border-gray-200"
              />
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatarUpload"
                  onChange={handleImageChange}
                />
                <ButtonTextComponent
                  $backgroundColor="#e5e7eb"
                  $hoverBackgroundColor="#bfdbfe"
                  $hoverColor="#1e40af"
                  title="Tải ảnh lên"
                  onClick={eventClickOpenFile}
                  className="rounded-md px-4 py-2 text-sm font-medium"
                />
                {selectedImage && (
                  <ButtonTextComponent
                    $backgroundColor="#e5e7eb"
                    $hoverBackgroundColor="#fecaca"
                    $hoverColor="#b91c1c"
                    title="Xóa ảnh"
                    onClick={handleRemoveImage}
                    className="rounded-md px-4 py-2 text-sm font-medium"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <ButtonTextComponent
                $backgroundColor="#e5e7eb"
                $hoverBackgroundColor="#bfdbfe"
                $hoverColor="#1e40af"
                title="Xác nhận"
                $width="8rem"
                onClick={handleSubmit}
                className="rounded-md px-4 py-2 text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default UserProfileEditForm;