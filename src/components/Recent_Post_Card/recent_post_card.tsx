import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RecentPostContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-radius: 8px;
  gap: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PostContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

const Caption = styled.div`
  font-size: 14px;
  color: #666;
`;

const CommentCount = styled.div`
  font-size: 12px;
  color: #666;
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100px;
  height: 80px;
`;

const Thumbnail = styled.div<{ image?: string }>`
  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.image ? 'transparent' : '#ddd')};
  background-image: ${(props) => (props.image ? `url(${props.image})` : 'none')};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const ImageCount = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  color: #333;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin-top: 12px;
`;

interface RecentPostProps {
  user: string;
  caption: string;
  comments: number;
  image?: string;
  likes: number;
  dislikes: number;
  tags: string[];
  images?: string[] | null; // Cập nhật type để chấp nhận null
  isTrending?: boolean;
}

const RecentPost: React.FC<RecentPostProps> = ({
  user,
  caption,
  comments,
  image,
  likes,
  dislikes,
  tags,
  images = [], // Giá trị mặc định là mảng rỗng
  isTrending,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/home/post-detail', {
      state: {
        user,
        caption,
        likes,
        dislikes,
        tags,
        comments,
        images,
        isTrending,
      },
    });
  };

  // Đảm bảo images là mảng để tránh lỗi khi truy cập length
  const safeImages = Array.isArray(images) ? images : [];
  // Tính số lượng hình ảnh còn lại (nếu có nhiều hơn 1 hình)
  const additionalImages = safeImages.length > 1 ? safeImages.length - 1 : 0;

  return (
    <>
      <RecentPostContainer onClick={handleNavigation}>
        <PostContent>
          <UserInfo>
            <ProfilePic />
            <UserName>{user}</UserName>
          </UserInfo>
          <Caption>{caption}</Caption>
          <CommentCount>{comments} comments</CommentCount>
        </PostContent>
        {image && (
          <ThumbnailContainer>
            <Thumbnail image={image} />
            {additionalImages > 0 && (
              <ImageCount>+{additionalImages}</ImageCount>
            )}
          </ThumbnailContainer>
        )}
      </RecentPostContainer>
      <Divider />
    </>
  );
};

export default RecentPost;