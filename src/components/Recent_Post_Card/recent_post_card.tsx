import React from 'react';
import styled from 'styled-components';

// Styled-components
const RecentPostContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-radius: 8px;
  gap: 20px;
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
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const Thumbnail = styled.div`
  width: 100px;
  height: 80px;
  background-color: #ddd;
  border-radius: 8px;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin-top: 12px;
`;

// Component Logic
const RecentPost: React.FC<{ avatarUrl: string }> = ({ avatarUrl }) => {
  return (
    <>
      <RecentPostContainer>
        <PostContent>
          <UserInfo>
            <ProfilePic>
              <img src={avatarUrl} alt="User Avatar" />
            </ProfilePic>
            <UserName>User Name</UserName>
          </UserInfo>
          <Caption>This is the recent post caption</Caption>
          <CommentCount>16 comments</CommentCount>
        </PostContent>
        <Thumbnail />
      </RecentPostContainer>
      <Divider />
    </>
  );
};

export default RecentPost;
