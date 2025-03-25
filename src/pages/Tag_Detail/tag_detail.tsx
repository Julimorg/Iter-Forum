import React, { useState, useEffect } from 'react';
import styles from './tag_detail.module.css';
import Post_Card from '../../components/Post_Card/postcard';
import { useParams, useNavigate } from 'react-router-dom';
import backIcon from '../../assets/back_arrow.png';
import bellIcon from '../../assets/bell.png';
import authorizedAxiosInstance from '../../services/Auth';

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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTagData = async () => {
            if (!tagId) {
                setError("Tag ID not provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    setError("Please login to view tag details");
                    setLoading(false);
                    return;
                }

                const response = await authorizedAxiosInstance.get<ApiResponse>(
                    `http://localhost:3000/api/v1/recommend/tags/${tagId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('Fetched tags detail:', response.data);
                if (response.data.is_success) {
                    setTagData(response.data.data);
                    setError(null);
                } else {
                    setError(response.data.message || "Failed to fetch tag details");
                }
            } catch (error: any) {
                console.error('Error fetching tag data:', error);
                setError(error.response?.data?.message || "Failed to fetch tag details");
            } finally {
                setLoading(false);
            }
        };

        fetchTagData();
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

    const handleRemovePost = (postId: string): void => {
        setTagData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                recommend_posts: prev.recommend_posts.filter(post => post.post_id !== postId),
                num_posts: prev.num_posts - 1,
            };
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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
                        {tagData.recommend_posts && tagData.recommend_posts.length > 0 ? (
                            tagData.recommend_posts.map((post) => (
                                <Post_Card
                                key={post.post_id}
                                user={post.user_name}
                                user_id={post.user_id}
                                post_id={post.post_id}
                                title={post.post_title}
                                caption={post.post_content}
                                likes={post.upvote}
                                dislikes={post.downvote}
                                comments={post.comments_num}
                                tags={post.tags}
                                images={post.img_url}
                                avatar={post.ava_img_path}
                                onRemove={() => handleRemovePost(post.post_id)}
                                isTrending={true}
                                date_updated={post.date_updated} // Đã có date_updated
                                />
                            ))
                        ) : (
                            <p>No posts found for this tag.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Tag_Detail;