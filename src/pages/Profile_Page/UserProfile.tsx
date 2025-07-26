import { useState } from 'react';
import ButtonIconLeft from '../../components/ButtonIconLeft/ButtonIconLeft';
import { FaUserPen } from 'react-icons/fa6';
import { useGetProfile } from './Hooks/useGetProfile';
import DisplayPostComponent from './Components/DisplayPostComponent';
import { fakeAvatar } from '../../utils/utils';
import LoadingThreeDots from '../../components/Loader/LoadingThreeDots';
import UserProfileEditForm from './Components/UserProfileEditForm';
import { IUpdateProfileResponse } from '../../interface/Users/IUpdateProfile';

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
      <div className="flex items-center justify-center h-[30rem]">
        <LoadingThreeDots />
      </div>
    );
  }

  if (error || !data || !data.data) {
    return (
      <p className="text-center text-red-500 py-10 text-lg">
        {error ? `Lỗi: ${error}` : 'Không tìm thấy thông tin người dùng'}
      </p>
    );
  }

  const profileData = data.data;

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
    <div className="container mx-auto px-4 py-8 max-w-10xl">
      <div className="bg-white rounded-lg shadow-sm mb-8">
        {/* Cover Photo Placeholder */}
        <div className="h-56 bg-gray-200 rounded-t-lg relative">
          <img
            src={profileData.ava_img_path || fakeAvatar}
            alt={profileData.user_name || 'unknown'}
            className="w-40 h-40 rounded-full object-cover border-4 border-white absolute -bottom-20 left-8 shadow-md"
          />
        </div>
        <div className="pt-24 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex">
                <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>
                {fullName !== profileData.user_name && (
                  <p className="ml-4 text-3xl text-gray-800">({profileData.user_name || 'Chưa có tên'})</p>
                )}
              </div>
              <p className="text-green-600 text-base mt-2">Trạng thái: Hoạt động</p>
            </div>
            <ButtonIconLeft
              Icon={FaUserPen}
              size={18}
              color="#1e40af"
              title="Chỉnh sửa hồ sơ"
              onclick={() => setProfileEditModel(true)}
            />
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
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
        {profileEditModel && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setProfileEditModel(false)}
          ></div>
        )}
        <UserProfileEditForm
          isOpen={profileEditModel}
          onClose={() => setProfileEditModel(false)}
          user_id={profileData.user_id || ''}
          profileData={transformedProfileData}
        />
      </div>
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Bài viết của tôi</h2>
        <DisplayPostComponent />
      </div>
    </div>
  );
};

export default UserProfile;