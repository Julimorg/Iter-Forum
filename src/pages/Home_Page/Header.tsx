import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaPlus } from 'react-icons/fa';
import NotificationElements from '../../components/Notification_Elements/NotificationElements';
import { API_BE } from '../../config/configApi';
import BlurText from '../../components/BlurText/BlurText';
import ButtonIconLeft from '../../components/ButtonIconLeft/ButtonIconLeft';
import IconButton from '../../components/RoundButtonIcon/RoundButtonIcon';
import UserProfileButton from '../../components/UserProfileButton/UserProfileButton';

interface SearchedUser {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  status: string;
}

interface SearchResponse {
  data: SearchedUser[];
}

interface Notification {
  notification_id: string;
  notification_content: string;
  date_sent: string;
}

interface NotificationResponse {
  is_success: boolean;
  data: {
    notifications: Notification[];
  };
}

const fakeAvatar = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";

function NotiModel({ isOpen }: { isOpen: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatTimeAgo = (date: Date): string => {
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 1) return `${diffDays} ngày trước`;
    if (diffDays === 1) return `1 ngày trước`;
    if (diffHours > 1) return `${diffHours} giờ trước`;
    if (diffHours === 1) return `1 giờ trước`;
    if (diffMinutes > 1) return `${diffMinutes} phút trước`;
    if (diffMinutes === 1) return `1 phút trước`;
    return `Vừa xong`;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Vui lòng đăng nhập để xem thông báo');
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<NotificationResponse>(`${API_BE}/api/v1/recommend/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.is_success) {
          setNotifications(response.data.data.notifications);
        } else {
          setError('Không thể tải thông báo');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Đã xảy ra lỗi khi tải thông báo');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchNotifications();
  }, [isOpen]);

  return (
    <div
      className={`absolute top-14 right-0 z-50 w-80 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {isLoading ? (
          <div className="text-gray-600">Đang tải thông báo...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : notifications.length > 0 ? (
          notifications.map((noti) => {
            const parsedContent = JSON.parse(noti.notification_content);
            const date = new Date(noti.date_sent);
            const timeAgo = formatTimeAgo(date);
            return (
              <NotificationElements
                key={noti.notification_id}
                imgSrc={fakeAvatar}
                title="Thông báo"
                content={parsedContent.content}
                time={timeAgo}
                onClick={() => navigate(`post-detail/${parsedContent.post_id}`)}
              />
            );
          })
        ) : (
          <div className="text-gray-600">Không có thông báo</div>
        )}
      </div>
    </div>
  );
}

function UserModel({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`absolute top-14 right-0 z-50 w-48 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="p-2">
        <Link
          to="profile"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium"
        >
          Hồ sơ của tôi
        </Link>
      </div>
    </div>
  );
}

function SearchModal({ isOpen, users, onClose }: { isOpen: boolean; users: SearchedUser[]; onClose: () => void }) {
  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-80 max-h-96 overflow-y-auto transition-all duration-300 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết quả tìm kiếm</h3>
      {users.length > 0 ? (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.user_id}>
              <Link
                to={`/home/user-detail/${user.user_id}`}
                onClick={onClose}
                className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              >
                {user.user_name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Không tìm thấy người dùng</p>
      )}
      <button
        onClick={onClose}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Đóng
      </button>
    </div>
  );
}

const Header: React.FC = () => {
  const [isNotiModelOpen, setIsNotiOpen] = useState(false);
  const [isUserModel, setIstUserModelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const notiRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setIsNotiOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIstUserModelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSearchResults = async (query: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Vui lòng đăng nhập để tìm kiếm');
      setIsSearchModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<SearchResponse>(
        `${API_BE}/api/v1/users/${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSearchResults(response.data.data);
      setIsSearchModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tìm kiếm người dùng');
      setSearchResults([]);
      setIsSearchModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      fetchSearchResults(searchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearchModalOpen(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
      <BlurText text="Iter-Forum" />
      <div className="flex-1 max-w-xl mx-4">
        <input
          type="text"
          autoComplete="off"
          className="w-full px-4 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 ease-in-out"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
        />
      </div>
      <div className="flex items-center gap-3">
        <ButtonIconLeft Icon={FaPlus} size={20} color="#333" title={<Link to="create-post">Tạo bài viết</Link>} />
        <div ref={notiRef} className="relative">
          <IconButton
            Icon={FaBell}
            size={20}
            color="#333"
            onClick={() => setIsNotiOpen(!isNotiModelOpen)}
          />
          <NotiModel isOpen={isNotiModelOpen} />
        </div>
        <div ref={userRef} className="relative">
          <UserProfileButton
            buttonImg={fakeAvatar}
            ImgName="#"
            onClick={() => setIstUserModelOpen(!isUserModel)}
          />
          <UserModel isOpen={isUserModel} />
        </div>
      </div>
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-80">
          Đang tải...
        </div>
      ) : error ? (
        <SearchModal isOpen={isSearchModalOpen} users={[]} onClose={() => setIsSearchModalOpen(false)} />
      ) : (
        <SearchModal
          isOpen={isSearchModalOpen}
          users={searchResults}
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;