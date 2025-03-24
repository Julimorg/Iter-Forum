import React, { useEffect, useState } from 'react';
import styles from './Explore.module.css';
import Tag_Card from '../../components/Tag_Card/Tag_Card';
import axios from 'axios';
import { API_BE } from '../../config/configApi';

interface Tags {
  tag_id: string;
  tag_name: string;
  tag_category: string;
  num_posts: number;
}

const Explore = () => {
  const [groupedTags, setGroupedTags] = useState<{
    [category: string]: { title: string; posts: number; isTrending: boolean }[];
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm trạng thái loading

  useEffect(() => {
    const fetchTags = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('No access token found in localStorage');
        setIsLoading(false); // Tắt loading nếu không có token
        return;
      }

      try {
        setIsLoading(true); // Bật loading khi bắt đầu fetch
        const response = await axios.get(`${API_BE}/api/v1/recommend/tags`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = response.data.data;

        // Nhóm tags theo tag_category
        const tagsByCategory = data.reduce((acc: { [key: string]: { title: string; posts: number; isTrending: boolean }[] }, tag: Tags) => {
          const category = tag.tag_category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            title: tag.tag_name,
            posts: tag.num_posts,
            isTrending: tag.num_posts > 1000,
          });
          return acc;
        }, {});

        setGroupedTags(tagsByCategory);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false); // Tắt loading khi hoàn tất (dù thành công hay lỗi)
      }
    };

    fetchTags();
  }, []);

  return (
    <div className={styles['popular-container']}>
      <h1 className={styles.title}>Explore new tags:</h1>

      {isLoading ? (
        <div>Loading tags...</div> // Hiển thị khi đang loading
      ) : (
        <>
          {/* Render mỗi category với tags tương ứng */}
          {Object.entries(groupedTags).map(([category, tags]) => (
            <section key={category} className={styles['section-tags']}>
              <h2>{category}</h2>
              <div className={styles.tags}>
                {tags.map((tag, index) => (
                  <Tag_Card
                    key={index}
                    title={tag.title}
                    posts={tag.posts}
                    isTrending={tag.isTrending}
                  />
                ))}
              </div>
            </section>
          ))}
          <button className={styles['see-more']}>See more tags</button>
        </>
      )}
    </div>
  );
};

export default Explore;