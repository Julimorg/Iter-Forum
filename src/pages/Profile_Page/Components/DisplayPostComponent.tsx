import React, { useEffect, useState } from 'react';
import Postcard from '../../../components/Post_Card/postcard';
import { useAuthStore } from '../../../hook/useAuthStore';
import { useGetMyPosts } from '../Hooks/useGetMyPosts';
import { IGetMyPost } from '../../../interface/Users/IGetMyPosts';
import { Skeleton } from 'antd';

//TODO: Tối ưu việc fetch với LazyLoading và InfiniteScroll

//TODO: Chia ra grid và list view để trực quan hóa UI


const DisplayPostComponent: React.FC = () => {
  const user_id = useAuthStore.getState().user_id;
  const { data, isLoading, error, isFetching} = useGetMyPosts(user_id ?? undefined);
  const [posts, setPosts] = useState<IGetMyPost[]>(data?.data ?? []);

  
  useEffect(() => {
    if (data?.data) {
      setPosts(data.data);
    }
  }, [data]);

  const removePost = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== id));
  };

  if (error) {
    return (
      <p className="text-center text-red-500 py-6 bg-white rounded-lg shadow-sm">Lỗi: {error}</p>
    );
  }

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-[15rem]">
          {[...Array(1)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 5 }} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.post_id}
                
              >
                <Postcard
                  post_id={post.post_id}
                  user={post.user_name}
                  user_id={post.user_id}
                  title={post.post_title}
                  caption={post.post_content}
                  likes={post.upvote}
                  dislikes={post.downvote}
                  comments={post.comments_num}
                  tags={post.tags}
                  images={post.img_url}
                  avatar={post.ava_img_path}
                  onRemove={() => removePost(post.post_id)}
                  isTrending={false}
                  date_updated={post.date_updated}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6 bg-white rounded-lg shadow-sm">
              Chưa có bài viết nào
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default DisplayPostComponent;
