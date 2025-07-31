
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

function UserProfileEditForm({ isOpen, onClose, user_id, profileData }: UserProfileEditFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(profileData?.ava_img_path || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const userNameRef = useRef<InputRef>(null);
  const userEmailRef = useRef<InputRef>(null);
  const userPhoneRef = useRef<InputRef>(null);
  const userAgeRef = useRef<InputRef>(null);
  const firstNameRef = useRef<InputRef>(null);
  const lastNameRef = useRef<InputRef>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile(user_id, {
    onSuccess: () => {
      message.success("Profile updated successfully!");
      onClose();
      setIsSubmitting(false);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update profile!");
      setIsSubmitting(false);
    },
  });
  // console.log("update profile: ", updateProfile);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setShowCropModal(true);
    }
  };

  const handleCropComplete = () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 128,
        height: 128,
      });
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          setSelectedImage(croppedImageUrl);
          setCroppedFile(file);
          setShowCropModal(false);
        }
      }, "image/jpeg");
    }
  };

  const eventClickOpenFile = () => {
    document.getElementById("avatarUpload")?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setCroppedFile(null);
  };

  const handleSubmit = () => {
    const userName = userNameRef.current?.input?.value;
    const email = userEmailRef.current?.input?.value;
    const phoneNum = userPhoneRef.current?.input?.value;
    const age = userAgeRef.current?.input?.value;
    const firstName = firstNameRef.current?.input?.value;
    const lastName = lastNameRef.current?.input?.value;

    // Check required fields
    if (!userName) {
      setError("Username is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (userName.length > 20) {
      setError("Username must be at most 20 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (phoneNum && !/^\d{10,}$/.test(phoneNum)) {
      setError("Invalid phone number");
      return;
    }
    if (age && (parseInt(age) < 13 || parseInt(age) > 100)) {
      setError("Age must be between 13 and 100");
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
        width={550}
        className="rounded-lg"
      >
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
          
          {error && <p className="text-red-500 text-sm mb-6 text-center">{error}</p>}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center justify-center flex-col space-y-4">
              <div className="relative">
                <img
                  src={selectedImage || profileData?.ava_img_path || fakeAvatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex space-x-3">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatarUpload"
                  onChange={handleImageChange}
                />
                <Button
                  onClick={eventClickOpenFile}
                  className="h-10 bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-600 border-none rounded-md"
                >
                  Upload Image
                </Button>
                {(selectedImage || profileData?.ava_img_path) && (
                  <Button
                    onClick={handleRemoveImage}
                    className="h-10 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 border-none rounded-md"
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    error?.includes("Username") ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {error?.includes("Username") ? error : "Username *"}
                </label>
                <Input
                  ref={userNameRef}
                  defaultValue={profileData?.user_name || "unknown"}
                  placeholder="Enter username..."
                  className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${error?.includes("Email") ? "text-red-500" : "text-gray-700"}`}
                >
                  {error?.includes("Email") ? error : "Email *"}
                </label>
                <Input
                  ref={userEmailRef}
                  type="email"
                  defaultValue={profileData?.email || "unknown"}
                  placeholder="Enter email..."
                  className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${error?.includes("First Name") ? "text-red-500" : "text-gray-700"}`}>
                  First Name
                </label>
                <Input
                  ref={firstNameRef}
                  defaultValue={profileData?.first_name || ""}
                  placeholder="Enter first name..."
                  className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${error?.includes("Last Name") ? "text-red-500" : "text-gray-700"}`}>
                  Last Name
                </label>
                <Input
                  ref={lastNameRef}
                  defaultValue={profileData?.last_name || ""}
                  placeholder="Enter last name..."
                  className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${error?.includes("Phone") ? "text-red-500" : "text-gray-700"}`}
                >
                  {error?.includes("Phone") ? "Invalid phone number" : "Phone Number"}
                </label>
                <Input
                  ref={userPhoneRef}
                  defaultValue={profileData?.phone_num || ""}
                  placeholder="Enter phone number..."
                  className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${error?.includes("Age") ? "text-red-500" : "text-gray-700"}`}
                >
                  {error?.includes("Age") ? "Age must be between 13 and 100" : "Age"}
                </label>
                <Input
                  ref={userAgeRef}
                  type="number"
                  defaultValue={profileData?.age || ""}
                  placeholder="Enter age..."
                  className="mt-1 w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={onClose}
                className="h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 border-none rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isSubmitting || isPending}
                className="h-10 bg-blue-500 hover:bg-blue-600 border-none rounded-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Crop Modal */}
      {showCropModal && (
        <Modal
          open={showCropModal}
          onCancel={() => setShowCropModal(false)}
          footer={null}
          centered
          width={500}
          className="rounded-lg"
        >
          <div className="flex flex-col items-center p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adjust Image</h3>
            <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
              <Cropper
                ref={cropperRef}
                src={imageToCrop || ""}
                aspectRatio={1}
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
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={() => setShowCropModal(false)}
                className="h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 border-none rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleCropComplete}
                className="h-10 bg-blue-500 hover:bg-blue-600 border-none rounded-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default UserProfileEditForm;
