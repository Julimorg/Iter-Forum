import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Trending from '../../assets/trending.png';

interface TagCardProps {
  tag_id: string;
  title: string;
  posts: number;
  isTrending: boolean;
}

const Tag_Card: React.FC<TagCardProps> = ({ tag_id, title, posts, isTrending }) => {
  const navigate = useNavigate();

  const styles: { [key: string]: CSSProperties } = {
    tagCard: {
      display: 'flex',
      alignItems: 'center',
      border: `2px solid ${isTrending ? '#ffa500' : '#000000'}`,
      borderRadius: '8px',
      padding: '10px 20px',
      backgroundColor: '#fff',
      boxShadow: isTrending
        ? '0 2px 4px rgba(0, 0, 0, 0.1)'
        : '0 1px 2px rgba(0, 0, 0, 0.1)',
      gap: '15px',
      cursor: 'pointer',
      width: '15rem',
      textAlign: 'left',
      transition: 'background-color 0.3s ease',
    },
    icon: {
      color: '#ffa500',
      fontSize: '24px',
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
      flex: 1,
      overflow: 'hidden',
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      margin: 0,
      color: '#333',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    posts: {
      fontSize: '0.9rem',
      color: '#777',
      margin: 0,
      whiteSpace: 'nowrap',
    },
  };

  const handleTagClick = () => {
    navigate(`/home/tag/${tag_id}`);
  };

  return (
    <button
      style={styles.tagCard}
      onClick={handleTagClick}
      aria-label={`View details for ${title}`}
    >
      {isTrending && (
        <div style={styles.icon}>
          <img src={Trending} alt="Trending" style={styles.icon} />
        </div>
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.posts}>{posts} POSTS</p>
      </div>
    </button>
  );
};

export default Tag_Card;