import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import styles from './post_detail.module.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import commentIcon from '../../assets/comment.png';
import likeFilled from '../../assets/like_filled.png';
import dislikeFilled from '../../assets/dislike_filled.png';
import replyIcon from '../../assets/comment.png';
import replyFilled from '../../assets/comment.png';
import backIcon from '../../assets/back_arrow.png';
import sendIcon from '../../assets/send.png';
import ReportPopup from '../../components/Report_Popup/Report_popup';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import authorizedAxiosInstance from '../../services/Auth';
import { API_BE } from '../../config/configApi';

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

const getCachedComments = (postId: string): CommentItem[] => {
  const cached = localStorage.getItem(`comments_${postId}`);
  return cached ? JSON.parse(cached) : [];
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
        const profileResponse = await authorizedAxiosInstance.get<{ data: UserProfile }>(
          'http://localhost:3000/api/v1/users/profile'
        );
        const fetchedUserId = profileResponse.data.data.user_id;
        setUserId(fetchedUserId);

        socketRef.current = io('http://localhost:3000', { transports: ['websocket'] });

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
        const response = await authorizedAxiosInstance.get<ApiResponse>(
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

  if (loading) {
    return <div className={styles.wrapper}>Đang tải...</div>;
  }

  if (error || !post) {
    return <div className={styles.wrapper}>{error || "Không tìm thấy bài viết"}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={handleBack}>
        <img src={backIcon} alt="Quay lại" />
        Quay lại
      </button>

      <div className={styles.container}>
        <div className={styles.postContent}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <div className={styles.profilePic}></div>
              <div>
                <div
                  className={styles.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserNavigation();
                  }}
                >
                  {post.user_name}
                </div>
                <div className={styles.timestamp}>{formatRelativeTime(post.date_updated)}</div>
              </div>
            </div>
            <div className={styles.dotsContainer}>
              <button className={styles.dotsButton} onClick={() => setShowPopup(!showPopup)}>⋮</button>
              {showPopup && (
                <div ref={popupRefs.current[0] = popupRefs.current[0] || React.createRef()}>
                  <ReportPopup type="Post" user_id={post.user_id} post_id={post.post_id} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.title}>{post.post_title}</div>
          <div className={styles.content}>{post.post_content}</div>

          <div className={styles.postTags}>
            {post.tags && post.tags.length > 0 && post.tags.map((tag, index) => (
              <button key={index} className={styles.tagButton} onClick={() => handleTagClick()}>
                #{tag}
              </button>
            ))}
          </div>

          {post.img_url && post.img_url.length > 0 && (
            post.img_url.length > 1 ? (
              <div className={styles.swiperContainer}>
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  style={{ width: '100%', height: 'auto' }}
                >
                  {post.img_url.map((image, index) => (
                    <SwiperSlide key={index} style={{ width: '100%' }}>
                      <img
                        src={image}
                        alt={`Hình ảnh bài viết ${index + 1}`}
                        className={styles.swiperImage}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <img src={post.img_url[0]} alt="Hình ảnh bài viết" className={styles.singleImage} />
            )
          )}

          <div className={styles.interactions}>
            <button className={styles.button} onClick={handleLike}>
              <img src={liked ? likeFilled : like} alt="Thích" />
              {currentLikes}
            </button>
            <button className={styles.button} onClick={handleDislike}>
              <img src={disliked ? dislikeFilled : dislike} alt="Không thích" />
              {currentDislikes}
            </button>
            <button className={styles.button}>
              <img src={commentIcon} alt="Bình luận" />
              {commentsList.length}
            </button>
          </div>

          <div className={styles.commentSection}>
            <div className={styles.commentBox}>
              <textarea
                className={styles.commentInput}
                placeholder="Viết bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className={styles.circularButton} onClick={handleAddComment}>
                <img src={sendIcon} alt="Gửi" />
              </button>
            </div>

            <div className={styles.commentList}>
              {commentsList.map((item, index) => {
                if (!popupRefs.current[index]) {
                  popupRefs.current[index] = React.createRef<HTMLDivElement>();
                }
                return (
                  <div key={item.comment_id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <div className={styles.userInfo}>
                        <div className={styles.commentAvatar}></div>
                        <span className={styles.commentUsername}>{item.userName}</span>
                        <span className={styles.timestamp}>{formatRelativeTime(item.timestamp)}</span>
                      </div>
                      <div className={styles.dotsContainer}>
                        <button
                          className={styles.dotsButton}
                          onClick={() => setActiveCommentIndex(index)}
                        >
                          ⋮
                        </button>
                        {activeCommentIndex === index && (
                          <div ref={popupRefs.current[index]}>
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

                    <div className={styles.commentText}>{item.text}</div>
                    <div className={styles.commentActions}>
                      <button
                        className={styles.commentActionButton}
                        onClick={() => handleCommentReply(index)}
                      >
                        <img src={item.replied ? replyFilled : replyIcon} alt="Trả lời" />
                        {item.replyCount}
                      </button>
                    </div>

                    {item.replied && (
                      <div className={styles.commentBox}>
                        <textarea
                          className={styles.replyInput}
                          placeholder="Viết trả lời..."
                          value={item.replyText || ''}
                          onChange={(e) => handleReplyInputChange(index, e.target.value)}
                        />
                        <button
                          className={styles.circularButton}
                          onClick={(e) => handlePostReply(index, e)}
                          disabled={isSendingReply}
                        >
                          <img src={sendIcon} alt="Gửi trả lời" />
                        </button>
                      </div>
                    )}

                    {item.replies.length > 0 && (
                      <div className={styles.replyList}>
                        {item.replies.map((reply, replyIndex) => (
                          <div key={reply.comment_id} className={styles.replyItem}>
                            <div className={styles.replyHeader}>
                              <div className={styles.replyAvatar}></div>
                              <span className={styles.replyUserName}>{reply.userName}</span>
                              <span className={styles.timestamp}>{formatRelativeTime(reply.timestamp)}</span>
                            </div>
                            <div className={styles.replyText}>{reply.text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;