import { Link } from "react-router-dom";

interface SearchedUser {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  status: string;
}

interface SearchResponse {
  data: SearchedUser[];
}


function SearchModal({ isOpen, users, onClose }: { isOpen: boolean; users: SearchedUser[]; onClose: () => void }) {
  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 w-80 max-h-96 overflow-y-auto transition-all duration-300 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết quả tìm kiếm</h3>
      {users.length > 0 ? (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.user_id}>
              <Link
                to={`/home/user-detail/${user.user_id}`}
                onClick={onClose}
                className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md"
              >
                {user.user_name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">Không tìm thấy người dùng</p>
      )}
      <button
        onClick={onClose}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Đóng
      </button>
    </div>
  );
}

export default SearchModal