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

  return (
    <Card className="w-full max-w-6xl mx-auto mb-5 shadow-lg" bodyStyle={{ padding: '16px' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Avatar
            src={avatar}
            size={40}
            className="mr-3"
            style={{ backgroundColor: avatar ? 'transparent' : '#ccc' }}
          />
          <div>
            <Text strong className="cursor-pointer hover:underline" onClick={handleUserNavigation}>
              {user}
            </Text>

            <Text type="secondary" className="block text-xs">
              Time: {formatRelativeTime(date_updated ?? '')}
            </Text>
          </div>
        </div>
        <div className="relative">
          <Button type="text" icon={<span className="text-xl">⋮</span>} onClick={togglePopup} />
          {popupVisible && (
            <div ref={popupRef} className="absolute right-0 z-10">
              <ReportPopup type="Post" user_id={user_id} post_id={post_id} />
            </div>
          )}
        </div>
      </div>

      <Title
        level={4}
        className="mb-2 cursor-pointer hover:underline"
        onClick={handlePostNavigation}
      >
        {title}
      </Title>
      <Text className="mb-4 cursor-pointer" onClick={handlePostNavigation}>
        {caption}
      </Text>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags && tags.map((tag, index) => <TagPost key={index} tag={tag} />)}
        {isTrending && (
          <Tag color="orange" className="flex items-center">
            <img src={Trending} alt="Trending" className="w-4 h-4 mr-1" />
            Trending
          </Tag>
        )}
      </div>

      {imageCount > 0 && (
        <Text type="secondary" className="mb-2 block">
          {imageCount} hình ảnh
        </Text>
      )}

      {safeImages.length > 0 &&
        (safeImages.length > 1 ? (
          <div className="mb-4">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className="rounded-lg"
            >
              {safeImages.map((image, index) => (
                <SwiperSlide key={index} className="flex justify-center items-center">
                  {imageErrors[index] ? (
                    <div className="w-full h-64 bg-gray-100 flex justify-center items-center text-gray-500 rounded-lg">
                      Hình ảnh không tải được
                    </div>
                  ) : (
                    <img
                      src={image}
                      alt={`Hình ảnh bài viết ${index + 1}`}
                      className="w-full h-auto max-h-96 object-cover rounded-lg cursor-pointer"
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
          <div className="w-full h-64 bg-gray-100 flex justify-center items-center text-gray-500 rounded-lg mb-4">
            Hình ảnh không tải được
          </div>
        ) : (
          <img
            src={safeImages[0]}
            alt="Hình ảnh bài viết"
            className="w-full h-auto max-h-96 object-cover rounded-lg mb-4 cursor-pointer"
            onClick={handlePostNavigation}
            onError={handleImageError(0)}
            loading="lazy"
          />
        ))}

      <Divider />
      <div className="flex gap-4">
        <Button
          type="text"
          onClick={handleLike}
          icon={<img src={liked ? likeFilled : like} alt="Like" className="w-5 h-5" />}
        >
          {currentLikes}
        </Button>
        <Button
          type="text"
          onClick={handleDislike}
          icon={<img src={disliked ? dislikeFilled : dislike} alt="Dislike" className="w-5 h-5" />}
        >
          {currentDislikes}
        </Button>
        <Button
          type="text"
          onClick={handlePostNavigation}
          icon={<img src={comment} alt="Comment" className="w-5 h-5" />}
        >
          {comments}
        </Button>
      </div>
    </Card>
  );
};

export default Postcard;
