
import { Alert, Divider } from 'antd';
import Tag_Card from './Components/Tag_Card/Tag_Card';
import Post_Card from '../../components/Post_Card/postcard';
import LoadingThreeDots from '../../components/Loader/LoadingThreeDots';
import { useGetPopular } from './Hooks/useGetPopular';


//TODO: Tối ưu việc fetch với Lazy Loading và Infiniter Scroll -- Làm thêm useMemo vì posts rất nhiều data
//TODO: Làm thêm listview - grid view


const Popular = () => {

  const { data, isLoading, error } = useGetPopular();

  const trendingTags = data?.data.trending_tags || [];
  const trendingPosts = data?.data.trending_posts || [];

  console.log("trending tags: ", data);


  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-left tracking-tight">
        What is on trending?
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingThreeDots/>
        </div>
      ) : error ? (
        <Alert
          message="Lỗi"
          description={data?.message}
          type="error"
          showIcon
          className="max-w-lg mx-auto mb-10 rounded-lg shadow-md"
        />
      ) : (
        <>
          {/* Trending Tags Section */}
          <section className="mb-16 bg-gradient-to-r from-orange-50 to-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Trending Tags</h2>
              <span className="text-orange-500 text-xl animate-pulse">🔥</span>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {trendingTags.map((tag) => (
                <div key={tag.tag_id} className="flex-shrink-0">
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
          <Divider className="my-12 border-gray-300" />

          {/* Trending Posts Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Trending Posts</h2>
              <span className="text-blue-500 text-xl animate-pulse">📈</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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