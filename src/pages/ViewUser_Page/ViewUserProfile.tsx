import { useParams } from 'react-router-dom';
import { Avatar, Card, Alert, Typography, Space, Divider, Button, Skeleton } from 'antd';
import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import Post_Card from '../../components/Post_Card/postcard';
import { motion } from 'framer-motion';
import 'antd/dist/reset.css';
import { useGetUserProfile } from './Hooks/useGetUserProfile';
import { userGetUserProfilePost } from './Hooks/useGetUserProfilePosts';
import { useState } from 'react';
import ReportPopup from '../../components/Report_Popup/Report_popup';
import LoadingThreeDots from '../../components/Loader/LoadingThreeDots';

const { Title, Text } = Typography;

//TODO: Config lại Loading cho phần User và Phần Posts
//TODO: Optimize lại fetching Posts --> useMemo, LazyLoading, InfiniteScroll
//TODO: ListView và GridView cho posts
//TODO: Thêm color cho "status"

const defaultAvatar: string =
  'https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg';
const defaultCover: string =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80';


const ViewUserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [popupVisible, setPopupVisible] = useState(false);

  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    error: userError,
  } = useGetUserProfile(userId ?? '');
  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = userGetUserProfilePost(userId ?? '');

  const userProfile = user?.data;
  const userPosts = posts?.data;

  const fullname = userProfile
    ? (userProfile.first_name || '') + ' ' + (userProfile.last_name || '')
    : '';
  const displayName = fullname.trim() !== '' ? fullname : userProfile?.user_name || 'Chưa có tên';

  const togglePopup = () => setPopupVisible(!popupVisible);

  if (isUserLoading || isUserFetching || isPostsLoading) {
    return (
      <div className="flex justify-center items-center h-[30rem]">
        <LoadingThreeDots />
      </div>
    );
  }


  if (userError || postsError) {
    return (
      <Alert
        message="Lỗi"
        description={userError?.message || postsError?.message || 'Không tìm thấy người dùng'}
        type="error"
        showIcon
        className="max-w-lg mx-auto my-10 rounded-lg shadow-md"
      />
    );
  }


  if (!userProfile) {
    return (
      <Alert
        message="Lỗi"
        description="Không tìm thấy thông tin người dùng"
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
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <Card className="mb-8 bg-white rounded-lg shadow-sm" bodyStyle={{ padding: 0 }}>
        {/* Cover Photo */}
        <div className="h-56 bg-gray-200 rounded-t-lg relative">
          <img src={defaultCover} alt="Cover" className="w-full h-full object-cover rounded-t-lg" />
          <Avatar
            src={userProfile.ava_img_path || defaultAvatar}
            icon={!userProfile.ava_img_path && !defaultAvatar ? <UserOutlined /> : undefined}
            size={120}
            className="border-4 border-white absolute -bottom-16 left-8 shadow-md rounded-full"
          />
        </div>
        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Space>
                <Title level={3} className="text-gray-800 font-bold">
                  {displayName}
                </Title>
                <Text className="text-gray-600 text-lg">
                  ({userProfile.user_name || 'Chưa có tên'})
                </Text>
              </Space>
              <Text type="secondary" className="text-base text-green-600 mt-2 block">
                Trạng thái: {userProfile.status || 'Hoạt động'}
              </Text>
            </div>
            <div className="relative">
              <Button
                type="primary"
                icon={<MoreOutlined />}
                onClick={togglePopup}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Báo cáo
              </Button>
              {popupVisible && (
                <div className="absolute right-0 z-10 mt-2">
                  <ReportPopup type="User" user_id={userProfile.user_id} />
                </div>
              )}
            </div>
          </div>
          <Divider className="my-6 border-gray-200" />
          <Space direction="vertical" size="small">
            <Title level={5} className="text-gray-800 font-semibold">
              Thông tin cá nhân
            </Title>
            <Text className="text-gray-700 text-base">Email: {userProfile.email || 'N/A'}</Text>
            {userProfile.phone_num && (
              <Text className="text-gray-700 text-base">Điện thoại: {userProfile.phone_num}</Text>
            )}
            {userProfile.age && (
              <Text className="text-gray-700 text-base">Tuổi: {userProfile.age}</Text>
            )}
            {(userProfile.first_name || userProfile.last_name) && (
              <Text className="text-gray-700 text-base">
                Tên: {userProfile.first_name || ''} {userProfile.last_name || ''}
              </Text>
            )}
          </Space>
        </div>
      </Card>

      <Divider className="my-8 border-gray-200" />

      <section>
        <Title level={3} className="text-gray-800 font-semibold mb-6">
          Bài viết của {displayName}
        </Title>
        {isPostsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} active avatar paragraph={{ rows: 2 }} />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {Array.isArray(userPosts) && userPosts.length > 0 ? (
              userPosts.map((post) => (
                <motion.div
                  key={post.post_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Post_Card
                    post_id={post.post_id}
                    user={post.user_name}
                    user_id={post.user_id}
                    title={post.post_title}
                    caption={post.post_content}
                    likes={post.upvote}
                    dislikes={post.downvote}
                    comments={post.comments_num}
                    // tags={post.tags || []}
                    images={post.img_url}
                    avatar={post.ava_img_path}
                    date_updated={post.date_updated}
                    // onRemove={() => handleRemovePost(post.post_id)} // Comment vì không sử dụng
                    isTrending={false}
                  />
                </motion.div>
              ))
            ) : (
              <Text className="text-gray-500 text-center text-base">Không có bài viết nào.</Text>
            )}
          </motion.div>
        )}
      </section>
    </motion.div>
  );
};

export default ViewUserProfile;