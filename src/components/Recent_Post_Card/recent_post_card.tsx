import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Divider, Typography } from 'antd';

const { Text } = Typography;

interface RecentPostProps {
  user: string;
  user_id: string;
  post_id: string;
  title: string;
  comments: number;
  image?: string;
  likes: number;
  dislikes: number;
  tags: string[];
  images?: string[] | null;
  isTrending?: boolean;
  date_updated: string;
}

const RecentPost: React.FC<RecentPostProps> = ({
  user,
  user_id,
  post_id,
  title,
  comments,
  image,
  images = [],
  date_updated,
}) => {
  const navigate = useNavigate();

  const handlePostNavigation = () => {
    navigate(`/home/post-detail/${post_id}`);
  };

  const handleUserNavigation = () => {
    navigate(`/home/user-detail/${user_id}`);
  };

  const formatRelativeTime = (date: string): string => {
    const now = new Date();
    const updatedDate = new Date(date);
    const diffInMs = now.getTime() - updatedDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 1) return `${diffInSeconds} giây trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes} phút trước`;
    const days = Math.floor(hours / 24);
    if (days < 1) return `${hours} giờ trước`;
    const weeks = Math.floor(days / 7);
    if (weeks < 1) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    if (months < 1) return `${weeks} tuần trước`;
    const years = Math.floor(months / 12);
    if (years < 1) return `${months} tháng trước`;
    return `${years} năm trước`;
  };

  const safeImages = Array.isArray(images) ? images : [];
  const additionalImages = safeImages.length > 1 ? safeImages.length - 1 : 0;

  return (
    <>
      <div
        className="flex flex-row justify-between items-center p-2 bg-white rounded-lg gap-2 cursor-pointer hover:bg-gray-100 transition-colors duration-300 md:p-3 md:gap-3 xl:p-4 xl:gap-4 "
        onClick={handlePostNavigation}
      >
        <div className="flex-1 flex flex-col gap-1 md:gap-1.5 xl:gap-2 min-w-0">
          <div className="flex items-center gap-2 md:gap-3">
            <Avatar
              size={{ xs: 28, md: 32, xl: 36 }}
              style={{ backgroundColor: '#ccc', flexShrink: 0 }}
            />
            <div className="min-w-0">
              <Text
                strong
                className="text-xs truncate hover:underline md:text-sm xl:text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserNavigation();
                }}
              >
                {user}
              </Text>
              <Text type="secondary" className="block text-[0.65rem] md:text-xs xl:text-sm">
                {formatRelativeTime(date_updated)}
              </Text>
            </div>
          </div>
          <Text className="text-xs text-gray-600 truncate md:text-sm xl:text-base">{title}</Text>
          <Text className="text-[0.65rem] text-gray-600 md:text-xs xl:text-sm">{comments} bình luận</Text>
        </div>
        {image && (
          <div className="relative w-16 h-14 flex-shrink-0 md:w-20 md:h-16 xl:w-24 xl:h-20">
            <div
              className="w-full h-full bg-cover bg-center rounded-lg"
              style={{ backgroundImage: image ? `url(${image})` : 'none', backgroundColor: !image ? '#ddd' : 'transparent' }}
            />
            {additionalImages > 0 && (
              <div className="absolute bottom-0.5 right-0.5 bg-white/90 border border-gray-300 rounded px-1 py-0.5 text-[0.65rem] font-bold text-gray-800 md:text-xs xl:text-sm">
                +{additionalImages}
              </div>
            )}
          </div>
        )}
      </div>
      <Divider className="my-1.5 md:my-2 xl:my-3" />
    </>
  );
};

export default RecentPost;