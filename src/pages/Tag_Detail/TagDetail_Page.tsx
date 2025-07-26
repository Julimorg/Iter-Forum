import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Alert, Divider, Typography, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Post_Card from '../../components/Post_Card/postcard';
import { motion } from 'framer-motion';
import 'antd/dist/reset.css';
import { useGetTagDetail } from './Hooks/useGetTagDetail';
import LoadingThreeDots from '../../components/Loader/LoadingThreeDots';


//TODO: Tối ưu việc fetch -- useMemo, LazyLoading, InfiniteScroll
//TODO: Sử dụng GridView, ListView

const { Title, Text } = Typography;

const Tag_Detail: React.FC = () => {
  const navigate = useNavigate();
  const { tagId } = useParams<{ tagId: string }>();

  const { data, isLoading, error } = useGetTagDetail(tagId ?? '');

  const tag_detail = data?.data;
  const recommend_posts = data?.data.recommend_posts;

  // console.log("tag detail: ", data);

  const handleBack = (): void => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingThreeDots/>
      </div>
    );
  }

  if (error || !tag_detail) {
    return (
      <Alert
        message="Lỗi"
        description={data?.message || 'Không tìm thấy dữ liệu cho thẻ này.'}
        type="error"
        showIcon
        className="max-w-lg mx-auto my-10 rounded-lg shadow-md"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 max-w-7xl"
    >
      <Button
        type="text"
        icon={<ArrowLeftOutlined className="text-gray-600 text-lg" />}
        onClick={handleBack}
        className="mb-6 flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-200"
      >
        Quay lại
      </Button>

      <Card
        className="mb-8 bg-gradient-to-r from-orange-50 to-white rounded-2xl shadow-lg"
        bodyStyle={{ padding: '24px' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={2} className="text-gray-900 font-bold mb-2">
              # {tag_detail.tag_name}
            </Title>
            <Text type="secondary" className="text-sm text-gray-600">
              {tag_detail.num_posts} {tag_detail.num_posts === 1 ? 'post' : 'posts'}
            </Text>
          </div>
        </div>
        <Text className="text-gray-700 text-base leading-relaxed">
          {tag_detail.tag_description || 'Không có mô tả cho thẻ này.'}
        </Text>
      </Card>

      <Divider className="my-8 border-gray-200" />

      <section>
        <Title level={3} className="text-gray-800 font-semibold mb-6">
          Bài viết liên quan
        </Title>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {recommend_posts && recommend_posts.length > 0 ? (
            recommend_posts.map((post) => (
              <motion.div
                key={post.post_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Post_Card
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
                  // onRemove={() => handleRemovePost(post.post_id)} 
                  isTrending={true}
                  date_updated={post.data_updated} //
                />
              </motion.div>
            ))
          ) : (
            <Text className="text-gray-500 text-center text-base">
              Không tìm thấy bài viết nào cho thẻ này.
            </Text>
          )}
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Tag_Detail;