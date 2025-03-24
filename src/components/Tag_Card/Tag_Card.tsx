import React, { CSSProperties } from 'react';
import Trending from '../../assets/trending.png';
import Follow from '../../assets/see_more.png';

const Tag_Card: React.FC<{ title: string; posts: number; isTrending: boolean }> = ({ title, posts, isTrending }) => {
  // CSS styles with explicit typing using CSSProperties
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
    },
    icon: {
      color: '#ffa500',
      fontSize: '24px',
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const, // Ensure valid literal type
      gap: '10px',
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      margin: 0,
      color: '#333',
    },
    postsFollow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      margin: 0,
    },
    posts: {
      fontSize: '0.9rem',
      color: '#777',
      margin: 0,
    },
    followButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5px',
    },
    followImage: {
      width: '20px',
      height: '20px',
    },
  };

  return (
    <div style={styles.tagCard}>
      {isTrending && (
        <div style={styles.icon}>
          <img src={Trending} alt="Trending" style={styles.icon} />
        </div>
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.postsFollow}>
          <p style={styles.posts}>{posts} POSTS</p>
          <button style={styles.followButton} aria-label={`Follow ${title}`}>
            <img src={Follow} alt="Follow" style={styles.followImage} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tag_Card;
