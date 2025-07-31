import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../hook/useAuthStore';
import { avatar_unknown } from '../../../utils/utils';
import { useLogOut } from '../../../hook/useLogOut';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useState } from 'react';

import { Typography } from 'antd';
import DevModal from '../../../components/ModalBox/OnDeveloped';
const { Text } = Typography;

function UserModel({ isOpen }: { isOpen: boolean }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const user_name = useAuthStore.getState().user_name;
  const ava_img = useAuthStore.getState().ava_img;
  const refresh_token = useAuthStore.getState().refresh_token;

  const navigate = useNavigate();

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleClose = (): void => {
    setIsModalVisible(false);
  };

  const { mutate, isPending } = useLogOut({
    onSuccess: () => {
      toast.success('LogOut successfully');
      useAuthStore.getState().clearTokens();
      navigate('/login');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký!';
      toast.error(`${errorMessage}`);
      // console.log(err);
    },
  });

  const handleLogOut = async () => {
    mutate({ refresh_token });
    // console.log(refresh_token);
  };
  return (
    <div
      className={`absolute top-14 right-0 z-50 w-64 bg-white rounded-xl shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={ava_img || `${avatar_unknown}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="text-gray-800 font-semibold text-base truncate max-w-[180px]">
              {user_name || 'User Name'}
            </p>
            <p className="text-gray-500 text-xs">Online</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <Link
          to="profile"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          My Profile
        </Link>
        <Text
          onClick={showModal}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Setting
        </Text>
        <button
          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors duration-200"
          onClick={() => handleLogOut()}
        >
          {isPending ? 'please wait...' : ' Log out '}
        </button>
      </div>
      <DevModal visible={isModalVisible} onClose={handleClose} />
    </div>
  );
}

export default UserModel;
