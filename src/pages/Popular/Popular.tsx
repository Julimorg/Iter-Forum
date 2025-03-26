import React, { useEffect, useState } from 'react';
import styles from './Popular.module.css';
import Tag_Card from '../../components/Tag_Card/Tag_Card';
import Post_Card from '../../components/Post_Card/postcard';
import axios from 'axios';
import { API_BE } from '../../config/configApi';

interface TrendingTags {
  tag_id: string;
  tag_name: string;
  tag_category: string;
  num_posts: number;
}

interface TrendingPost {
  user_id: string;
  user_name: string;
  ava_img_path: string;
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

interface TrendingResponse {
  data: {
    trending_tags: TrendingTags[];
    trending_posts: TrendingPost[];
  };
}

const Popular = () => {
  const [trendingTags, setTrendingTags] = useState<{
    tag_id: string;
    title: string;
    posts: number;
    isTrending: boolean;
  }[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<{
    post_id: string; // Thêm post_id
    user_id: string; // Thêm user_id
    user: string;
    title: string;
    content: string;
    likes: number;
    dislikes: number;
    comments: number;
    tags: string[];
    img_url: string[];
  }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingData = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setError('Vui lòng đăng nhập để xem nội dung trending');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get<TrendingResponse>(
          `${API_BE}/api/v1/recommend/popular`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const { trending_tags, trending_posts } = response.data.data;

        // Map trending tags cho Tag_Card
        const mappedTags = trending_tags.map((tag) => ({
          tag_id: tag.tag_id,
          title: tag.tag_name,
          posts: tag.num_posts,
          isTrending: true,
        }));

        // Map trending posts cho Post_Card
        const mappedPosts = trending_posts.map((post) => ({
          post_id: post.post_id, // Thêm post_id
          user_id: post.user_id, // Thêm user_id
          user: post.user_name,
          title: post.post_title,
          content: post.post_content,
          likes: post.upvote,
          dislikes: post.downvote,
          comments: post.comments_num,
          tags: post.tags,
          img_url: post.img_url,
        }));

        setTrendingTags(mappedTags);
        setTrendingPosts(mappedPosts);
      } catch (error: any) {
        console.error('Error fetching trending data:', error);
        setError(error.response?.data?.message || 'Không thể tải dữ liệu trending');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <div className={styles['popular-container']}>
      <h1 className={styles.title}>What is on trending?</h1>
      {isLoading ? (
        <div>Loading trending data...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          {/* Trending Tags Section */}
          <section className={styles['section-tags']}>
            <h2 className={styles['section-title']}>Trending tags</h2>
            <div className={styles.tags}>
              {trendingTags.map((tag) => (
                <Tag_Card
                  key={tag.tag_id}
                  tag_id={tag.tag_id}
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
              {trendingPosts.map((post) => (
                <Post_Card
                  key={post.post_id} // Sử dụng post_id làm key
                  post_id={post.post_id} // Truyền post_id
                  user_id={post.user_id} // Truyền user_id
                  user={post.user}
                  title={post.title} 
                  caption={post.content} 
                  likes={post.likes}
                  dislikes={post.dislikes}
                  tags={post.tags}
                  comments={post.comments}
                  images={post.img_url}
                  onRemove={() => console.log(`Post ${post.post_id} removed.`)}
                  isTrending={true}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Popular;