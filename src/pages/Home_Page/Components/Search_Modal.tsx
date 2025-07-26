import { Link } from "react-router-dom";
import { Modal, List, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface SearchedUser {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  status: string;
}

function SearchModal({ isOpen, users, onClose }: { isOpen: boolean; users: SearchedUser[]; onClose: () => void }) {
  return (
    <Modal
      title={<span className="text-lg font-semibold text-gray-800">Kết quả tìm kiếm</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className="rounded-lg"
      bodyStyle={{ maxHeight: "400px", overflowY: "auto", padding: "16px" }}
    >
      {users.length > 0 ? (
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <Link
                to={`/home/user-detail/${user.user_id}`}
                onClick={onClose}
                className="flex items-center w-full px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Avatar
                  src={user.ava_img_path || undefined}
                  icon={!user.ava_img_path && <UserOutlined />}
                  size={40}
                  className="mr-3"
                />
                <span className="text-gray-800">{user.user_name}</span>
              </Link>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 text-center py-4">Không tìm thấy người dùng</p>
      )}
      <Button
        type="primary"
        block
        onClick={onClose}
        className="mt-4 h-10 bg-blue-500 hover:bg-blue-600 border-none"
      >
        Đóng
      </Button>
    </Modal>
  );
}

export default SearchModal;