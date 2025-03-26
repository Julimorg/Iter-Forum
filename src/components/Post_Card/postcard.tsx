import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import dislike from '../../assets/dislike.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import dislikeFilled from '../../assets/dislike_filled.png';
import likeFilled from '../../assets/like_filled.png';
import TagPost from '../../components/Tag_Post/Tag_post';
import Trending from '../../assets/trending.png';
import ReportPopup from '../Report_Popup/Report_popup';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

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
  date_updated?: string; // Sửa thành optional
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
  onRemove,
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

  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const count = Array.isArray(images) ? images.length : 0;
    setImageCount(count);
    setImageErrors(new Array(count).fill(false));
  }, [images]);

  const togglePopup = () => setPopupVisible(!popupVisible);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setCurrentLikes((prev) => (liked ? prev - 1 : prev + 1));
    if (disliked) {
      setDisliked(false);
      setCurrentDislikes((prev) => prev - 1);
    }
  };

  const handleDislike = () => {
    setDisliked((prev) => !prev);
    setCurrentDislikes((prev) => (disliked ? prev - 1 : prev + 1));
    if (liked) {
      setLiked(false);
      setCurrentLikes((prev) => prev - 1);
    }
  };

  const handlePostNavigation = () => {
    console.log("Navigating to post detail with post_id:", post_id);
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

export default Postcard;

// Styled components
const PostCardContainer = styled.div`
  width: 100%;
  margin: 16px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  overflow: hidden;
  transition: opacity 0.5s ease, margin 0.5s ease, height 0.5s ease, padding 0.5s ease;
  height: auto;
  pointer-events: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
  margin-right: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Name = styled.div`
  font-weight: bold;
  flex-grow: 1;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const DotsContainer = styled.div`
  position: relative;
  margin-left: auto;
`;

const DotsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  cursor: pointer;
`;

const Caption = styled.div`
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
  direction: rtl;
`;

const SingleImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const SwiperContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
  .swiper {
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 9;
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
  }
`;

const Interactions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  border: none;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #d6d6d6;
  }
`;

const ImageCount = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
`;