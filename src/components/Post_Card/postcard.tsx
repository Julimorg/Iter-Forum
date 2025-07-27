import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Divider, Tag, Typography, message } from 'antd';
import { LikeOutlined, DislikeOutlined, CommentOutlined } from '@ant-design/icons';
import TagPost from '../../components/Tag_Post/Tag_post';
import ReportPopup from '../Report_Popup/Report_popup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { formatRelativeTime } from '../../utils/utils';
import { useSocket } from '../../hook/useSocket';
import { useAuthStore } from '../../hook/useAuthStore';
import { usePostInteractionStore } from '../../hook/usePostInteractionStore';

interface PostcardProps {
  post_id: string;
  user: string;
  user_id: string;
  title: string;
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  tags?: string[];
  isTrending?: boolean;
  onRemove?: () => void;
  images?: string[] | null;
  avatar?: string | null;
  date_updated?: string | null;
}

const { Text, Title } = Typography;

const Postcard: React.FC<PostcardProps> = ({
  post_id,
  user,
  user_id,
  title,
  caption,
  likes,
  dislikes,
  comments,
  tags,
  isTrending,
  images = [],
  avatar,
  date_updated,
}) => {
  const { user_id: userId } = useAuthStore();
  const { setInteraction, getInteraction } = usePostInteractionStore();
  const {
    isConnected,
    currentLikes,
    currentDislikes,
    liked,
    disliked,
    setCurrentLikes,
    setCurrentDislikes,
    emitInteraction,
    error,
  } = useSocket(post_id, likes, dislikes);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [imageCount, setImageCount] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [initialLikes, setInitialLikes] = useState<number>(likes);
  const [initialDislikes, setInitialDislikes] = useState<number>(dislikes);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      message.error(error, 3);
      console.log(setInitialLikes);
      console.log(setInitialDislikes)
    }
  }, [error]);

  useEffect(() => {
    const count = Array.isArray(images) ? images.length : 0;
    setImageCount(count);
    setImageErrors(new Array(count).fill(false));
  }, [images]);

  useEffect(() => {
    // Khởi tạo trạng thái ban đầu từ usePostInteractionStore
    const interaction = getInteraction(post_id);
    if (interaction) {
      setCurrentLikes(interaction.liked ? likes + 1 : likes);
      setCurrentDislikes(interaction.disliked ? dislikes + 1 : dislikes);
    }
  }, [post_id, likes, dislikes, getInteraction, setCurrentLikes, setCurrentDislikes]);

  const togglePopup = () => setPopupVisible(!popupVisible);

  const handleLike = () => {
    if (!userId) {
      message.warning('Vui lòng đăng nhập để tương tác', 3);
      return;
    }

    const newLiked = !liked;
    const newDisliked = false; // Chỉ cho phép chọn một trạng thái

    // Optimistic update
    setInteraction(post_id, newLiked, newDisliked);

    // Cập nhật UI và số lượng
    if (initialLikes === 0 && initialDislikes === 0) {
      // Case 1: likes = 0, dislikes = 0
      if (newLiked) {
        setCurrentLikes(currentLikes + 1); // Like +1
        setCurrentDislikes(0); // Dislike giữ nguyên 0
      } else {
        setCurrentLikes(0); // Like trở về 0
        setCurrentDislikes(0); // Dislike giữ nguyên 0
      }
    } else {
      // Case 2: likes > 1, dislikes > 1
      if (newLiked) {
        setCurrentLikes(currentLikes + 1); // Like +1
        if (disliked) {
          setCurrentDislikes(initialDislikes); // Dislike trở về giá trị ban đầu
        }
      } else {
        setCurrentLikes(initialLikes); // Like trở về giá trị ban đầu
        setCurrentDislikes(initialDislikes); // Dislike giữ nguyên hoặc về giá trị ban đầu
      }
    }

    if (isConnected) {
      emitInteraction({
        post_id,
        user_post_id: userId,
        is_upvote: true,
        upvote: newLiked ? currentLikes + 1 : initialLikes,
        downvote: newDisliked ? currentDislikes : disliked ? initialDislikes : currentDislikes,
      });
    } else {
      message.warning('Đang chờ kết nối, tương tác sẽ được đồng bộ sau', 3);
    }
  };

  const handleDislike = () => {
    if (!userId) {
      message.warning('Vui lòng đăng nhập để tương tác', 3);
      return;
    }

    const newDisliked = !disliked;
    const newLiked = false; // Chỉ cho phép chọn một trạng thái

    // Optimistic update
    setInteraction(post_id, newLiked, newDisliked);

    // Cập nhật UI và số lượng
    if (initialLikes === 0 && initialDislikes === 0) {
      // Case 1: likes = 0, dislikes = 0
      if (newDisliked) {
        setCurrentDislikes(currentDislikes + 1); // Dislike +1
        setCurrentLikes(0); // Like giữ nguyên 0
      } else {
        setCurrentDislikes(0); // Dislike trở về 0
        setCurrentLikes(0); // Like giữ nguyên 0
      }
    } else {
      // Case 2: likes > 1, dislikes > 1
      if (newDisliked) {
        setCurrentDislikes(currentDislikes + 1); // Dislike +1
        if (liked) {
          setCurrentLikes(initialLikes); // Like trở về giá trị ban đầu
        }
      } else {
        setCurrentDislikes(initialDislikes); // Dislike trở về giá trị ban đầu
        setCurrentLikes(initialLikes); // Like giữ nguyên hoặc về giá trị ban đầu
      }
    }

    if (isConnected) {
      emitInteraction({
        post_id,
        user_post_id: userId,
        is_upvote: false,
        upvote: newLiked ? currentLikes : liked ? initialLikes : currentLikes,
        downvote: newDisliked ? currentDislikes + 1 : initialDislikes,
      });
    } else {
      message.warning('Đang chờ kết nối, tương tác sẽ được đồng bộ sau', 3);
    }
  };

  const handlePostNavigation = () => {
    navigate(`/home/post-detail/${post_id}`);
  };

  const handleUserNavigation = () => {
    navigate(`/home/user-detail/${user_id}`);
  };

  const safeImages = Array.isArray(images) ? images : [];

  const handleImageError =
    (index: number) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error('Error loading image:', e.currentTarget.src);
      setImageErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = true;
        return newErrors;
      });
    };

  return (
    <Card
      className="w-full max-w-[100vw] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[60vw] xl:max-w-[60vw] mb-2 sm:mb-3 md:mb-4 xl:mb-5 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl"
      bodyStyle={{ padding: '0.75rem sm:1rem md:1.25rem xl:1.5rem' }}
    >
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar
            src={avatar}
            className="w-8 h-8 sm:w-10 sm:h-10"
            style={{ backgroundColor: avatar ? 'transparent' : '#e2e8f0' }}
          />
          <div>
            <Text
              strong
              className="cursor-pointer hover:text-blue-600 transition-colors duration-200 text-xs sm:text-sm md:text-base xl:text-lg"
              onClick={handleUserNavigation}
            >
              {user}
            </Text>
            <Text type="secondary" className="block text-[0.625rem] sm:text-xs md:text-sm text-gray-500">
              {formatRelativeTime(date_updated ?? '')}
            </Text>
          </div>
        </div>
        <div className="relative">
          <Button
            type="text"
            icon={<span className="text-base sm:text-lg md:text-xl text-gray-600">⋮</span>}
            onClick={togglePopup}
            className="hover:bg-gray-100 rounded-full"
          />
          {popupVisible && (
            <div ref={popupRef} className="absolute right-0 z-10 mt-2">
              <ReportPopup type="Post" user_id={user_id} post_id={post_id} />
            </div>
          )}
        </div>
      </div>

      <Title
        level={4}
        className="mb-1 cursor-pointer hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base md:text-lg xl:text-xl font-semibold"
        onClick={handlePostNavigation}
      >
        {title}
      </Title>
      <Text
        className="mb-1.5 cursor-pointer text-xs sm:text-sm md:text-base xl:text-lg text-gray-700 leading-relaxed"
        onClick={handlePostNavigation}
      >
        {caption}
      </Text>

      <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3">
        {tags && tags.map((tag, index) => <TagPost key={index} tag={tag} />)}
        {isTrending && (
          <Tag
            color="orange"
            className="flex items-center text-[0.625rem] sm:text-xs md:text-sm font-medium bg-orange-100 text-orange-600"
          >
            <span className="mr-1">🔥</span> Trending
          </Tag>
        )}
      </div>

      {imageCount > 0 && (
        <Text type="secondary" className="mb-1 block text-[0.625rem] sm:text-xs md:text-sm text-gray-500">
          {imageCount} hình ảnh
        </Text>
      )}

      {safeImages.length > 0 &&
        (safeImages.length > 1 ? (
          <div className="mb-1.5 sm:mb-2 md:mb-3">
            <Swiper
              modules={[Navigation, Pagination, EffectFade, Autoplay]}
              spaceBetween={4}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              effect="fade"
              autoplay={{ delay: 3000, disableOnInteraction: true }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              {safeImages.map((image, index) => (
                <SwiperSlide key={index} className="flex justify-center items-center">
                  {imageErrors[index] ? (
                    <div className="w-full h-24 sm:h-32 md:h-40 xl:h-48 bg-gray-100 flex justify-center items-center text-gray-500 rounded-lg text-[0.625rem] sm:text-xs md:text-sm">
                      Hình ảnh không tải được
                    </div>
                  ) : (
                    <img
                      src={image}
                      alt={`Hình ảnh bài viết ${index + 1}`}
                      className="w-full h-24 sm:h-32 md:h-40 xl:h-48 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={handlePostNavigation}
                      onError={handleImageError(index)}
                      loading="lazy"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : imageErrors[0] ? (
          <div className="w-full h-24 sm:h-32 md:h-40 xl:h-48 bg-gray-100 flex justify-center items-center text-gray-500 rounded-lg mb-1.5 sm:mb-2 md:mb-3 text-[0.625rem] sm:text-xs md:text-sm">
            Hình ảnh không tải được
          </div>
        ) : (
          <img
            src={safeImages[0]}
            alt="Hình ảnh bài viết"
            className="w-full h-24 sm:h-32 md:h-40 xl:h-48 object-cover rounded-lg mb-1.5 sm:mb-2 md:mb-3 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={handlePostNavigation}
            onError={handleImageError(0)}
            loading="lazy"
          />
        ))}

      <Divider className="my-1 sm:my-1.5 md:my-2 border-gray-200" />
      <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
        <Button
          type="text"
          onClick={handleLike}
          disabled={!userId}
          className={`flex items-center gap-1 text-[0.625rem] sm:text-xs md:text-sm transition-colors duration-200 ${liked ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100'} rounded-md px-2 sm:px-3 py-1`}
        >
          <LikeOutlined className={`text-base sm:text-lg md:text-xl ${liked ? 'text-blue-600' : ''}`} />
          {currentLikes}
        </Button>
        <Button
          type="text"
          onClick={handleDislike}
          disabled={!userId}
          className={`flex items-center gap-1 text-[0.625rem] sm:text-xs md:text-sm transition-colors duration-200 ${disliked ? 'text-red-600 bg-red-100' : 'text-gray-600 hover:bg-gray-100'} rounded-md px-2 sm:px-3 py-1`}
        >
          <DislikeOutlined className={`text-base sm:text-lg md:text-xl ${disliked ? 'text-red-600' : ''}`} />
          {currentDislikes}
        </Button>
        <Button
          type="text"
          onClick={handlePostNavigation}
          className="flex items-center gap-1 text-[0.625rem] sm:text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-md px-2 sm:px-3 py-1 transition-colors duration-200"
        >
          <CommentOutlined className="text-base sm:text-lg md:text-xl" />
          {comments}
        </Button>
      </div>
    </Card>
  );
};

export default Postcard;