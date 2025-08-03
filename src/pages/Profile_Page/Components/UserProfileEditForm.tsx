import { useRef, useState } from "react";
import { Modal, Button, Input, message } from "antd";
import { InputRef } from "antd";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { fakeAvatar } from "../../../utils/utils";
import { IUpdateProfile, IUpdateProfileResponse } from "../../../interface/Users/IUpdateProfile";
import { useUpdateProfile } from "../Hooks/useEditProfile";

interface UserProfileEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  user_id: string;
  profileData: IUpdateProfileResponse | null;
}

//TODO: Nên Fetch Thông tin rồi mới edit vì truyền data thông qua props làm phần hiện bị chậm vận tải
//TODO: Làm thêm việc xóa img và quay về default

function UserProfileEditForm({ isOpen, onClose, user_id, profileData }: UserProfileEditFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(profileData?.ava_img_path || null);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState<string | null>(
    profileData?.background_img || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCropModal, setShowCropModal] = useState<"avatar" | "background" | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [croppedBackgroundFile, setCroppedBackgroundFile] = useState<File | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const userNameRef = useRef<InputRef>(null);
  const userEmailRef = useRef<InputRef>(null);
  const userPhoneRef = useRef<InputRef>(null);
  const userAgeRef = useRef<InputRef>(null);
  const firstNameRef = useRef<InputRef>(null);
  const lastNameRef = useRef<InputRef>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile(user_id, {
    onSuccess: () => {
      message.success("Hồ sơ đã được cập nhật thành công!");
      onClose();
      setIsSubmitting(false);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Cập nhật hồ sơ thất bại!");
      setIsSubmitting(false);
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "background") => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setShowCropModal(type);
    }
  };

  const handleCropComplete = () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: showCropModal === "avatar" ? 128 : 800,
        height: showCropModal === "avatar" ? 128 : 200,
      });
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          const file = new File([blob], showCropModal === "avatar" ? "avatar.jpg" : "background.jpg", {
            type: "image/jpeg",
          });
          if (showCropModal === "avatar") {
            setSelectedImage(croppedImageUrl);
            setCroppedFile(file);
          } else {
            setSelectedBackgroundImage(croppedImageUrl);
            setCroppedBackgroundFile(file);
          }
          setShowCropModal(null);
        }
      }, "image/jpeg");
    }
  };

  const eventClickOpenFile = (type: "avatar" | "background") => {
    document.getElementById(type === "avatar" ? "avatarUpload" : "backgroundUpload")?.click();
  };

  const handleRemoveImage = (type: "avatar" | "background") => {
    if (type === "avatar") {
      setSelectedImage(null);
      setCroppedFile(null);
    } else {
      setSelectedBackgroundImage(null);
      setCroppedBackgroundFile(null);
    }
  };

  const handleSubmit = () => {
    const userName = userNameRef.current?.input?.value;
    const email = userEmailRef.current?.input?.value;
    const phoneNum = userPhoneRef.current?.input?.value;
    const age = userAgeRef.current?.input?.value;
    const firstName = firstNameRef.current?.input?.value;
    const lastName = lastNameRef.current?.input?.value;

    // Kiểm tra các trường bắt buộc
    if (!userName) {
      setError("Tên người dùng là bắt buộc");
      return;
    }
    if (!email) {
      setError("Email là bắt buộc");
      return;
    }
    if (userName.length > 20) {
      setError("Tên người dùng tối đa 20 ký tự");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Định dạng email không hợp lệ");
      return;
    }
    if (phoneNum && !/^\d{10,}$/.test(phoneNum)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }
    if (age && (parseInt(age) < 13 || parseInt(age) > 100)) {
      setError("Tuổi phải từ 13 đến 100");
      return;
    }

    const body: IUpdateProfile = {
      user_name: userName,
      email,
      phone_num: phoneNum || undefined,
      age: age ? parseInt(age) : undefined,
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      avatar: croppedFile || null,
      background_img: croppedBackgroundFile || null,
    };

    setIsSubmitting(true);
    updateProfile(body);
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={600}
        title={<h2 className="text-2xl font-semibold text-gray-800">Chỉnh sửa Hồ sơ</h2>}
      >
        <div className="space-y-6">
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</p>
          )}

          {/* Phần Ảnh bìa */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Ảnh bìa</label>
            <div className="border rounded-md overflow-hidden">
              <img
                src={selectedBackgroundImage || profileData?.background_img || fakeAvatar}
                alt="Background"
                className="w-full h-32 object-cover"
              />
            </div>
            <div className="flex space-x-3">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="backgroundUpload"
                onChange={(e) => handleImageChange(e, "background")}
              />
              <Button
                onClick={() => eventClickOpenFile("background")}
                className="h-10 bg-gray-100 text-gray-700"
              >
                Tải lên ảnh bìa
              </Button>
              {(selectedBackgroundImage || profileData?.background_img) && (
                <Button
                  onClick={() => handleRemoveImage("background")}
                  className="h-10 bg-red-100 text-red-600"
                >
                  Xóa ảnh bìa
                </Button>
              )}
            </div>
          </div>

          {/* Phần Ảnh đại diện */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
            <div className="border rounded-full overflow-hidden w-32 h-32 mx-auto">
              <img
                src={selectedImage || profileData?.ava_img_path || fakeAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center space-x-3">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="avatarUpload"
                onChange={(e) => handleImageChange(e, "avatar")}
              />
              <Button
                onClick={() => eventClickOpenFile("avatar")}
                className="h-10 bg-gray-100 text-gray-700"
              >
                Tải lên ảnh đại diện
              </Button>
              {(selectedImage || profileData?.ava_img_path) && (
                <Button
                  onClick={() => handleRemoveImage("avatar")}
                  className="h-10 bg-red-100 text-red-600"
                >
                  Xóa ảnh đại diện
                </Button>
              )}
            </div>
          </div>

          {/* Các trường nhập liệu */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  error?.includes("Tên người dùng") ? "text-red-500" : "text-gray-700"
                }`}
              >
                {error?.includes("Tên người dùng") ? error : "Tên người dùng *"}
              </label>
              <Input
                ref={userNameRef}
                defaultValue={profileData?.user_name || "unknown"}
                placeholder="Nhập tên người dùng..."
                className="h-10"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  error?.includes("Email") ? "text-red-500" : "text-gray-700"
                }`}
              >
                {error?.includes("Email") ? error : "Email *"}
              </label>
              <Input
                ref={userEmailRef}
                type="email"
                defaultValue={profileData?.email || "unknown"}
                placeholder="Nhập email..."
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Họ</label>
              <Input
                ref={firstNameRef}
                defaultValue={profileData?.first_name || ""}
                placeholder="Nhập họ..."
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Tên</label>
              <Input
                ref={lastNameRef}
                defaultValue={profileData?.last_name || ""}
                placeholder="Nhập tên..."
                className="h-10"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  error?.includes("Số điện thoại") ? "text-red-500" : "text-gray-700"
                }`}
              >
                {error?.includes("Số điện thoại") ? "Số điện thoại không hợp lệ" : "Số điện thoại"}
              </label>
              <Input
                ref={userPhoneRef}
                defaultValue={profileData?.phone_num || ""}
                placeholder="Nhập số điện thoại..."
                className="h-10"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  error?.includes("Tuổi") ? "text-red-500" : "text-gray-700"
                }`}
              >
                {error?.includes("Tuổi") ? "Tuổi phải từ 13 đến 100" : "Tuổi"}
              </label>
              <Input
                ref={userAgeRef}
                type="number"
                defaultValue={profileData?.age || ""}
                placeholder="Nhập tuổi..."
                className="h-10"
              />
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="flex justify-end space-x-3">
            <Button onClick={onClose} className="h-10 bg-gray-100 text-gray-700">
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting || isPending}
              className="h-10"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Cắt Ảnh */}
      {showCropModal && (
        <Modal
          open={showCropModal !== null}
          onCancel={() => setShowCropModal(null)}
          footer={null}
          centered
          width={500}
          title={
            <h3 className="text-lg font-semibold text-gray-800">
              {showCropModal === "avatar" ? "Chỉnh sửa Ảnh Đại diện" : "Chỉnh sửa Ảnh Bìa"}
            </h3>
          }
        >
          <div className="space-y-4">
            <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
              <Cropper
                ref={cropperRef}
                src={imageToCrop || ""}
                aspectRatio={showCropModal === "avatar" ? 1 : 4}
                guides={true}
                zoomable={true}
                zoomOnTouch={true}
                zoomOnWheel={true}
                cropBoxResizable={true}
                cropBoxMovable={true}
                dragMode="move"
                minCropBoxWidth={100}
                minCropBoxHeight={100}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setShowCropModal(null)} className="h-10 bg-gray-100 text-gray-700">
                Hủy
              </Button>
              <Button type="primary" onClick={handleCropComplete} className="h-10">
                Áp dụng
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default UserProfileEditForm;