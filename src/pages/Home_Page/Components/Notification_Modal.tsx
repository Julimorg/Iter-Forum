import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetNotification } from '../Hooks/useGetNotification';
import { List, Typography, Card, Skeleton, Badge } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationData } from '../../../interface/Recommend/ISubscricedTag';
import { formatRelativeTime } from '../../../utils/utils';
import { BellOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;


//TODO: Cần tối ưu việc fetch với Lazy Loading 

const NotificationItem = memo(
  ({ notification }: { notification: NotificationData }) => {
    const navigate = useNavigate();
    const parsedContent = useMemo(() => {
      try {
        return JSON.parse(notification.notification_content as string);
      } catch {
        return { content: 'Thông báo không hợp lệ', post_id: '' };
      }
    }, [notification.notification_content]);

    const timeAgo = useMemo(() => {
      return formatRelativeTime(notification.date_sent);
    }, [notification.date_sent]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <List.Item
          className="cursor-pointer transition-all duration-200 hover:bg-gray-100 rounded-lg mx-2"
          onClick={() => parsedContent.post_id && navigate(`post-detail/${parsedContent.post_id}`)}
        >
          <List.Item.Meta
            avatar={<Badge dot><BellOutlined style={{ fontSize: 20, color: '#1677ff' }} /></Badge>}
            title={
              <div className="flex justify-between items-center">
                <Text strong style={{ fontSize: 14, color: '#1f1f1f' }}>
                  Notification
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {timeAgo}
                </Text>
              </div>
            }
            description={
              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ margin: 0, fontSize: 14, color: '#595959' }}
              >
                {parsedContent.content}
              </Paragraph>
            }
          />
        </List.Item>
      </motion.div>
    );
  },
  (prevProps, nextProps) => prevProps.notification.notification_id === nextProps.notification.notification_id
);

function NotiModel({ isOpen }: { isOpen: boolean }) {
  const { data, isLoading, error } = useGetNotification();
  const notifications = useMemo(() => data || [], [data]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 60,
            right: 8,
            zIndex: 50,
            width: 380,
            maxWidth: '95vw',
          }}
        >
          <Card
            title={
              <div className="flex items-center gap-2">
                <BellOutlined style={{ fontSize: 18, color: '#1677ff' }} />
                <Text strong style={{ fontSize: 16, color: '#1f1f1f' }}>
                  Notifications
                </Text>
              </div>
            }
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              maxHeight: '70vh',
              background: '#fff',
            }}
            bodyStyle={{ padding: '8px 0' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '12px 16px' }}
          >
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ padding: '12px 16px' }}>
                  {[...Array(3)].map((_, index) => (
                    <Skeleton
                      key={index}
                      active
                      avatar={false}
                      paragraph={{ rows: 2, width: ['80%', '60%'] }}
                      title={false}
                      style={{ marginBottom: 12 }}
                    />
                  ))}
                </div>
              ) : error ? (
                <div style={{ padding: 16, textAlign: 'center', color: '#ff4d4f' }}>
                  Can't load notification
                </div>
              ) : notifications.length > 0 ? (
                <List
                  dataSource={notifications}
                  renderItem={(notification) => (
                    <NotificationItem key={notification.notification_id} notification={notification} />
                  )}
                  split={true}
                />
              ) : (
                <div style={{ padding: 16, textAlign: 'center', color: '#8c8c8c' }}>
                  Empty Notification
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(NotiModel, (prevProps, nextProps) => prevProps.isOpen === nextProps.isOpen);

