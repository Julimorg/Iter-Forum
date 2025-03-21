import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import dislike from '../../assets/dislike.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import dislikeFilled from '../../assets/dislike_filled.png';
import likeFilled from '../../assets/like_filled.png';
import TagPost from '../../components/Tag_Post/Tag_post';
import Trending from '../../assets/trending.png';
import ReportPopup from '../Report_Popup/Report_popup';

// Sử dụng transient prop "$isHidden" để không truyền xuống DOM
const PostCardContainer = styled.div`
  width: 100%;
  margin: 16px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  overflow: hidden;
  /* Hiệu ứng chuyển đổi cho opacity, margin và height */
  transition: opacity 0.5s ease, margin 0.5s ease, height 0.5s ease, padding 0.5s ease;
  height: auto;
  pointer-events: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
  margin-right: 8px;
`;

const Name = styled.div`
  font-weight: bold;
  flex-grow: 1;
`;

// DotsButton và Popup: bọc chúng trong container div để tránh lỗi lồng button
const DotsContainer = styled.div`
  position: relative;
`;

const DotsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
`;

const Popup = styled.div`
  position: absolute;
  top: 100%; /* Xuống bên dưới */
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 8px;
  min-width: 180px;
`;

const PopupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  text-align: left;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  border-bottom: 1px solid #e0e0e0;
  &:hover {
    background-color: #f0f0f0;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const Caption = styled.div`
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.5;
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
  direction: rtl;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
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

interface PostcardProps {
  user: string;
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  tags: string[];
  isTrending?: boolean;
  onRemove: () => void;
}

const Postcard: React.FC<PostcardProps> = ({
  user,
  caption,
  likes,
  dislikes,
  comments,
  tags,
  isTrending,
}) => {
  const [currentLikes, setCurrentLikes] = useState<number>(likes);
  const [currentDislikes, setCurrentDislikes] = useState<number>(dislikes);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

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

  const handleCommentClick = () => {
    navigate('/home/post-detail', {
      state: { user, caption, likes: currentLikes, dislikes: currentDislikes, tags, comments },
    });
  };

  return (
    <PostCardContainer>
      <Header>
        <ProfilePic />
        <Name>
          <Link to = "/home/user">{user}</Link>
        </Name>
        <DotsContainer>
          <DotsButton onClick={togglePopup}>⋮</DotsButton>
          {popupVisible && (
            <div ref={popupRef}>
              <ReportPopup type='post' />
            </div>
          )}
        </DotsContainer>
      </Header>
      <Caption>{caption}</Caption>
      <PostTags>
        {tags.map((tag, index) => (
          <TagPost key={index} tag={tag} />
        ))}
        {isTrending && (
          <div style={{ color: 'orange', display: 'flex', alignItems: 'center' }}>
            <img src={Trending} alt="Trending" style={{ marginRight: '0.5rem' }} />
            Trending
          </div>
        )}
      </PostTags>

      <ImagePlaceholder />
      <Interactions>
        <Button onClick={handleLike}>
          <img src={liked ? likeFilled : like} alt="Like" />
          {currentLikes}
        </Button>
        <Button onClick={handleDislike}>
          <img src={disliked ? dislikeFilled : dislike} alt="Dislike" />
          {currentDislikes}
        </Button>
        <Button onClick={handleCommentClick}>
          <img src={comment} alt="Comment" />
          {comments}
        </Button>
      </Interactions>
    </PostCardContainer>
  );
};

export default Postcard;