import React, { useState } from 'react';
import styles from './tag_detail.module.css'; // Import CSS Module
import Post_Card from '../../components/Post_Card/postcard'; // Import Post_Card component
import { useParams, useNavigate } from 'react-router-dom';
import backIcon from '../../assets/back_arrow.png'; // Import back icon
import bellIcon from '../../assets/bell.png'; // Import bell icon

const Tag_Detail: React.FC = () => {
    const navigate = useNavigate();
    const { tagName } = useParams<{ tagName: string }>();

    const [isSubscribed, setIsSubscribed] = useState(false); // State cho nút Subscribe

    const tagContent = {
        ReactJS: "Learn about ReactJS, the powerful JavaScript library for building user interfaces.",
        JavaScript: "Discover the versatility of JavaScript, the language of the web.",
        "Web Development": "Explore the world of web development and modern technologies.",
        CSS: "Master the art of styling with Cascading Style Sheets.",
        NodeJS: "Build server-side applications with NodeJS.",
        Python: "Explore Python, a versatile programming language for all needs.",
        "Machine Learning": "Discover the future with Machine Learning techniques.",
        "Data Science": "Analyze data effectively with Data Science skills.",
        Gaming: "Stay updated with the latest trends in Gaming.",
        AI: "Understand the power of Artificial Intelligence.",
        WebDevelopment: "Create modern websites with Web Development tools.",
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1); // Quay lại trang trước đó
        } else {
            navigate("/home"); // Điều hướng đến trang mặc định
        }
    };

    const handleSubscribeToggle = () => {
        setIsSubscribed(!isSubscribed); // Chuyển đổi trạng thái Subscribe
    };

    const tagPosts = [
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
        <div className={styles.wrapper}>
            {/* Nút Back */}
            <button className={styles.backButton} onClick={handleBack}>
                <img src={backIcon} alt="Back" />
                Back
            </button>
    
            <div className={styles['popular-container']}>
                {/* Header cho phần tag */}
                <div className={styles.tagHeader}>
                    {/* Bên trái: Tên tag và số lượng post */}
                    <div className={styles.tagInfo}>
                        <h1 className={styles.tagName}>{tagName}</h1>
                        <p className={styles.postCount}>{`${tagPosts.length} Posts`}</p>
                    </div>
    
                    {/* Bên phải: Nút subscribe và số người đăng ký */}
                    <div className={styles.subscribeSection}>
                        <button
                            className={isSubscribed ? styles.subscribedButton : styles.subscribeButton}
                            onClick={handleSubscribeToggle}
                        >
                            {isSubscribed ? (
                                <>
                                    <img src={bellIcon} alt="Bell" />
                                    Subscribed
                                </>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                        <p className={styles.subscriberCount}>
                            {isSubscribed ? "14,000 Subscribers" : "13,999 Subscribers"}
                        </p>
                    </div>
                </div>
    
                {/* Mô tả tag */}
                <p className={styles.tagDescription}>
                    {tagContent[tagName as keyof typeof tagContent]}
                </p>
    
                {/* Dòng kẻ ngăn cách */}
                <hr className={styles.separator} />
    
                {/* Trending Posts Section */}
                <section className={styles['trending-posts']}>
                    <div className={styles['trending_post_content']}>
                        {tagPosts.map((post, index) => (
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
        </div>
    );
    
    
};

export default Tag_Detail;
