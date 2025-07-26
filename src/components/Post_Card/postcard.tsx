import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Divider, Tag, Typography } from 'antd';
import io, { Socket } from 'socket.io-client';
import dislike from '../../assets/dislike.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import dislikeFilled from '../../assets/dislike_filled.png';
import likeFilled from '../../assets/like_filled.png';
import TagPost from '../../components/Tag_Post/Tag_post';
import Trending from '../../assets/trending.png';
import ReportPopup from '../Report_Popup/Report_popup';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import axiosClient from '../../apis/axiosClient';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { formatRelativeTime } from '../../utils/utils';

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

interface InteractData {
  post_id: string;
  like: number;
  dislike: number;
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
  const [currentLikes, setCurrentLikes] = useState<number>(likes);
  const [currentDislikes, setCurrentDislikes] = useState<number>(dislikes);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [imageCount, setImageCount] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const profileResponse = await axiosClient.get<{ data: { user_id: string } }>(
          'https://it-er-forum.onrender.com/api/v1/users/profile'
        );
        const fetchedUserId = profileResponse.data.data.user_id;
        setUserId(fetchedUserId);

        socketRef.current = io('https://it-er-forum.onrender.com', { transports: ['websocket'] });

        if (fetchedUserId && post_id) {
          socketRef.current.emit('joinRoom', fetchedUserId);
          socketRef.current.emit('joinRoomPost', post_id);
        }

        socketRef.current.on('connect', () => {
          console.log('WebSocket connected in Postcard');
        });

        socketRef.current.on('updateInteractFromServer', (data: InteractData) => {
          if (data.post_id === post_id) {
            setCurrentLikes(data.like);
            setCurrentDislikes(data.dislike);

            const storedState = localStorage.getItem(`post_${post_id}_interaction`);
            if (storedState) {
              const { liked: storedLiked, disliked: storedDisliked } = JSON.parse(storedState);
              setLiked(storedLiked);
              setDisliked(storedDisliked);
            }
          }
        });

        const storedState = localStorage.getItem(`post_${post_id}_interaction`);
        if (storedState) {
          const { liked: storedLiked, disliked: storedDisliked } = JSON.parse(storedState);
          setLiked(storedLiked);
          setDisliked(storedDisliked);
        }
        setCurrentLikes(likes);
        setCurrentDislikes(dislikes);

