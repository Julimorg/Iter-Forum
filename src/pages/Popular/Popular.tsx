import React from 'react';
import styles from './Popular.module.css'; // Import CSS Module
import Tag_Card from '../../components/Tag_Card/Tag_Card'; // Import Tag_Card component
import Post_Card from '../../components/Post_Card/postcard'; // Import Post_Card component

const Popular: React.FC = () => {
  const trendingTags = [
    { title: 'JavaScript', posts: '12,410', isTrending: true },
    { title: 'ReactJS', posts: '10,231', isTrending: true },
    { title: 'CSS', posts: '8,914', isTrending: true },
    { title: 'NodeJS', posts: '7,102', isTrending: true },
    { title: 'Python', posts: '5,456', isTrending: true },
    { title: 'Machine Learning', posts: '3,890', isTrending: true },
    { title: 'Data Science', posts: '2,340', isTrending: true },
    { title: 'Gaming', posts: '1,245', isTrending: true },
    { title: 'AI', posts: '9,782', isTrending: true },
    { title: 'Web Development', posts: '8,712', isTrending: true },
  ];

  const trendingPosts = [
    {
      user: 'John Doe',
      caption: 'Mastering React in 2023',
      likes: 123,
      dislikes: 10,
      comments: 25,
    },
    {
      user: 'Jane Smith',
      caption: '10 Tips for Learning JavaScript',
      likes: 95,
      dislikes: 5,
      comments: 15,
    },
    {
      user: 'AI Enthusiast',
      caption: 'Exploring Artificial Intelligence Trends',
      likes: 300,
      dislikes: 15,
      comments: 40,
    },
  ];

  return (
    <div className={styles['popular-container']}>
      <h1 className={styles.title}>What is on trending?</h1>

      {/* Trending Tags Section */}
      <section className={styles['section-tags']}>
        <h2 className={styles['section-title']}>Trending tags</h2>
        <div className={styles.tags}>
          {trendingTags.map((tag, index) => (
            <Tag_Card
              key={index}
              title={tag.title}
              posts={tag.posts}
              isTrending={tag.isTrending}
            />
          ))}
        </div>
      </section>

      {/* Trending Posts Section */}
      <section className={styles['trending-posts']}>
        <h2 className={styles['section-title']}>Trending posts</h2>
        <div className={styles['trending_post_content']}>
          {trendingPosts.map((post, index) => (
            <Post_Card
              key={index}
              user={post.user}
              caption={post.caption}
              likes={post.likes}
              dislikes={post.dislikes}
              tags={['ReactJS', 'JavaScript', 'Web Development']}
              comments={post.comments}
              onRemove={() => console.log(`Post ${index} removed.`)}
              isTrending={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Popular;
