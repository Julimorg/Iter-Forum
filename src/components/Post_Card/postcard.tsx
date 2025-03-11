import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import dislike from '../../assets/dislike.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import dislike_filled from '../../assets/dislike_filled.png';
import like_filled from '../../assets/like_filled.png';
import hideIcon from '../../assets/hide.png';
import reportIcon from '../../assets/report.png';
import saveIcon from '../../assets/save_post.png';
import seeMoreIcon from '../../assets/see_more.png';
import seeLessIcon from '../../assets/see_less.png';
import hideUserIcon from '../../assets/hide_all.png';
import blockUserIcon from '../../assets/block.png';
import TagPost from '../../components/Tag_Post/Tag_post';
import trending from '../../assets/trending.png';

// Styled-components cho CSS
const PostCardContainer = styled.div<{ isHidden: boolean }>`
  width: 100%;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  transition: opacity 0.5s ease, margin 0.5s ease;
  opacity: ${(props) => (props.isHidden ? '0' : '1')};
  margin-bottom: ${(props) => (props.isHidden ? '0' : '16px')};
  pointer-events: ${(props) => (props.isHidden ? 'none' : 'auto')};
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

const DotsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  position: relative; /* Đặt position relative để làm gốc cho Popup */
`;

const Popup = styled.div`
  position: absolute;
  top: 100%; /* Hiển thị ngay bên dưới nút */
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 8px;
  min-width: 180px; /* Tùy chỉnh chiều rộng */
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
  word-wrap: break-word;
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
  justify-content: center;
  border: none;
  padding: 4px;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #d6d6d6;
  }
`;

const PostTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 10px 0;
  justify-content: right;
`;

const OnTrending = styled.div`
  color: orange;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

const PopupSeparator = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 8px 0;
`;

// Component logic giữ nguyên các tính năng bạn đã làm
const Postcard: React.FC<{
  user: string;
  caption: string;
  likes: number;
  dislikes: number;
  comments: number;
  tags: string[];
  isTrending?: boolean;
  onRemove: () => void;
}> = ({ user, caption, likes, dislikes, comments, tags, isTrending, onRemove }) => {
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentDislikes, setCurrentDislikes] = useState(dislikes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => setPopupVisible(!popupVisible);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setPopupVisible(false);
      }
    };
    if (popupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupVisible]);

  const handleLike = () => {
    if (!liked) {
      setCurrentLikes((prev) => prev + 1);
      if (disliked) {
        setDisliked(false);
        setCurrentDislikes((prev) => prev - 1);
      }
    } else {
      setCurrentLikes((prev) => prev - 1);
    }
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (!disliked) {
      setCurrentDislikes((prev) => prev + 1);
      if (liked) {
        setLiked(false);
        setCurrentLikes((prev) => prev - 1);
      }
    } else {
      setCurrentDislikes((prev) => prev - 1);
    }
    setDisliked(!disliked);
  };

  const handleHidePost = () => {
    setIsHidden(true);
    setTimeout(() => {
      onRemove();
    }, 500);
  };

  return (
    <PostCardContainer isHidden={isHidden}>
      <Header>
  <ProfilePic />
  <Name>{user}</Name>
  <DotsButton onClick={togglePopup}>
    ⋮
    {popupVisible && (
      <Popup ref={popupRef}>
        <PopupButton>
          <img src={saveIcon} alt="Save Post" />
          Save this post
        </PopupButton>
        <PopupSeparator />
        <PopupButton>
          <img src={seeMoreIcon} alt="See More Posts Like This" />
          See more posts like this
        </PopupButton>
        <PopupButton>
          <img src={seeLessIcon} alt="See Less Posts Like This" />
          See less posts like this
        </PopupButton>
        <PopupSeparator />
        <PopupButton onClick={handleHidePost}>
          <img src={hideIcon} alt="Hide Post" />
          Hide this post
        </PopupButton>
        <PopupButton>
          <img src={hideUserIcon} alt="Hide All Posts from This User" />
          Hide all posts from this user
        </PopupButton>
        <PopupSeparator />
        <PopupButton>
          <img src={blockUserIcon} alt="Block This User" />
          Block this user
        </PopupButton>
        <PopupButton style={{ color: 'red' }}>
          <img src={reportIcon} alt="Report Post" />
          Report this post to us
        </PopupButton>
      </Popup>
    )}
  </DotsButton>
</Header>

      <Caption>{caption}</Caption>
      <PostTags>
        {isTrending && (
          <OnTrending>
            Trending <img src={trending} alt="trending" />
          </OnTrending>
        )}
        {tags.map((tag, index) => (
          <TagPost key={index} tag={tag} />
        ))}
      </PostTags>
      <ImagePlaceholder />
      <Interactions>
        <Button onClick={handleLike}>
          <img src={liked ? like_filled : like} alt="Like" />
          {currentLikes}
          </Button>
        <Button onClick={handleDislike}>
          <img src={disliked ? dislike_filled : dislike} alt="Dislike" />
          {currentDislikes}
        </Button>
        <Button>
          <img src={comment} alt="Comment" />
          {comments}
        </Button>
      </Interactions>
    </PostCardContainer>
  );
};

export default Postcard;
