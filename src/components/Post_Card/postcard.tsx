import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import authorizedAxiosInstance from '../../services/Auth';

interface PostcardProps {
  post_id: string;
  user: string;
  user_id: string;
  title: string;
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  tags: string[];
  isTrending?: boolean;
  onRemove: () => void;
  images?: string[] | null;
  avatar?: string | null;
  date_updated?: string;
}

interface InteractData {
  post_id: string;
  like: number;
  dislike: number;
}

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
  // onRemove,
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
        const profileResponse = await authorizedAxiosInstance.get<{ data: { user_id: string } }>(
          'http://localhost:3000/api/v1/users/profile'
        );
        const fetchedUserId = profileResponse.data.data.user_id;
        setUserId(fetchedUserId);

        socketRef.current = io('http://localhost:3000', { transports: ['websocket'] });

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
      downvote: newDisliked ? currentDislikes + 1 : (disliked ? currentDislikes - 1 : currentDislikes),
    });

    localStorage.setItem(`post_${post_id}_interaction`, JSON.stringify({ liked: newLiked, disliked: newDisliked }));
  };

  const handleDislike = () => {
    if (!socketRef.current || !post_id || !userId) return;

    const newDisliked = !disliked;
    const newLiked = newDisliked ? false : liked;

    socketRef.current.emit('newInteractFromClient', {
      post_id,
      user_post_id: userId,
      is_upvote: false,
      upvote: newLiked ? currentLikes + 1 : (liked ? currentLikes - 1 : currentLikes),
      downvote: newDisliked ? currentDislikes + 1 : currentDislikes - 1,
    });

    localStorage.setItem(`post_${post_id}_interaction`, JSON.stringify({ liked: newLiked, disliked: newDisliked }));
  };

  const handlePostNavigation = () => {
    navigate(`/home/post-detail/${post_id}`);
  };

  const handleUserNavigation = () => {
    navigate(`/home/user-detail/${user_id}`);
  };

  const safeImages = Array.isArray(images) ? images : [];

  const handleImageError = (index: number) => (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
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
    if (minutes < 1) return `${diffInSeconds} seconds ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes} minutes ago`;
    const days = Math.floor(hours / 24);
    if (days < 1) return `${hours} hours ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 1) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 1) return `${weeks} weeks ago`;
    const years = Math.floor(months / 12);
    if (years < 1) return `${months} months ago`;
    return `${years} years ago`;
  };

  return (
    <PostCardContainer>
      <Header>
        <ProfilePic style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover' } : {}} />
        <UserInfo>
          <Name onClick={handleUserNavigation}>{user}</Name>
          {date_updated && <Timestamp>{formatRelativeTime(date_updated)}</Timestamp>}
        </UserInfo>
        <DotsContainer>
          <DotsButton onClick={togglePopup}>⋮</DotsButton>
          {popupVisible && (
            <div ref={popupRef}>
              <ReportPopup type="Post" user_id={user_id} post_id={post_id} />
            </div>
          )}
        </DotsContainer>
      </Header>
      <Title onClick={handlePostNavigation}>{title}</Title>
      <Caption onClick={handlePostNavigation}>{caption}</Caption>
      <PostTags>
        {tags ? tags.map((tag, index) => (
          <TagPost key={index} tag={tag} />
        )) : null}
        {isTrending && (
          <div style={{ color: 'orange', display: 'flex', alignItems: 'center' }}>
            <img src={Trending} alt="Trending" style={{ marginRight: '0.5rem' }} />
            Trending
          </div>
        )}
      </PostTags>

      {imageCount > 0 && <ImageCount>{imageCount} image{imageCount > 1 ? 's' : ''}</ImageCount>}

      {safeImages.length > 0 && (
        safeImages.length > 1 ? (
          <SwiperContainer>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
            >
              {safeImages.map((image, index) => (
                <SwiperSlide key={index}>
                  {imageErrors[index] ? (
                    <PlaceholderImage>Image failed to load</PlaceholderImage>
                  ) : (
                    <img
                      src={image}
                      alt={`Post image ${index + 1}`}
                      onClick={handlePostNavigation}
                      onError={handleImageError(index)}
                      loading="lazy"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperContainer>
        ) : (
          imageErrors[0] ? (
            <PlaceholderImage>Image failed to load</PlaceholderImage>
          ) : (
            <SingleImage
              src={safeImages[0]}
              alt="Post image"
              onClick={handlePostNavigation}
              onError={handleImageError(0)}
              loading="lazy"
            />
          )
        )
      )}

      <Interactions>
        <Button onClick={handleLike}>
          <img src={liked ? likeFilled : like} alt="Like" />
          {currentLikes}
        </Button>
        <Button onClick={handleDislike}>
          <img src={disliked ? dislikeFilled : dislike} alt="Dislike" />
          {currentDislikes}
        </Button>
        <Button onClick={handlePostNavigation}>
          <img src={comment} alt="Comment" />
          {comments}
        </Button>
      </Interactions>
    </PostCardContainer>
  );
};

const PostCardContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  width: 60vw; /* Cập nhật width thành 60vw */
  max-width: 50rem; /* Cập nhật max-width thành 50rem */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 0.5rem;
`;

const UserInfo = styled.div`
  flex-grow: 1;
`;

const Name = styled.div`
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Timestamp = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const DotsContainer = styled.div`
  position: relative;
`;

const DotsButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin: 0.5rem 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Caption = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0.5rem 0;
  cursor: pointer;
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const ImageCount = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0;
`;

const SwiperContainer = styled.div`
  width: 100%;
  margin: 0.5rem 0;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const SingleImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: 5px;
  margin: 0.5rem 0;
  cursor: pointer;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  border-radius: 5px;
  margin: 0.5rem 0;
`;

const Interactions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  color: #333;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #007bff;
  }
`;

export default Postcard;