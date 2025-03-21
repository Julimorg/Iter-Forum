import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './all_subcribed_tags.module.css'; // Import CSS module
import bellIcon from '../../assets/bell.png'; // Đường dẫn đến biểu tượng chuông

const All_Subscribed_Tags: React.FC = () => {
  const navigate = useNavigate();

  const subscribedTags = [
    { title: 'JavaScript', posts: '12,410', subscribers: '8,500', description: 'Learn about JavaScript, the language of the web.' },
    { title: 'ReactJS', posts: '10,231', subscribers: '7,230', description: 'Dive into ReactJS, the powerful JavaScript library for UI.' },
    { title: 'CSS', posts: '8,914', subscribers: '6,100', description: 'Master the art of styling with Cascading Style Sheets.' },
    { title: 'NodeJS', posts: '7,102', subscribers: '5,320', description: 'Build server-side applications with NodeJS.' },
    { title: 'Python', posts: '5,456', subscribers: '4,890', description: 'Explore Python, a versatile programming language for all needs.' },
    { title: 'Machine Learning', posts: '3,890', subscribers: '3,450', description: 'Discover the future with Machine Learning techniques.' },
    { title: 'Data Science', posts: '2,340', subscribers: '2,890', description: 'Analyze data effectively with Data Science skills.' },
    { title: 'Gaming', posts: '1,245', subscribers: '1,780', description: 'Stay updated with the latest trends in Gaming.' },
    { title: 'AI', posts: '9,782', subscribers: '6,900', description: 'Understand the power of Artificial Intelligence.' },
    { title: 'Web Development', posts: '8,712', subscribers: '7,510', description: 'Create modern websites with Web Development tools.' },
  ];

  const [subscriptionState, setSubscriptionState] = useState(
    subscribedTags.map(() => true) // Mặc định tất cả các tag đều ở trạng thái "Subscribed"
  );

  const handleSubscribeToggle = (index: number) => {
    setSubscriptionState(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index]; // Đảo ngược trạng thái
      return newState;
    });
  };

  const handleTagClick = (tagTitle: string) => {
    navigate(`/home/tag/${encodeURIComponent(tagTitle)}`);
  };

  return (
    <div className={styles.container}>
      {subscribedTags.map((tag, index) => (
        <button
          key={index}
          className={styles.tagItem}
          onClick={() => handleTagClick(tag.title)}
        >
          <div className={styles.header}>
            <span className={styles.tagName}>{tag.title}</span>
            <button
              className={`${subscriptionState[index] ? styles.subscribedButton : styles.subscribeButton}`}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn click vào toàn bộ tag item
                handleSubscribeToggle(index);
              }}
            >
              {subscriptionState[index] && <img src={bellIcon} alt="Bell Icon" className={styles.bellIcon} />}
              {subscriptionState[index] ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
          <div className={styles.subInfo}>
            <span className={styles.postCount}>{tag.posts} POSTS</span>
            <span className={styles.subscriberCount}>{tag.subscribers} SUBSCRIBERS</span>
          </div>
          <p className={styles.description}>{tag.description}</p>
          <hr className={styles.divider} />
        </button>
      ))}
    </div>
  );
};

export default All_Subscribed_Tags;
