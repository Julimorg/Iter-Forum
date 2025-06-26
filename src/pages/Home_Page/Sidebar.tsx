import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button, Spin } from 'antd';
import {
  HomeOutlined,
  FireOutlined,
  CompassOutlined,
  InfoCircleOutlined,
  SafetyOutlined,
  LockOutlined,
  FileTextOutlined,
  LogoutOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useGetSubscribedTags } from './Hooks/useGetTag';

interface SidebarProps {
  onSignOutClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSignOutClick }) => {
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const { data, isLoading, error } = useGetSubscribedTags();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-md overflow-y-auto font-lexend mt-10">
      <div className="h-12" />
      <Menu mode="vertical" defaultSelectedKeys={['home']} className="border-none">
        <Menu.Item key="home" icon={<HomeOutlined className="text-gray-600" />}>
          <Link to="/home" onClick={scrollToTop}>
            Trang chủ
          </Link>
        </Menu.Item>
        <Menu.Item key="popular" icon={<FireOutlined className="text-gray-600" />}>
          <Link to="/home/popular" onClick={scrollToTop}>
            Phổ biến
          </Link>
        </Menu.Item>
        <Menu.Item key="explore" icon={<CompassOutlined className="text-gray-600" />}>
          <Link to="/home/explore" onClick={scrollToTop}>
            Khám phá
          </Link>
        </Menu.Item>
      </Menu>

      <div className="px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          TAG ĐÃ THEO DÕI
        </h3>
        {isLoading ? (
          <div className="flex justify-center">
            <Spin tip="Đang tải tag..." />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">Lỗi</div>
        ) : (
          <Menu mode="vertical" className="border-none">
            {data?.length ? (
              <>
                {(showAllTags ? data : data.slice(0, 3)).map((tag) => (
                  <Menu.Item key={`tag-${tag.tag_id}`}>
                    <Link to={`/home/tag/${tag.tag_id}`}>
                      {tag.tag_title} ({tag.post_count})
                    </Link>
                  </Menu.Item>
                ))}
                {data.length > 3 && (
                  <Menu.Item key="toggle-tags">
                    <Button
                      type="text"
                      icon={showAllTags ? <UpOutlined /> : <DownOutlined />}
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="w-full text-left text-gray-600"
                    >
                      {showAllTags ? 'Thu gọn' : 'Xem tất cả'}
                    </Button>
                  </Menu.Item>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-center">Chưa theo dõi tag nào</div>
            )}
          </Menu>
        )}
      </div>

      <div className="px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          VỀ CHÚNG TÔI
        </h3>
        <Menu mode="vertical" className="border-none">
          <Menu.Item key="about" icon={<InfoCircleOutlined className="text-gray-600" />}>
            <Link to="/about">Giới thiệu</Link>
          </Menu.Item>
          <Menu.Item key="rules" icon={<SafetyOutlined className="text-gray-600" />}>
            <Link to="/rules">Quy tắc</Link>
          </Menu.Item>
          <Menu.Item key="privacy" icon={<LockOutlined className="text-gray-600" />}>
            <Link to="/privacy-policy">Chính sách bảo mật</Link>
          </Menu.Item>
          <Menu.Item key="agreement" icon={<FileTextOutlined className="text-gray-600" />}>
            <Link to="/user-agreement">Thỏa thuận người dùng</Link>
          </Menu.Item>
        </Menu>
      </div>

      <div className="px-4 py-2">
        <Menu mode="vertical" className="border-none">
          <Menu.Item key="logout" icon={<LogoutOutlined className="text-gray-600" />}>
            <Button
              type="text"
              onClick={onSignOutClick}
              className="w-full text-left text-gray-800"
            >
              Đăng xuất
            </Button>
          </Menu.Item>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;