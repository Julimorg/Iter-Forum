import React from 'react';
import { Tag } from 'antd';

const TagPost: React.FC<{ tag: string }> = ({ tag }) => {
  return (
    <Tag
      className="bg-white text-gray-800 text-sm font-medium border border-gray-300 rounded-full px-3 py-1 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-400 transition-all duration-200 whitespace-nowrap"
    >
      # {tag}
    </Tag>
  );
};

export default TagPost;