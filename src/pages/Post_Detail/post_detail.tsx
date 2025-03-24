import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './post_detail.module.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import commentIcon from '../../assets/comment.png';
import likeFilled from '../../assets/like_filled.png';
import dislikeFilled from '../../assets/dislike_filled.png';
import replyIcon from '../../assets/comment.png';
import replyFilled from '../../assets/comment.png';
import backIcon from '../../assets/back_arrow.png';
import Trending from '../../assets/trending.png'; // Đã có sẵn
import Bell from '../../assets/bell.png';
import sendIcon from '../../assets/send.png';
import ReportPopup from '../../components/Report_Popup/Report_popup';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

// Cập nhật interface PostState để nhận images thay vì image
interface PostState {
  user: string;
  caption: string;
  images?: string[];
  likes: number;
  dislikes: number;
  tags: string[];
  comments: number;
  isTrending?: boolean;
}

const PostDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, caption, images = [], likes, dislikes, tags, comments, isTrending } = (location.state as PostState) || {};

  const [currentLikes, setCurrentLikes] = useState<number>(likes || 0);
  const [currentDislikes, setCurrentDislikes] = useState<number>(dislikes || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [activeCommentIndex, setActiveCommentIndex] = useState<number | null>(null);

  const popupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (popupRefs.current[0] && !popupRefs.current[0]?.contains(event.target as Node)) {
        setShowPopup(false);
      }
      if (
        activeCommentIndex !== null &&
        popupRefs.current[activeCommentIndex] &&
        !popupRefs.current[activeCommentIndex]?.contains(event.target as Node)
      ) {
        setActiveCommentIndex(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeCommentIndex]);

  const tagContent = {
    ReactJS: "Learn about ReactJS, the powerful JavaScript library for building user interfaces.",
    JavaScript: "Discover the versatility of JavaScript, the language of the web.",
    "Web Development": "Explore the world of web development and modern technologies.",
  };

  const [showTags, setShowTags] = useState<boolean>(true);
  const [tagStatus, setTagStatus] = useState<Record<string, boolean>>({
    ReactJS: false,
    JavaScript: false,
    "Web Development": true,
  });

  const handleSubscribeToggle = (tag: string) => {
    setTagStatus((prevStatus) => ({
      ...prevStatus,
      [tag]: !prevStatus[tag],
    }));
  };

  const handleClearTags = () => {
    setShowTags(false);
  };

  interface ReplyItem {
    text: string;
    userName: string;
  }

  interface CommentItem {
    text: string;
    likeCount: number;
    dislikeCount: number;
    replyCount: number;
    liked: boolean;
    disliked: boolean;
    replied: boolean;
    replyText?: string;
    replies: ReplyItem[];
  }

  const [commentsList, setComments] = useState<CommentItem[]>([
    {
      text: "Sample comment",
      likeCount: 0,
      dislikeCount: 0,
      replyCount: 0,
      liked: false,
      disliked: false,
      replied: false,
      replyText: '',
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setCurrentLikes((prev) => prev - 1);
    } else {
      if (disliked) {
        setDisliked(false);
        setCurrentDislikes((prev) => prev - 1);
      }
      setLiked(true);
      setCurrentLikes((prev) => prev + 1);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setCurrentDislikes((prev) => prev - 1);
    } else {
      if (liked) {
        setLiked(false);
        setCurrentLikes((prev) => prev - 1);
      }
      setDisliked(true);
      setCurrentDislikes((prev) => prev + 1);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentItem: CommentItem = {
        text: newComment,
        likeCount: 0,
        dislikeCount: 0,
        replyCount: 0,
        liked: false,
        disliked: false,
        replied: false,
        replyText: '',
        replies: [],
      };
      setComments((prev) => [...prev, newCommentItem]);
      setNewComment('');
    }
  };

  const handleCommentLike = (index: number) => {
    setComments((prevComments) =>
      prevComments.map((comment, i) => {
        if (i === index) {
          const isLiked = !comment.liked;
          return {
            ...comment,
            liked: isLiked,
            disliked: isLiked ? false : comment.disliked,
            likeCount: isLiked ? comment.likeCount + 1 : comment.likeCount - 1,
            dislikeCount: isLiked && comment.disliked ? comment.dislikeCount - 1 : comment.dislikeCount,
          };
        }
        return comment;
      })
    );
  };

  const handleCommentDislike = (index: number) => {
    setComments((prevComments) =>
      prevComments.map((comment, i) => {
        if (i === index) {
          const isDisliked = !comment.disliked;
          return {
            ...comment,
            disliked: isDisliked,
            liked: isDisliked ? false : comment.liked,
            dislikeCount: isDisliked ? comment.dislikeCount + 1 : comment.dislikeCount - 1,
            likeCount: isDisliked && comment.liked ? comment.likeCount - 1 : comment.likeCount,
          };
        }
        return comment;
      })
    );
  };

  const handleCommentReply = (index: number) => {
    setComments((prevComments) =>
      prevComments.map((comment, i) => {
        if (i === index) {
          return {
            ...comment,
            replied: !comment.replied,
          };
        }
        return comment;
      })
    );
  };

  const handleReplyInputChange = (index: number, text: string) => {
    setComments((prevComments) =>
      prevComments.map((comment, i) => {
        if (i === index) {
          return {
            ...comment,
            replyText: text,
          };
        }
        return comment;
      })
    );
  };

  const handlePostReply = (index: number) => {
    setComments((prevComments) =>
      prevComments.map((comment, i) => {
        if (i === index && comment.replyText?.trim()) {
          const newReply: ReplyItem = {
            text: comment.replyText,
            userName: "User",
          };
          return {
            ...comment,
            replies: [...comment.replies, newReply],
            replyText: '',
            replyCount: comment.replyCount + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleTagClick = (tag: string) => {
    navigate(`/home/tag/${encodeURIComponent(tag)}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  if (!user || !caption) {
    return <div className={styles.error}>Error: Missing data for the post.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={handleBack}>
        <img src={backIcon} alt="Back" />
        Back
      </button>

      <div className={styles.container}>
        <div className={styles.postContent}>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <div className={styles.profilePic}></div>
              <div className={styles.name}>{user}</div>
            </div>
            <div className={styles.dotsContainer}>
              <button className={styles.dotsButton} onClick={() => setShowPopup(!showPopup)}>⋮</button>
              {showPopup && (
                <div ref={(el) => { popupRefs.current[0] = el; }}>
                  <ReportPopup type='post' />
                </div>
              )}
            </div>
          </div>

          <div className={styles.caption}>{caption}</div>

          <div className={styles.postTags}>
            {isTrending && (
              <div className={styles.trending}>
                <img src={Trending} alt="Trending" style={{ marginRight: '0.5rem' }} />
                Trending
              </div>
            )}
            {tags && tags.length > 0 && tags.map((tag, index) => (
              <button key={index} className={styles.tagButton} onClick={() => handleTagClick(tag)}>
                #{tag}
              </button>
            ))}
          </div>
          {images.length > 0 && (
            images.length > 1 ? (
              <div className={styles.swiperContainer}>
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  style={{ width: '100%', height: 'auto' }}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index} style={{ width: '100%' }}>
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className={styles.swiperImage}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <img src={images[0]} alt="Post image" className={styles.singleImage} />
            )
          )}

          <div className={styles.interactions}>
            <button className={styles.button} onClick={handleLike}>
              <img src={liked ? likeFilled : like} alt="Like" />
              {currentLikes}
            </button>
            <button className={styles.button} onClick={handleDislike}>
              <img src={disliked ? dislikeFilled : dislike} alt="Dislike" />
              {currentDislikes}
            </button>
            <button className={styles.button}>
              <img src={commentIcon} alt="Comments" />
              {commentsList.length}
            </button>
          </div>

          <div className={styles.commentSection}>
            <div className={styles.commentBox}>
              <textarea
                className={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className={styles.circularButton} onClick={handleAddComment}>
                <img src={sendIcon} alt="Send" />
              </button>
            </div>

            <div className={styles.commentList}>
              {commentsList.map((item, index) => (
                <div key={index} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.userInfo}>
                      <div className={styles.commentAvatar}></div>
                      <span className={styles.commentUsername}>User</span>
                    </div>
                    <div className={styles.dotsContainer}>
                      <button
                        className={styles.dotsButton}
                        onClick={() => setActiveCommentIndex(index)}
                      >
                        ⋮
                      </button>
                      {activeCommentIndex === index && (
                        <div ref={(el) => { popupRefs.current[index] = el; }}>
                          <ReportPopup type='comment' />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.commentText}>{item.text}</div>
                  <div className={styles.commentActions}>
                    <button className={styles.commentActionButton} onClick={() => handleCommentLike(index)}>
                      <img src={item.liked ? likeFilled : like} alt="Like" />
                      {item.likeCount}
                    </button>
                    <button className={styles.commentActionButton} onClick={() => handleCommentDislike(index)}>
                      <img src={item.disliked ? dislikeFilled : dislike} alt="Dislike" />
                      {item.dislikeCount}
                    </button>
                    <button className={styles.commentActionButton} onClick={() => handleCommentReply(index)}>
                      <img src={item.replied ? replyFilled : replyIcon} alt="Reply" />
                      {item.replyCount}
                    </button>
                  </div>

                  {item.replied && (
                    <div className={styles.commentBox}>
                      <textarea
                        className={styles.replyInput}
                        placeholder="Write a reply..."
                        value={item.replyText || ''}
                        onChange={(e) => handleReplyInputChange(index, e.target.value)}
                      />
                      <button className={styles.circularButton} onClick={() => handlePostReply(index)}>
                        <img src={sendIcon} alt="Send Reply" />
                      </button>
                    </div>
                  )}

                  <div className={styles.replyList}>
                    {item.replies.map((reply, replyIndex) => (
                      <div key={replyIndex} className={styles.replyItem}>
                        <div className={styles.replyHeader}>
                          <div className={styles.replyAvatar}></div>
                          <span className={styles.replyUserName}>User</span>
                        </div>
                        <div className={styles.replyText}>{reply.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;