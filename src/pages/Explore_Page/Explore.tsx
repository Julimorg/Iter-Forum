import { Card, Skeleton, Typography } from 'antd';
import { useGetSubscribedTags } from './Hooks/useGetExploreTags';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

//TODO: Bên BE hiện tại chưa config việc fetch dữ liệu cho những tags chưa có bài post nào
//TODO: nên là việc cần làm 1: Config bên Fe / 2: Config bên BE

const Explore = () => {
  const { data, isLoading: isFetching } = useGetSubscribedTags();
  const navigate = useNavigate();

  const groupedTags = useMemo(() => {
    return (
      data?.data?.reduce(
        (
          acc: {
            [key: string]: { tag_id: string; title: string; posts: number; isTrending: boolean }[];
          },
          tag
        ) => {
          const category = tag.tag_category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            tag_id: tag.tag_id,
            title: tag.tag_name,
            posts: tag.num_posts,
            isTrending: tag.num_posts > 1000,
          });
          return acc;
        },
        {}
      ) || {}
    );
  }, [data]);

  const handleTagClick = (tag_id: string) => {
    navigate(`/home/tag/${tag_id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6  lg:px-8  py-8 min-h-screen max-w-7xl">
      <Title level={2} className="mb-8 text-gray-800 text-start text-2xl sm:text-3xl lg:text-4xl font-bold">
        Explore tags
      </Title>

      {isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 2 }} className="w-full" />
          ))}
        </div>
      ) : (
        <>
          {Object.entries(groupedTags).map(([category, tags]) => (
            <section key={category} className="mb-8 sm:mb-12">
              <Title level={4} className="mb-4 text-gray-700 text-lg sm:text-xl lg:text-2xl font-semibold">
                {category}
              </Title>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tags.map((tag) => (
                  <Card
                    key={tag.tag_id}
                    hoverable
                    className="shadow-md transition-all duration-300 hover:shadow-lg w-full rounded-lg overflow-hidden"
                    onClick={() => handleTagClick(tag.tag_id)}
                    cover={
                      tag.isTrending && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                          Đang thịnh hành
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={
                        <Text strong className="text-gray-800 text-base sm:text-lg">
                          {tag.title}
                        </Text>
                      }
                      description={
                        <Text type="secondary" className="text-sm sm:text-base">
                          {tag.posts.toLocaleString()} {tag.posts > 1 ? 'posts' : 'post' }
                        </Text>
                      }
                    />
                  </Card>
                ))}
              </div>
            </section>
          ))}
          {Object.keys(groupedTags).length === 0 && (
            <div className="text-center py-8">
              <Text type="secondary" className="text-base sm:text-lg">
                Không tìm thấy thẻ nào.
              </Text>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;