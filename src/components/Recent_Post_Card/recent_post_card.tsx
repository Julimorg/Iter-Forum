import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Card, Space, Typography } from 'antd';
import { formatRelativeTime, my_user_id } from '../../utils/utils';

const { Text, Title } = Typography;

interface RecentPostProps {
  user: string;
  user_id: string;
  post_id: string;
  title: string;
  comments: number;
  date_updated: string;
  ava_img_path: string;
}

const RecentPost: React.FC<RecentPostProps> = ({
  user,
  user_id,
  post_id,
  title,
  comments,
  date_updated,
  ava_img_path
}) => {
  const navigate = useNavigate();

  const handlePostNavigation = () => {
    navigate(`/home/post-detail/${post_id}`);
  };

  const handleUserNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    {
      user_id == my_user_id ? navigate(`/home/profile`) : navigate(`/home/user-detail/${user_id}`)
    }
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        marginBottom: 16,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: 'none',
        transition: 'all 0.3s ease',
      }}
      bodyStyle={{
        padding: '12px 16px',
      }}
      onClick={handlePostNavigation}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Space align="center" size={12}>
          <Avatar
            size={{ xs: 36, md: 40, xl: 44 }}
            src={ava_img_path}
            style={{
              backgroundColor: '#1890ff',
              flexShrink: 0,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {user[0]?.toUpperCase() || 'U'}
          </Avatar>
          <div>
            <Text
              strong
              style={{
                fontSize: 16,
                cursor: 'pointer',
                color: '#1890ff',
                transition: 'color 0.2s',
              }}
              onClick={handleUserNavigation}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#40a9ff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1890ff')}
            >
              {user}
            </Text>
            <Text
              type="secondary"
              style={{
                display: 'block',
                fontSize: 12,
                color: '#8c8c8c',
              }}
            >
              {formatRelativeTime(date_updated)}
            </Text>
          </div>
        </Space>
        <Title
          level={5}
          style={{
            margin: 0,
            fontSize: 16,
            color: '#1f1f1f',
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Title>
        <Text
          style={{
            fontSize: 12,
            color: '#595959',
          }}
        >
          {comments} bình luận
        </Text>
      </Space>
    </Card>
  );
};

export default RecentPost;