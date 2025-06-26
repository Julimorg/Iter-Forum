import { Card, Skeleton, Typography } from 'antd';
import { useGetSubscribedTags } from './Hooks/useGetExploreTags';
import { useMemo } from 'react';

const { Title, Text } = Typography;

const Explore = () => {
  const { data, isLoading: isFetching } = useGetSubscribedTags();

  // Chuyển đổi dữ liệu từ hook thành groupedTags
  const groupedTags = useMemo(() => {
    return (
      data?.data?.reduce(
        (acc: { [key: string]: { tag_id: string; title: string; posts: number; isTrending: boolean }[] }, tag) => {
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
  return (
    <div className="container  px-4 py-8  min-h-screen">
      <Title level={2} className="mb-8 text-gray-800 text-start">
        Explore Tags
      </Title>

      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} active avatar paragraph={{ rows: 2 }} />
          ))}
        </div>
      ) : (
        <>
          {Object.entries(groupedTags).map(([category, tags]) => (
            <section key={category} className="mb-12">
              <Title level={4} className="mb-4 text-gray-700">
                {category}
              </Title>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tags.map((tag) => (
                  <Card
                    key={tag.tag_id}
                    hoverable
                    className="shadow-md transition-all duration-300 hover:shadow-lg"
                    cover={
                      tag.isTrending && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Đang thịnh hành
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={
                        <Text strong className="text-gray-800">
                          {tag.title}
                        </Text>
                      }
                      description={
                        <Text type="secondary">
                          {tag.posts.toLocaleString()} bài viết
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
              <Text type="secondary">Không tìm thấy thẻ nào.</Text>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;