        return () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } catch (err) {
        console.error('Error initializing WebSocket in Postcard:', err);
      }
    };

    initializeSocket();
  }, [post_id, likes, dislikes]);

  useEffect(() => {
    const count = Array.isArray(images) ? images.length : 0;
    setImageCount(count);
    setImageErrors(new Array(count).fill(false));
  }, [images]);

  const togglePopup = () => setPopupVisible(!popupVisible);

  const handleLike = () => {
    if (!socketRef.current || !post_id || !userId) return;

    const newLiked = !liked;
    const newDisliked = newLiked ? false : disliked;

    socketRef.current.emit('newInteractFromClient', {
      post_id,
      user_post_id: userId,
      is_upvote: true,
      upvote: newLiked ? currentLikes + 1 : currentLikes - 1,
      downvote: newDisliked
        ? currentDislikes + 1
        : disliked
        ? currentDislikes - 1
        : currentDislikes,
    });

    localStorage.setItem(
      `post_${post_id}_interaction`,
      JSON.stringify({ liked: newLiked, disliked: newDisliked })
    );
  };

  const handleDislike = () => {
    if (!socketRef.current || !post_id || !userId) return;

    const newDisliked = !disliked;
    const newLiked = newDisliked ? false : liked;

    socketRef.current.emit('newInteractFromClient', {
      post_id,
      user_post_id: userId,
      is_upvote: false,
      upvote: newLiked ? currentLikes + 1 : liked ? currentLikes - 1 : currentLikes,
      downvote: newDisliked ? currentDislikes + 1 : currentDislikes - 1,
    });

    localStorage.setItem(
      `post_${post_id}_interaction`,
      JSON.stringify({ liked: newLiked, disliked: newDisliked })
    );
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
      className="w-full max-w-[100vw] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[60vw] xl:max-w-[60vw] mb-2 sm:mb-3 md:mb-4 xl:mb-5"
      bodyStyle={{ padding: '0.75rem sm:1rem md:1.25rem xl:1.5rem' }}
    >
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
        <div className="flex items-center">
          <Avatar
            src={avatar}
            className="mr-1 sm:mr-1.5 md:mr-2"
            style={{ backgroundColor: avatar ? 'transparent' : '#ccc' }}
          />
          <div>
            <Text
              strong
              className="cursor-pointer hover:underline text-xs sm:text-sm md:text-base xl:text-lg"
              onClick={handleUserNavigation}
            >
              {user}
            </Text>
            <Text type="secondary" className="block text-[0.625rem] sm:text-xs md:text-sm">
              {formatRelativeTime(date_updated ?? '')}
            </Text>
          </div>
        </div>
        <div className="relative">
          <Button type="text" icon={<span className="text-base sm:text-lg md:text-xl">⋮</span>} onClick={togglePopup} />
          {popupVisible && (
            <div ref={popupRef} className="absolute right-0 z-10">
              <ReportPopup type="Post" user_id={user_id} post_id={post_id} />
            </div>
          )}
        </div>
      </div>

      <Title
        level={4}
        className="mb-1 cursor-pointer hover:underline text-sm sm:text-base md:text-lg xl:text-xl"
        onClick={handlePostNavigation}
      >
        {title}
      </Title>
      <Text className="mb-1.5 cursor-pointer text-xs sm:text-sm md:text-base xl:text-lg" onClick={handlePostNavigation}>
        {caption}
      </Text>

      <div className="flex flex-wrap gap-1 mb-1.5 sm:gap-1.5 sm:mb-2 md:gap-2 md:mb-3">
        {tags && tags.map((tag, index) => <TagPost key={index} tag={tag} />)}
        {isTrending && (
          <Tag color="orange" className="flex items-center text-[0.625rem] sm:text-xs md:text-sm">
            <img src={Trending} alt="Trending" className="w-2 h-2 mr-0.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            Trending
          </Tag>
        )}
      </div>

      {imageCount > 0 && (
        <Text type="secondary" className="mb-1 block text-[0.625rem] sm:text-xs md:text-sm">
          {imageCount} hình ảnh
        </Text>
      )}

      {safeImages.length > 0 &&
        (safeImages.length > 1 ? (
          <div className="mb-1.5 sm:mb-2 md:mb-3">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={4}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className="rounded-lg"
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
                      className="w-full h-auto max-h-24 sm:max-h-32 md:max-h-40 xl:max-h-48 object-cover rounded-lg cursor-pointer"
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
            className="w-full h-auto max-h-24 sm:max-h-32 md:max-h-40 xl:max-h-48 object-cover rounded-lg mb-1.5 sm:mb-2 md:mb-3 cursor-pointer"
            onClick={handlePostNavigation}
            onError={handleImageError(0)}
            loading="lazy"
          />
        ))}

      <Divider className="my-1 sm:my-1.5 md:my-2" />
      <div className="flex gap-1 sm:gap-1.5 md:gap-2 xl:gap-3">
        <Button
          type="text"
          onClick={handleLike}
          icon={<img src={liked ? likeFilled : like} alt="Like" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
          className="text-[0.625rem] sm:text-xs md:text-sm"
        >
          {currentLikes}
        </Button>
        <Button
          type="text"
          onClick={handleDislike}
          icon={<img src={disliked ? dislikeFilled : dislike} alt="Dislike" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
          className="text-[0.625rem] sm:text-xs md:text-sm"
        >
          {currentDislikes}
        </Button>
        <Button
          type="text"
          onClick={handlePostNavigation}
          icon={<img src={comment} alt="Comment" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
          className="text-[0.625rem] sm:text-xs md:text-sm"
        >
          {comments}
        </Button>
      </div>
    </Card>
  );
};

export default Postcard;