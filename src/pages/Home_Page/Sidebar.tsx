import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button, Spin, Typography, Empty } from 'antd';
import {
  HomeOutlined,
  FireOutlined,
  CompassOutlined,
  InfoCircleOutlined,
  SafetyOutlined,
  LockOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useGetSubscribedTags } from './Hooks/useGetTag';


interface SidebarProps {
  onSignOutClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const { data, isLoading, error } = useGetSubscribedTags();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const tagItems = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return [
      ...(showAllTags ? data : data.slice(0, 3)).map((tag) => ({
        key: `tag-${tag.tag_id}`,
        label: (
          <Link to={`/home/tag/${tag.tag_id}`}>
            {tag.tag_title} ({tag.post_count})
          </Link>
        ),
      })),
      ...(data.length > 3
        ? [
          {
            key: 'toggle-tags',
            label: (
              <Button
                type="text"
                icon={showAllTags ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setShowAllTags(!showAllTags)}
                className="w-full text-left text-gray-600 hover:text-blue-500 text-sm md:text-xs"
              >
                {showAllTags ? 'Thu gọn' : 'Xem tất cả'}
              </Button>
            ),
          },
        ]
        : []),
    ];
  }, [data, showAllTags]);

  return (
    <aside className="fixed left-0 top-0 h-full w-48 bg-white shadow-md overflow-y-auto font-lexend mt-16 xl:w-64 lg:w-56 md:w-48">
      <div className="h-16" />
      <Menu
        mode="vertical"
        defaultSelectedKeys={['home']}
        className="border-none"
        items={[
          {
            key: 'home',
            icon: <HomeOutlined className="text-gray-600 text-base md:text-sm" />,
            label: <Link to="/home" onClick={scrollToTop}>Trang chủ</Link>,
          },
          {
            key: 'popular',
            icon: <FireOutlined className="text-gray-600 text-base md:text-sm" />,
            label: <Link to="/home/popular" onClick={scrollToTop}>Phổ biến</Link>,
          },
          {
            key: 'explore',
            icon: <CompassOutlined className="text-gray-600 text-base md:text-sm" />,
            label: <Link to="/home/explore" onClick={scrollToTop}>Khám phá</Link>,
          },
        ]}
      />

      <div className="px-3 py-3 xl:px-4 xl:py-4">
        <Typography.Text strong className="text-xs text-gray-500 uppercase tracking-wide md:text-[0.65rem]">
          TAG ĐÃ THEO DÕI
        </Typography.Text>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
            <Typography.Text className="mt-2 text-gray-600 text-sm">Đang tải tag...</Typography.Text>
          </div>
        ) : error ? (
          <Typography.Text className="text-red-500 text-center block py-4 text-sm">
            Lỗi: 'Không thể tải tag'
          </Typography.Text>
        ) : tagItems.length > 0 ? (
          <Menu mode="vertical" className="border-none mt-2" items={tagItems} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có tag nào được theo dõi"
            className="mt-3"
          />
        )}
      </div>

      <div className="px-3 py-3 xl:px-4 xl:py-4">
        <Typography.Text strong className="text-xs text-gray-500 uppercase tracking-wide md:text-[0.65rem]">
          VỀ CHÚNG TÔI
        </Typography.Text>
        <Menu
          mode="vertical"
          className="border-none mt-2"
          items={[
            {
              key: 'about',
              icon: <InfoCircleOutlined className="text-gray-600 text-base md:text-sm" />,
              label: <Link to="/about">Giới thiệu</Link>,
            },
            {
              key: 'rules',
              icon: <SafetyOutlined className="text-gray-600 text-base md:text-sm" />,
              label: <Link to="/rules">Quy tắc</Link>,
            },
            {
              key: 'privacy',
              icon: <LockOutlined className="text-gray-600 text-base md:text-sm" />,
              label: <Link to="/privacy-policy">Chính sách bảo mật</Link>,
            },
            {
              key: 'agreement',
              icon: <FileTextOutlined className="text-gray-600 text-base md:text-sm" />,
              label: <Link to="/user-agreement">Thỏa thuận người dùng</Link>,
            },
          ]}
        />
      </div>
    </aside>
  );
};

export default Sidebar;