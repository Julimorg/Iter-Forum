import { useState } from "react";
import { useGetRecommendPosts } from "../Hooks/useGetHome";
import { Skeleton } from "antd";
import RecentPost from "../../../components/Recent_Post_Card/recent_post_card";
import Postcard from "../../../components/Post_Card/postcard";

import { Typography } from 'antd';
const { Text } = Typography;

//TODO: Sẽ ứng dụng thêm LazyLoading và Infinite Scroll vào để tối ưu fetching Post

//TODO: Tìm cách tối ưu render img khi fetching post 

//TODO: Tìm cách xử lý socket khi vào Home
        //* --> Bắt socket trực tiếp ở Home
        //* --> Bắt socket như đã làm ở PostCard và tìm cách tối ưu 
//TODO: Tìm cách RemovePost UI/UX thông qua Cache của ReactQuery



function PostDisplayComponent() {
  const [showRecentPosts, setShowRecentPosts] = useState<boolean>(true);
  const { data, isLoading, error } = useGetRecommendPosts();

  const removePost = (postId: string) => {
    console.log(`Remove post with ID: ${postId}`);
  };

  const clearRecentPosts = () => {
    setShowRecentPosts(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 max-w-[85vw] mx-auto sm:gap-3 md:gap-4 xl:gap-5">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} active avatar paragraph={{ rows: 5 }} className="w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Text className="text-center text-red-500 text-sm sm:text-base md:text-lg">
        Lỗi: {(error as Error).message}
      </Text>
    );
  }

  const recommendPosts = data?.data.recommend_posts || [];
  const recentPosts = data?.data.recent_posts || [];

  return (
    <div className="relative">
      <div className="flex flex-col ml-20 mt-10 gap-2 max-w-[100vw] mx-auto sm:gap-3 md:gap-4 xl:gap-5">
        {recommendPosts.length > 0 ? (
          recommendPosts.map((post) => (
            <Postcard
              key={post.post_id}
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
          ))
        ) : (
          <Text className="text-gray-600 text-center text-sm sm:text-base md:text-lg">
            Không có bài viết gợi ý nào.
          </Text>
        )}
      </div>
      {showRecentPosts && (
        <div
          className="hidden lg:block fixed right-4 top-[10vh] w-[18vw] min-w-[14rem] max-w-sm bg-gray-100 rounded-lg p-1.5 overflow-y-auto sm:w-[16vw] sm:min-w-[15rem] sm:max-w-md sm:p-2 sm:mt-5 md:w-[14vw] md:min-w-[16rem] md:max-w-lg md:p-2.5 md:mt-5 xl:w-[12vw] xl:min-w-[18rem] xl:max-w-xl xl:right-6 xl:p-3 xl:mt-5"
          style={{ maxHeight: 'calc(70vh - 1rem)', zIndex: 5 }}
        >
          <div className="flex justify-between items-center mb-1 md:mb-1.5 xl:mb-2">
            <h2 className="text-xs font-bold text-gray-800 sm:text-sm md:text-base">Bài viết gần đây</h2>
            <button
              className="text-blue-600 underline bg-transparent rounded px-1 py-0.5 text-xs hover:bg-gray-200 transition-colors duration-200 sm:px-1.5 sm:py-1 md:text-sm md:px-2 md:py-1.5"
              onClick={clearRecentPosts}
            >
              Xóa
            </button>
          </div>
          <div className="flex flex-col gap-1 md:gap-1.5 xl:gap-2 ">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <RecentPost
                  key={post.post_id}
                  user={post.user_name}
                  user_id={post.user_id}
                  post_id={post.post_id}
                  title={post.post_title}
                  comments={post.comments_num}
                  ava_img_path = {post.ava_img_path}
                  // image={post.img_url && post.img_url.length > 0 ? post.img_url[0] : undefined}
                  // likes={post.upvote}
                  // dislikes={post.downvote}
                  // tags={post.tags}
                  // images={post.img_url}
                  // isTrending={false}
                  date_updated={post.date_updated}
                />
              ))
            ) : (
              <Text className="text-gray-600 text-center text-xs sm:text-sm md:text-base">
                Không có bài viết gần đây.
              </Text>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDisplayComponent;