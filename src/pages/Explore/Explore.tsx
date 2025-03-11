import React from 'react';
import styles from './Explore.module.css';
import Tag_Card from '../../components/Tag_Card/Tag_Card'; // Import Tag_Card component

const Explore: React.FC = () => {
  // Example data for trending tags
  const purposeTags = [
    { title: 'Sharing', posts: '12,410', isTrending: true },
    { title: 'I have a problem', posts: '10,231', isTrending: true },
    { title: 'Problem Solving', posts: '8,914', isTrending: false },
    { title: 'Ask me anything', posts: '7,102', isTrending: false },
    { title: 'Recruitment', posts: '5,456', isTrending: false },
  ];

  const topicTags = [
    { title: 'Sharing', posts: '12,410', isTrending: true },
    { title: 'I have a problem', posts: '10,231', isTrending: true },
    { title: 'Problem Solving', posts: '8,914', isTrending: false },
    { title: 'Ask me anything', posts: '7,102', isTrending: false },
    { title: 'Recruitment', posts: '5,456', isTrending: false },
  ];

  const suitableForTags = [
    { title: 'Sharing', posts: '12,410', isTrending: true },
    { title: 'I have a problem', posts: '10,231', isTrending: true },
    { title: 'Problem Solving', posts: '8,914', isTrending: false },
    { title: 'Ask me anything', posts: '7,102', isTrending: false },
    { title: 'Recruitment', posts: '5,456', isTrending: false },
  ];

  const entertainmentTags = [
    { title: 'Sharing', posts: '12,410', isTrending: true },
    { title: 'I have a problem', posts: '10,231', isTrending: true },
    { title: 'Problem Solving', posts: '8,914', isTrending: false },
    { title: 'Ask me anything', posts: '7,102', isTrending: false },
    { title: 'Recruitment', posts: '5,456', isTrending: false },
  ];

  return (
    <div className={styles['popular-container']}>
      <h1 className={styles.title}>Explore new tags:</h1>

      {/* Purpose Section */}
      <section className={styles['section-tags']}>
        <h2>Purpose:</h2>
        <div className={styles.tags}>
          {purposeTags.map((tag, index) => (
            <Tag_Card
              key={index}
              title={tag.title}
              posts={tag.posts}
              isTrending={tag.isTrending}
            />
          ))}
        </div>
        <button className={styles['see-more']}>See more tags</button>
      </section>

      {/* Topic Section */}
      <section className={styles['section-tags']}>
        <h2>Topic:</h2>
        <div className={styles.tags}>
          {topicTags.map((tag, index) => (
            <Tag_Card
              key={index}
              title={tag.title}
              posts={tag.posts}
              isTrending={tag.isTrending}
            />
          ))}
        </div>
        <button className={styles['see-more']}>See more tags</button>
      </section>

      {/* Suitable for Section */}
      <section className={styles['section-tags']}>
        <h2>Suitable for:</h2>
        <div className={styles.tags}>
          {suitableForTags.map((tag, index) => (
            <Tag_Card
              key={index}
              title={tag.title}
              posts={tag.posts}
              isTrending={tag.isTrending}
            />
          ))}
        </div>
        <button className={styles['see-more']}>See more tags</button>
      </section>

      {/* Entertainment Section */}
      <section className={styles['section-tags']}>
        <h2>Entertainment:</h2>
        <div className={styles.tags}>
          {entertainmentTags.map((tag, index) => (
            <Tag_Card
              key={index}
              title={tag.title}
              posts={tag.posts}
              isTrending={tag.isTrending}
            />
          ))}
        </div>
        <button className={styles['see-more']}>See more tags</button>
      </section>
    </div>
  );
};

export default Explore;
