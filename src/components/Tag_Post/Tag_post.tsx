import React, { CSSProperties } from 'react';

const TagPost: React.FC<{ tag: string }> = ({ tag }) => {
  // CSS styles defined as objects
  const styles: { [key: string]: CSSProperties } = {
    tagPost: {
      backgroundColor: 'rgb(255, 255, 255)',
      color: '#000000',
      fontSize: '0.85rem',
      padding: '5px 10px',
      borderRadius: '12px',
      border: '1px solid #000000',
      display: 'inline-block',
      whiteSpace: 'nowrap', // Prevent tags from breaking into multiple lines
    },
  };

  return (
    <span style={styles.tagPost}>
      #{tag}
    </span>
  );
};

export default TagPost;
