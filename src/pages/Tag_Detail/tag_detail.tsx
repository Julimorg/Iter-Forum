import React, { useState, useEffect } from 'react';
import styles from './tag_detail.module.css';
import Post_Card from '../../components/Post_Card/postcard';
import { useParams, useNavigate } from 'react-router-dom';
import backIcon from '../../assets/back_arrow.png';
import bellIcon from '../../assets/bell.png';
import axios from 'axios';

interface Post {
    user_id: string;
    user_name: string;
    ava_img_path: string | null;
    post_id: string;
    post_title: string;
    post_content: string;
    img_url: string[];
    date_updated: string;
    upvote: number;
    downvote: number;
    comments_num: number;
    tags: string[];
}

interface TagData {
    recommend_posts: Post[];
    tag_id: string;
    tag_name: string;
    tag_category: string;
    tag_description: string;
    num_posts: number;
}

interface ApiResponse {
    is_success: boolean;
    status_code: number;
    message: string;
    data: TagData;
    timestamp: number;
}

const Tag_Detail: React.FC = () => {
    const navigate = useNavigate();
    const { tagId } = useParams<{ tagId: string }>();
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [tagData, setTagData] = useState<TagData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTagData = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('accessToken') || '';

                const response = await axios.get<ApiResponse>(
                    `http://localhost:3000/api/v1/recommend/tags/${tagId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('Fetched tags detail:', response.data); // Giữ log để debug
                if (response.data.is_success) {
                    setTagData(response.data.data);
                } else {
                    console.error('API request failed:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching tag data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (tagId) {
            fetchTagData();
        }
    }, [tagId]);

    const handleBack = (): void => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/home');
        }
    };

    const handleSubscribeToggle = (): void => {
        setIsSubscribed(prev => !prev);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!tagData) {
        return <div>No data found for this tag</div>;
    }

    return (
        <div className={styles.wrapper}>
            <button className={styles.backButton} onClick={handleBack}>
                <img src={backIcon} alt="Back" />
                Back
            </button>

            <div className={styles['popular-container']}>
                <div className={styles.tagHeader}>
                    <div className={styles.tagInfo}>
                        <h1 className={styles.tagName}>{tagData.tag_name}</h1>
                        <p className={styles.postCount}>{`${tagData.num_posts} Posts`}</p>
                    </div>

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
                                'Subscribe'
                            )}
                        </button>
                        <p className={styles.subscriberCount}>
                            {isSubscribed ? '14,000 Subscribers' : '13,999 Subscribers'}
                        </p>
                    </div>
                </div>

                <p className={styles.tagDescription}>{tagData.tag_description}</p>

                <hr className={styles.separator} />

                <section className={styles['trending-posts']}>
                    <div className={styles['trending_post_content']}>
                        {tagData.recommend_posts &&
                            tagData.recommend_posts.map((post, index) => (
                                <Post_Card
                                    key={index}
                                    user={post.user_name}
                                    caption={post.post_title}
                                    likes={post.upvote}
                                    user_id={post.user_id}
                                    post_id={post.post_id}
                                    dislikes={post.downvote}
                                    tags={post.tags}
                                    comments={post.comments_num}
                                    images={post.img_url} // Truyền mảng img_url vào Post_Card
                                    onRemove={() => console.log(`Post ${index} removed.`)}
                                    isTrending={true} title={''} />
                            ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Tag_Detail;