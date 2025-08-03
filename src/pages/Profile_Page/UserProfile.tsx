import { useState } from 'react';
import ButtonIconLeft from '../../components/ButtonIconLeft/ButtonIconLeft';
import { FaUserPen } from 'react-icons/fa6';
import { useGetProfile } from './Hooks/useGetProfile';
import DisplayPostComponent from './Components/DisplayPostComponent';
import { avatar_unknown } from '../../utils/utils';
import LoadingThreeDots from '../../components/Loader/LoadingThreeDots';
import UserProfileEditForm from './Components/UserProfileEditForm';
import { IUpdateProfileResponse } from '../../interface/Users/IUpdateProfile';

// Định nghĩa interface cho dữ liệu profile để bao gồm background_img
interface ProfileData extends IUpdateProfileResponse {
  user_id?: string;
  background_img?: string; // Trường ảnh bìa
}

const UserProfile = () => {
  const [profileEditModel, setProfileEditModel] = useState(false);
  const { data, isLoading, error, isFetching } = useGetProfile();

  const getFullName = (first_name?: string | null, last_name?: string | null, user_name?: string | null) => {
    const fullName = [first_name, last_name].filter((part) => typeof part === 'string' && part.trim() !== '').join(' ').trim();
    if (fullName) return fullName;
    return user_name && typeof user_name === 'string' && user_name.trim() !== '' ? user_name : 'Chưa có tên';
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingThreeDots />
      </div>
    );
  }

  if (error || !data || !data.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">
            {error ? `Lỗi: ${error}` : 'Không tìm thấy thông tin người dùng'}
          </p>
          <p className="text-gray-500">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  const profileData: ProfileData = data.data;

  const transformedProfileData: IUpdateProfileResponse = {
    user_name: profileData.user_name ?? undefined,
    email: profileData.email ?? undefined,
    ava_img_path: profileData.ava_img_path ?? undefined,
    phone_num: profileData.phone_num ?? undefined,
    age: profileData.age ?? undefined,
    first_name: profileData.first_name ?? undefined,
    last_name: profileData.last_name ?? undefined,
  };

  const fullName = getFullName(profileData.first_name, profileData.last_name, profileData.user_name);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          {/* Cover Photo Section */}
          <div className="relative">
            <div className="h-80 overflow-hidden rounded-t-lg">
              <img
                src={profileData.background_img || 'https://via.placeholder.com/1400x320'}
                alt="Ảnh bìa"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Avatar */}
            <div className="absolute -bottom-16 left-8">
              <img
                src={profileData.ava_img_path || avatar_unknown}
                alt={profileData.user_name || 'unknown'}
                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              {/* User Info */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <h1 className="text-4xl font-bold text-gray-800">{fullName}</h1>
                  {fullName !== profileData.user_name && (
                    <p className="text-2xl text-gray-600">({profileData.user_name || 'Chưa có tên'})</p>
                  )}
                </div>
                <p className="text-green-600 text-base mt-2">Trạng thái: Hoạt động</p>
              </div>

              {/* Edit Button */}
              <div className="mt-4 sm:mt-0">
                <ButtonIconLeft
                  Icon={FaUserPen}
                  size={18}
                  color="#1e40af"
                  title="Chỉnh sửa hồ sơ"
                  onclick={() => setProfileEditModel(true)}
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-600 text-base">
                <p>
                  <span className="font-medium">Email:</span> {profileData.email || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Số điện thoại:</span> {profileData.phone_num || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Tuổi:</span> {profileData.age || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Bài viết của tôi</h2>
          </div>
          <div className="p-8">
            <DisplayPostComponent />
          </div>
        </div>

        {/* Modal Overlay */}
        {profileEditModel && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setProfileEditModel(false)}
          ></div>
        )}

        {/* Edit Form Modal */}
        <UserProfileEditForm
          isOpen={profileEditModel}
          onClose={() => setProfileEditModel(false)}
          user_id={profileData.user_id || ''}
          profileData={transformedProfileData}
        />
      </div>
    </div>
  );
};

export default UserProfile;