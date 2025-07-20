import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge } from 'antd';
import { TagOutlined } from '@ant-design/icons';

interface TagCardProps {
  tag_id: string;
  title: string;
  posts: number;
}

const Tag_Card: React.FC<TagCardProps> = ({ tag_id, title, posts }) => {
  const navigate = useNavigate();

  const handleTagClick = () => {
    navigate(`/home/tag/${tag_id}`);
  };

  return (
    <Card
      className="w-64 relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-orange-400"
      onClick={handleTagClick}
      aria-label={`View details for ${title}`}
      bodyStyle={{ padding: '16px' }}
      hoverable
    >
      <Badge
        count={posts > 100 ? 'Hot' : null}
        className="absolute top-2 right-2"
        style={{ backgroundColor: '#f5222d', fontSize: '12px' }}
      />
      <div className="flex items-center gap-4">
        <TagOutlined className="text-orange-500 text-2xl animate-bounce-subtle" />
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors duration-200">
            #{title}
          </h3>
          <p className="text-sm text-gray-600">
            {posts} {posts === 1 ? 'bài viết' : 'bài viết'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Tag_Card;