import { Alert, Divider } from 'antd';
import Tag_Card from './Components/Tag_Card/Tag_Card';
import Post_Card from '../../components/Post_Card/postcard';
import LoadingThreeDots from '../../components/Loader/LoadingThreeDots';
import { useGetPopular } from './Hooks/useGetPopular';

//TODO: Tối ưu việc fetch với Lazy Loading và Infinite Scroll -- Làm thêm useMemo vì posts rất nhiều data
//TODO: Làm thêm listview - grid view

const Popular = () => {
  const { data, isLoading, error } = useGetPopular();
  // console.log(data);
  
  const trendingTags = data?.data.trending_tags || [];
  const trendingPosts = data?.data.trending_posts || [];


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12  min-h-screen max-w-7xl">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-10 text-left tracking-tight">
        Popular Tags
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingThreeDots />
        </div>
      ) : error ? (
        <Alert
          message="Lỗi"
          description={data?.message}
          type="error"
          showIcon
          className="max-w-lg mx-auto mb-8 sm:mb-10 rounded-lg shadow-md"
        />
      ) : (
        <>
          {/* Trending Tags Section */}
          <section className="mb-10 sm:mb-16 bg-gradient-to-r from-orange-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Trending Tags</h2>
              <span className="text-orange-500 text-lg sm:text-xl animate-pulse">🔥</span>
            </div>
            <div className="flex overflow-x-auto gap-20 sm:gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {trendingTags.map((tag) => (
                <div key={tag.tag_id} className="flex-shrink-0 mx-4 w-40 sm:w-48 lg:w-56">
                  <Tag_Card
                    tag_id={tag.tag_id}
                    title={tag.tag_name}
                    posts={tag.num_posts}
                    // isTrending={tag.isTrending}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <Divider className="my-8 sm:my-12 border-gray-300" />

          {/* Trending Posts Section */}
          <section>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Trending posts</h2>
              <span className="text-blue-500 text-lg sm:text-xl animate-pulse">📈</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {trendingPosts.map((post) => (
                <Post_Card
                  key={post.post_id}
                  post_id={post.post_id}
                  user_id={post.user_id}
                  user={post.user_name}
                  title={post.post_title}
                  caption={post.post_content}
                  likes={post.upvote}
                  dislikes={post.downvote}
                  tags={post.tags}
                  comments={post.comments_num}
                  images={post.img_url}
                  date_updated={post.date_updated}
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