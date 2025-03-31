import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaPlus } from 'react-icons/fa';
import BlurText from '../BlurText/BlurText';
import UserProfileButton from '../UserProfileButton/UserProfileButton';
import IconButton from '../RoundButtonIcon/RoundButtonIcon';
import ButtonIconLeft from '../ButtonIconLeft/ButtonIconLeft';
import NotificationElements from '../Notification_Elements/NotificationElements';
import styled from 'styled-components';

import { API_BE } from '../../config/configApi';

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
// Modal components
function NotiModel({ isOpen }: { isOpen: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const fakeAvatar = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";

  //? Calc Times
  const formatTimeAgo = (date: Date): string => {
    const now = Date.now();
    const diffMs = now - date.getTime(); // Khoảng cách thời gian tính bằng mili giây
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays > 1) {
      return `${diffDays} ngày trước`;
    } else if (diffDays === 1) {
      return `1 ngày trước`;
    } else if (diffHours > 1) {
      return `${diffHours} giờ trước`;
    } else if (diffHours === 1) {
      return `1 giờ trước`;
    } else if (diffMinutes > 1) {
      return `${diffMinutes} phút trước`;
    } else if (diffMinutes === 1) {
      return `1 phút trước`;
    } else {
      return `Vừa xong`;
    }
  };
  //? Fetch Noti in Noti model box
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

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <StyleWrapper>
      <div className={isOpen ? `notiModel show` : `notiModel hide`}>
        <div className="NoticationPopUps">
          {isLoading ? (
            <div>Loading notifications...</div>
          ) : error ? (
            <div>{error}</div>
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
            <div>No notifications available</div>
          )}
        </div>
      </div>
    </StyleWrapper>
  );
}

function UserModel({ isOpen }: { isOpen: boolean }) {
  return (
    <StyleWrapper>
      <div className={isOpen ? `userModel show` : `userModel hide`}>
        <div className="userModelContent">
          <div className="userProfile">
            <button className="userBtn">
              <Link to="profile">My Profile</Link>
            </button>
            <div className="span" />
          </div>
        </div>
      </div>
    </StyleWrapper>
  );
}

function SearchModal({ isOpen, users, onClose }: { isOpen: boolean; users: SearchedUser[]; onClose: () => void }) {
  return (
    <StyleWrapper>
      <div className={isOpen ? `searchModal show` : `searchModal hide`}>
        <h3>Search Results</h3>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.user_id}>
                <Link to={`/home/user-detail/${user.user_id}`} onClick={onClose}>
                  {user.user_name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </StyleWrapper>
  );
}

const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";

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

  //? Handle click outside for models
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

  //? Fetch search results
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

  // Handle search submit on Enter
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      fetchSearchResults(searchQuery);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearchModalOpen(false);
    }
  };

  return (
    <StyleWrapper>
      <div className="headerContent">
        <BlurText text="Iter-Forum" />
        <div className="searchForm">
          <input
            type="text"
            autoComplete="off"
            name="text"
            className="inputSearch"
            placeholder="Search something......"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </div>
        <div className="headerSelectionButton">
          <div className="createPostBtn">
            <ButtonIconLeft Icon={FaPlus} size={20} color="#333" title={<Link to="create-post">Create Post</Link>} />
          </div>
          <div className="notificationContainer" ref={notiRef}>
            <IconButton
              Icon={FaBell}
              size={20}
              color="#333"
              onClick={() => setIsNotiOpen(!isNotiModelOpen)}
            />
            <NotiModel isOpen={isNotiModelOpen} />
          </div>
          <div className="userProfileContainer" ref={userRef}>
            <UserProfileButton
              buttonImg={fakeAvatar}
              ImgName="#"
              onClick={() => setIstUserModelOpen(!isUserModel)}
            />
            <UserModel isOpen={isUserModel} />
          </div>
        </div>
      </div>
      {isLoading ? (
        <StyleWrapper>
          <div className="searchModal show">Loading...</div>
        </StyleWrapper>
      ) : error ? (
        <SearchModal isOpen={isSearchModalOpen} users={[]} onClose={() => setIsSearchModalOpen(false)} />
      ) : (
        <SearchModal
          isOpen={isSearchModalOpen}
          users={searchResults}
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}
    </StyleWrapper>
  );
};

export default Header;

// Styled-components
const StyleWrapper = styled.div`
  .headerContent {
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    display: flex;
    line-height: 3.5rem;
    justify-content: space-between;
  }
  .headerSelectionButton {
    display: flex;
    padding-top: 5px;
    gap: 1rem;
    right: 0;
  }
  .inputSearch {
    width: 40rem;
    border: none;
    outline: none;
    border-radius: 15px;
    padding: 1em;
    background-color: #ccc;
    box-shadow: inset 2px 5px 10px rgba(0,0,0,0.3);
    transition: 300ms ease-in-out;
  }
  .inputSearch:focus {
    background-color: white;
    transform: scale(1.05);
    box-shadow: 13px 13px 100px #969696, -13px -13px 100px #ffffff;
  }
  .notificationContainer, .userProfileContainer {
    position: relative;
  }
  .notiModel {
    position: absolute;
    top: 4rem;
    right: -3rem;
    z-index: 100;
    width: 31.5rem;
    height: 16rem;
    border-radius: 30px;
    box-shadow: rgba(0, 0, 0, 0.3) 4px 9px 27px 7px;
    background-color: #ffffff;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none;
  }
  .NoticationPopUps {
    margin-top: 1rem;
    overflow-y: auto;
    width: 32.5rem;
    height: 14.5rem;
  }
  .NoticationPopUps::-webkit-scrollbar {
    height: 2px;
    width: 5px;
  }
  .NoticationPopUps::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .NoticationPopUps::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    height: 2px;
  }
  .NoticationPopUps::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .userModel {
    position: absolute;
    top: 4rem;
    right: 0;
    z-index: 100;
    width: 12rem;
    height: 11rem;
    border-radius: 30px;
    box-shadow: rgba(0, 0, 0, 0.3) 4px 9px 27px 7px;
    background-color: #ffffff;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none;
  }
  .show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  .hide {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }
  .userBtn {
    position: relative;
    left: 0.3rem;
    background-color: #fff;
    border: none;
    width: 11.5rem;
    height: 3rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 0;
    overflow: hidden;
    margin-top: 1rem;
    margin-bottom: 5px;
  }
  .userBtn a {
    color: #333;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    font-size: 1.2rem;
  }
  .userBtn:hover {
    background: 0 0 2px #969696; /* Có thể cần sửa lại nếu đây là lỗi cú pháp */
  }
  .userBtn:active {
    transform: translateY(2px);
  }
  .searchModal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    z-index: 1000;
    box-shadow: rgba(0, 0, 0, 0.3) 4px 9px 27px 7px;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
  }
  .searchModal.hide {
    display: none;
  }
  .searchModal.show {
    display: block;
  }
  .searchModal ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .searchModal li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  .searchModal li a {
    text-decoration: none;
    color: #333;
  }
  .searchModal li:hover {
    background: #f5f5f5;
  }
  .searchModal button {
    margin-top: 10px;
    padding: 5px 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }
  .searchModal button:hover {
    background: #0056b3;
  }
`;