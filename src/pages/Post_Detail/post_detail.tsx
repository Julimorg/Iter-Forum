import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { Avatar, Button, Input, Popover } from 'antd';
import { LikeOutlined, DislikeOutlined, CommentOutlined, SendOutlined, ArrowLeftOutlined, SmileOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReportPopup from '../../components/Report_Popup/Report_popup';
import { API_BE } from '../../config/configApi';
import axiosClient from '../../apis/axiosClient';
import EmojiPicker from 'emoji-picker-react';
import { fakeAvatar } from '../../utils/utils';

interface PostData {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  post_id: string;
  post_title: string;
  post_content: string;
  img_url: string[];
  date_updated: string;
  upvote: number;
  downvote: number;
  tags: string[];
  comments: CommentApiItem[];
}

interface CommentApiItem {
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  comment_id: string;
  comment_parent_id: string | null;
  date_comment: string;
  comment_content: string;
  upvote: number | null;
  downvote: number | null;
}

interface ApiResponse {
  is_success: boolean;
  status_code: number;   
  message: string;
  data: PostData;
  timestamp: number;
}

interface ReplyItem {
  comment_id: string;
  text: string;
  userName: string;
  timestamp: string;
}

interface CommentItem {
  comment_id: string;
  text: string;
  userName: string;
  timestamp: string;
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
  liked: boolean;
  disliked: boolean;
  replied: boolean;
  replyText?: string;
  replies: ReplyItem[];
}

interface InteractData {
  post_id: string;
  like: number;
  dislike: number;
}

interface CommentDataFromBE {
  post_id: string;
  cmt_id: string;
  cmt_parent_id: string;
  cmt_content: string;
  user_id: string;
  user_name: string;
  ava_img_path: string | null;
  date_cmt: string;
}

interface UserProfile {
  user_id: string;
  user_name: string;
  last_name: string | null;
  first_name: string | null;
  age: number;
  ava_img_path: string;
  email: string;
  phone_num: string;
}

const buildCommentTree = (comments: CommentApiItem[]): CommentItem[] => {
  const commentsMap: { [key: string]: CommentItem } = {};
  const rootComments: CommentItem[] = [];

  comments.forEach((comment: CommentApiItem) => {
    const commentItem: CommentItem = {
      comment_id: comment.comment_id,
      text: comment.comment_content,
      userName: comment.user_name,
      timestamp: comment.date_comment,
      likeCount: comment.upvote || 0,
      dislikeCount: comment.downvote || 0,
      replyCount: 0,
      liked: false,
      disliked: false,
      replied: false,
      replies: [],
    };
    commentsMap[comment.comment_id] = commentItem;
  });

  comments.forEach((comment: CommentApiItem) => {
    if (!comment.comment_parent_id) {
      rootComments.push(commentsMap[comment.comment_id]);
    } else {
      const parentComment = commentsMap[comment.comment_parent_id];
      if (parentComment) {
        parentComment.replies.push({
          comment_id: comment.comment_id,
          text: comment.comment_content,
          userName: comment.user_name,
          timestamp: comment.date_comment,
        });
        parentComment.replyCount = parentComment.replies.length;
      }
    }
  });

  rootComments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  rootComments.forEach((comment) => {
    comment.replies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  return rootComments;
};

const cacheComments = (postId: string, comments: CommentItem[]) => {
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
};

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLikes, setCurrentLikes] = useState<number>(0);
  const [currentDislikes, setCurrentDislikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [activeCommentIndex, setActiveCommentIndex] = useState<number | null>(null);
  const [commentsList, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const popupRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);

  const handleDisplayDetailCmts = useCallback((data: CommentDataFromBE) => {
    console.log('Received comment from BE:', data);
    const newCommentItem: CommentItem = {
      comment_id: data.cmt_id,
      text: data.cmt_content,
      userName: data.user_name,
      timestamp: data.date_cmt,
      likeCount: 0,
      dislikeCount: 0,
      replyCount: 0,
      liked: false,
      disliked: false,
      replied: false,
      replies: [],
    };

    setComments((prev) => {
      const isDuplicate = prev.some((comment) => comment.comment_id === data.cmt_id);
      if (isDuplicate) return prev;

      const updatedComments = data.cmt_parent_id === ''
        ? [newCommentItem, ...prev]
        : prev.map((comment) => {
            if (comment.comment_id === data.cmt_parent_id) {
              const isReplyDuplicate = comment.replies.some(
                (reply) => reply.comment_id === data.cmt_id
              );
              if (isReplyDuplicate) return comment;
              return {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    comment_id: data.cmt_id,
                    text: data.cmt_content,
                    userName: data.user_name,
                    timestamp: data.date_cmt,
                  },
                ],
                replyCount: comment.replies.length + 1,
                replied: false,
              };
            }
            return comment;
          });

      cacheComments(postId!, updatedComments);
      return updatedComments;
    });
    setIsSendingReply(false);
  }, [postId]);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const profileResponse = await axiosClient.get<{ data: UserProfile }>(
          'https://it-er-forum.onrender.com/api/v1/users/profile'
        );
        const fetchedUserId = profileResponse.data.data.user_id;
        setUserId(fetchedUserId);

        socketRef.current = io('https://it-er-forum.onrender.com', { transports: ['websocket'] });

        if (fetchedUserId && postId) {
          socketRef.current.emit('joinRoom', fetchedUserId);
          socketRef.current.emit('joinRoomPost', postId);
        }

        socketRef.current.on('connect', () => {
          console.log('WebSocket connected in PostDetail');
        });

        socketRef.current.on('displayDetailCmts', handleDisplayDetailCmts);

        socketRef.current.on('updateInteractFromServer', (data: InteractData) => {
          if (data.post_id === postId) {
            setCurrentLikes(data.like);
            setCurrentDislikes(data.dislike);

            const storedState = localStorage.getItem(`post_${postId}_interaction`);
            if (storedState) {
              const { liked: storedLiked, disliked: storedDisliked } = JSON.parse(storedState);
              setLiked(storedLiked);
              setDisliked(storedDisliked);
            }
          }
        });

        return () => {
          if (socketRef.current) {
            socketRef.current.off('displayDetailCmts', handleDisplayDetailCmts);
            socketRef.current.emit('leaveRoom', fetchedUserId);
            socketRef.current.disconnect();
            localStorage.setItem(`post_${postId}_interaction`, JSON.stringify({ liked, disliked }));
          }
        };
      } catch (err) {
        console.error('Error initializing WebSocket or fetching profile:', err);
      }
    };

    initializeSocket();
  }, [postId, liked, disliked, handleDisplayDetailCmts]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) {
        setError("Không có ID bài viết");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosClient.get<ApiResponse>(
          `${API_BE}/api/v1/posts/${postId}`
        );

        if (response.data.is_success) {
          const postData = response.data.data;
          setPost(postData);

          setCurrentLikes(postData.upvote);
          setCurrentDislikes(postData.downvote);

          const storedState = localStorage.getItem(`post_${postId}_interaction`);
          if (storedState) {
            const { liked: storedLiked, disliked: storedDisliked } = JSON.parse(storedState);
            setLiked(storedLiked);
            setDisliked(storedDisliked);
          }

          setComments(buildCommentTree(postData.comments || []));
          setError(null);
        } else {
          setError(response.data.message || "Không thể tải chi tiết bài viết");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Bài viết không tồn tại hoặc lỗi server");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popupRefs.current[0]?.current && !popupRefs.current[0].current.contains(event.target as Node)) {
        setShowPopup(false);
      }
      if (
        activeCommentIndex !== null &&
        popupRefs.current[activeCommentIndex]?.current &&
        !popupRefs.current[activeCommentIndex].current.contains(event.target as Node)
      ) {
        setActiveCommentIndex(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeCommentIndex]);

  const handleLike = () => {
    if (!socketRef.current || !postId || !userId) return;

    const newLiked = !liked;
    const newDisliked = newLiked ? false : disliked;

    socketRef.current.emit('newInteractFromClient', {
      post_id: postId,
      user_post_id: userId,
      is_upvote: true,
      upvote: newLiked ? currentLikes + 1 : currentLikes - 1,
      downvote: newDisliked ? currentDislikes + 1 : (disliked ? currentDislikes - 1 : currentDislikes),
    });

    localStorage.setItem(`post_${postId}_interaction`, JSON.stringify({ liked: newLiked, disliked: newDisliked }));
  };

  const handleDislike = () => {
    if (!socketRef.current || !postId || !userId) return;

    const newDisliked = !disliked;
    const newLiked = newDisliked ? false : liked;

    socketRef.current.emit('newInteractFromClient', {
      post_id: postId,
      user_post_id: userId,
      is_upvote: false,
      upvote: newLiked ? currentLikes + 1 : (liked ? currentLikes - 1 : currentLikes),
      downvote: newDisliked ? currentDislikes + 1 : currentDislikes - 1,
    });

    localStorage.setItem(`post_${postId}_interaction`, JSON.stringify({ liked: newLiked, disliked: newDisliked }));
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !socketRef.current || !postId || !userId) return;

    const commentData = {
      user_id: userId,
      post_id: postId,
      cmt_cont: newComment,
      level_parent: -1,
      cmt_parent_id: '',
      user_parent_id: null,
      user_post_id: userId,
    };

    socketRef.current.emit('newCommentFromClient', commentData);
    setNewComment('');
  };

  const handleCommentReply = (index: number) => {
    setComments((prevComments) =>
      prevComments.map((comment, i) => {
        if (i === index) {
          return { ...comment, replied: !comment.replied };
        }
        return comment;
      })
    );
  };

  const handleReplyInputChange = (index: number, text: string) => {
    setComments((prevComments) =>
      prevComments.map((comment, i) => {
        if (i === index) {
          return { ...comment, replyText: text };
        }
        return comment;
      })
    );
  };

  const handlePostReply = useCallback((index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!socketRef.current || !postId || !userId || isSendingReply) return;

    setIsSendingReply(true);

    const comment = commentsList[index];
    if (comment.replyText?.trim()) {
      const replyData = {
        user_id: userId,
        post_id: postId,
        cmt_cont: comment.replyText,
        level_parent: 0,
        cmt_parent_id: comment.comment_id,
        user_parent_id: userId,
        user_post_id: userId,
      };

      socketRef.current?.emit('newCommentFromClient', replyData);
      setComments((prevComments) =>
        prevComments.map((c, i) =>
          i === index ? { ...c, replyText: '', replied: false } : c
        )
      );
    }
  }, [postId, userId, isSendingReply, commentsList]);

  const handleTagClick = () => {
    alert("Sắp ra mắt");
  };

  const handleUserNavigation = () => {
    navigate(`/home/user-detail/${post?.user_id}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  const formatRelativeTime = (date: string): string => {
    const now = new Date();
    const updatedDate = new Date(date);
    const diffInMs = now.getTime() - updatedDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 1) return `${diffInSeconds} giây trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes} phút trước`;
    const days = Math.floor(hours / 24);
    if (days < 1) return `${hours} giờ trước`;
    const weeks = Math.floor(days / 7);
    if (weeks < 1) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    if (months < 1) return `${weeks} tuần trước`;
    const years = Math.floor(months / 12);
    if (years < 1) return `${months} tháng trước`;
    return `${years} năm trước`;
  };

  const handleEmojiClick = (_emojiData: any) => {
    setNewComment((prev) => prev + _emojiData.emoji);
  };

  const handleReplyEmojiClick = (index: number, _emojiData: any,) => {
    setComments((prev) =>
      prev.map((comment, i) =>
        i === index ? { ...comment, replyText: (comment.replyText || '') + _emojiData.emoji } : comment
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-500">{error || "Không tìm thấy bài viết"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors duration-200"
        >
          <ArrowLeftOutlined className="mr-2" />
          Quay lại
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start space-x-4 mb-6">
            <Avatar size={48} src={post.ava_img_path} className="border-2 border-gray-200">
              {post.user_name[0]}
            </Avatar>
            <div className="flex-1">
              <div
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserNavigation();
                }}
              >
                {post.user_name}
              </div>
              <div className="text-sm text-gray-500">{formatRelativeTime(post.date_updated)}</div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ⋮
              </button>
              {showPopup && (
                <div ref={popupRefs.current[0] = popupRefs.current[0] || React.createRef()} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <ReportPopup type="Post" user_id={post.user_id} post_id={post.post_id} />
                </div>
              )}
            </div>
          </div>

          <div className="text-2xl font-bold text-gray-900 mb-4">{post.post_title}</div>
          <div className="text-gray-700 mb-6 leading-relaxed">{post.post_content}</div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags && post.tags.length > 0 && post.tags.map((tag, index) => (
              <button
                key={index}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                onClick={handleTagClick}
              >
                #{tag}
              </button>
            ))}
          </div>

          {post.img_url && post.img_url.length > 0 && (
            post.img_url.length > 1 ? (
              <div className="swiper-container mb-6 rounded-lg overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {post.img_url.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`Hình ảnh bài viết ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <img
                src={post.img_url[0]}
                alt="Hình ảnh bài viết"
                className="w-full h-auto rounded-lg mb-6"
              />
            )
          )}

          <div className="flex items-center space-x-6 border-t border-b border-gray-200 py-4 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${liked ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:bg-gray-100'} transition-all duration-200`}
            >
              <LikeOutlined />
              <span className="font-medium">Thích ({currentLikes})</span>
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${disliked ? 'text-red-600 bg-red-100' : 'text-gray-600 hover:bg-gray-100'} transition-all duration-200`}
            >
              <DislikeOutlined />
              <span className="font-medium">Không thích ({currentDislikes})</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <CommentOutlined />
              <span className="font-medium">Bình luận ({commentsList.length})</span>
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Input.TextArea
                  rows={3}
                  placeholder="Viết bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-3 pr-12"
                />
                <Popover
                  content={<EmojiPicker onEmojiClick={handleEmojiClick} />}
                  trigger="click"
                  placement="topRight"
                  overlayClassName="z-50"
                >
                  <Button
                    icon={<SmileOutlined />}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  />
                </Popover>
              </div>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="h-12 rounded-lg"
              >
                Gửi
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {commentsList.map((item, index) => {
              if (!popupRefs.current[index]) {
                // popupRefs.current[index] = React.createRef<HTMLDivElement>();
              }
              return (
                <div key={item.comment_id} className="flex">
                  <div className="w-12 flex-shrink-0">
                    <Avatar size={40} src={fakeAvatar} className="border-2 border-gray-200">
                      {item.userName[0]}
                    </Avatar>
                    {commentsList.length > 1 && index < commentsList.length - 1 && (
                      <div className="w-px h-full bg-gray-300 absolute left-6 top-12"></div>
                    )}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-lg font-semibold text-gray-800">{item.userName}</span>
                        <span className="text-sm text-gray-500 ml-2">{formatRelativeTime(item.timestamp)}</span>
                      </div>
                      <div className="relative">
                        <button
                          className="text-gray-500 hover:text-gray-700 text-xl"
                          onClick={() => setActiveCommentIndex(index)}
                        >
                          ⋮
                        </button>
                        {activeCommentIndex === index && (
                          <div ref={popupRefs.current[index]} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <ReportPopup
                              type="Comment"
                              user_id={post.user_id}
                              post_id={post.post_id}
                              comment_id={item.comment_id}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2 break-words w-[50rem]">{item.text}</div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <button
                        className="flex items-center space-x-1 hover:text-blue-600"
                        onClick={() => {}}
                      >
                        <LikeOutlined /> <span>Thích ({item.likeCount})</span>
                      </button>
                      <button
                        className="flex items-center space-x-1 hover:text-red-600"
                        onClick={() => {}}
                      >
                        <DislikeOutlined /> <span>Không thích ({item.dislikeCount})</span>
                      </button>
                      <button
                        className="flex items-center space-x-1 hover:text-blue-600"
                        onClick={() => handleCommentReply(index)}
                      >
                        Trả lời ({item.replyCount})
                      </button>
                    </div>

                    {item.replied && (
                      <div className="mt-4 flex items-center space-x-4">
                        <div className="relative flex-1">
                          <Input.TextArea
                            rows={2}
                            placeholder="Viết trả lời..."
                            value={item.replyText || ''}
                            onChange={(e) => handleReplyInputChange(index, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-3 pr-12"
                          />
                          <Popover
                            content={<EmojiPicker onEmojiClick={(emojiData) => handleReplyEmojiClick(index, emojiData)} />}
                            trigger="click"
                            placement="topRight"
                            overlayClassName="z-50"
                          >
                            <Button
                              icon={<SmileOutlined />}
                              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                            />
                          </Popover>
                        </div>
                        <Button
                          type="primary"
                          icon={<SendOutlined />}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handlePostReply(index, e)}
                          disabled={isSendingReply}
                          className="h-10 rounded-lg"
                        >
                          Gửi
                        </Button>
                      </div>
                    )}

                    {item.replies.length > 0 && (
                      <div className="mt-4 space-y-4 ml-12 relative">
                        <div className="absolute w-px h-full bg-gray-300 left-[-12px] top-0"></div>
                        {item.replies.map((reply) => (
                          <div key={reply.comment_id} className="flex items-start">
                            <div className="w-8 flex-shrink-0">
                              <Avatar size={32} src={fakeAvatar} className="border-2 border-gray-200">
                                {reply.userName[0]}
                              </Avatar>
                            </div>
                            <div className="flex-1 ml-2">
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <span className="text-sm font-medium text-gray-800">{reply.userName}</span>
                                  <span className="text-xs text-gray-500 ml-1">{formatRelativeTime(reply.timestamp)}</span>
                                </div>
                              </div>
                              <div className="text-gray-700 w-[44rem] break-words">{reply.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;