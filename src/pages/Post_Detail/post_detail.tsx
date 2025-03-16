import React, { useState } from 'react';
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
import Trending from '../../assets/trending.png';
import Bell from '../../assets/bell.png';

interface PostState {
  user: string;
  caption: string;
  image?: string;
  likes: number;
  dislikes: number;
  tags: string[];
  isTrending?: boolean;
}

const PostDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Sử dụng type assertion để khai báo rõ loại của location.state  
  const { user, caption, image, likes, dislikes, tags, isTrending } = (location.state as PostState) || {};

  const [currentLikes, setCurrentLikes] = useState<number>(likes || 0);
  const [currentDislikes, setCurrentDislikes] = useState<number>(dislikes || 0);  
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  
  // Thêm state để kiểm soát hiển thị tag
  const [showTags, setShowTags] = useState<boolean>(true);

  // Hàm xử lý khi ấn "Clear"
  const handleClearTags = () => {
    setShowTags(false);
  };


  // Định nghĩa kiểu cho CommentItem
  // Định nghĩa kiểu cho CommentItem
  interface ReplyItem {
    text: string; // Nội dung reply
    userName: string; // Tên người reply (tạm thời là "User")
  }
  
  
  interface CommentItem {
    text: string;
    likeCount: number;
    dislikeCount: number;
    replyCount: number;
    liked: boolean;
    disliked: boolean;
    replied: boolean; // Trạng thái đã bật reply
    replyText?: string; // Nội dung reply đang nhập
    replies: ReplyItem[]; // Mảng các reply
  }
  
  

  
  // Sử dụng state cho comments (mảng các CommentItem)
  const [comments, setComments] = useState<CommentItem[]>([
    {
      text: "Sample comment",
      likeCount: 0,
      dislikeCount: 0,
      replyCount: 0,
      liked: false,
      disliked: false,
      replyText: '',
      replies: [],
      replied: false,
    },
  ]);
  
  const [newComment, setNewComment] = useState('');

  // Xử lý like cho bài đăng chính
  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setCurrentLikes(prev => prev - 1);
    } else {
      if (disliked) {
        setDisliked(false);
        setCurrentDislikes(prev => prev - 1);
      }
      setLiked(true);
      setCurrentLikes(prev => prev + 1);
    }
  };

  // Xử lý dislike cho bài đăng chính
  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setCurrentDislikes(prev => prev - 1);
    } else {
      if (liked) {
        setLiked(false);
        setCurrentLikes(prev => prev - 1);
      }
      setDisliked(true);
      setCurrentDislikes(prev => prev + 1);
    }
  };

  // Xử lý thêm comment mới
const handleAddComment = () => {
  if (newComment.trim()) {
    const newCommentItem: CommentItem = {
      text: newComment,
      likeCount: 0, // Bắt đầu với 0 like
      dislikeCount: 0, // Bắt đầu với 0 dislike
      replyCount: 0, // Bắt đầu với 0 reply
      liked: false, // Chưa like
      disliked: false, // Chưa dislike
      replied: false, // Chưa reply
      replyText: '', // Nội dung reply rỗng
      replies: [], // Mảng các reply rỗng
    };
    setComments(prev => [...prev, newCommentItem]);
    setNewComment('');
  }
};

// Xử lý like cho comment
// Xử lý like cho comment
const handleCommentLike = (index: number) => {
  setComments(prevComments =>
    prevComments.map((comment, i) => {
      if (i === index) {
        const isLiked = !comment.liked;
        return {
          ...comment,
          liked: isLiked,
          disliked: isLiked ? false : comment.disliked, // Remove dislike if now liked
          likeCount: isLiked ? comment.likeCount + 1 : comment.likeCount - 1,
          dislikeCount: isLiked && comment.disliked ? comment.dislikeCount - 1 : comment.dislikeCount,
        };
      }
      return comment;
    })
  );
};

// Xử lý dislike cho comment
const handleCommentDislike = (index: number) => {
  setComments(prevComments =>
    prevComments.map((comment, i) => {
      if (i === index) {
        const isDisliked = !comment.disliked;
        return {
          ...comment,
          disliked: isDisliked,
          liked: isDisliked ? false : comment.liked, // Remove like if now disliked
          dislikeCount: isDisliked ? comment.dislikeCount + 1 : comment.dislikeCount - 1,
          likeCount: isDisliked && comment.liked ? comment.likeCount - 1 : comment.likeCount,
        };
      }
      return comment;
    })
  );
};



// Xử lý reply toggle
const handleCommentReply = (index: number) => {
  setComments(prevComments => {
    return prevComments.map((comment, i) => {
      if (i === index) {
        return {
          ...comment,
          replied: !comment.replied, // Toggle trạng thái replied
        };
      }
      return comment;
    });
  });
};


// Xử lý nội dung reply
const handleReplyInputChange = (index: number, text: string) => {
  setComments(prevComments => {
    return prevComments.map((comment, i) => {
      if (i === index) {
        return {
          ...comment,
          replyText: text, // Cập nhật nội dung reply
        };
      }
      return comment;
    });
  });
};

// Đăng reply
const handlePostReply = (index: number) => {
  setComments(prevComments => {
    return prevComments.map((comment, i) => {
      if (i === index && comment.replyText?.trim()) {
        const newReply: ReplyItem = {
          text: comment.replyText, // Nội dung reply
          userName: "User", // Tên người reply tạm thời
        };

        return {
          ...comment,
          replies: [...comment.replies, newReply], // Thêm reply vào danh sách replies
          replyText: '', // Xóa nội dung sau khi đăng
          replyCount: comment.replyCount + 1, // Cập nhật số lượng reply
        };
      }
      return comment;
    });
  });
};



  // Xử lý khi nhấn tag (nếu cần)
  const handleTagClick = (tag: string) => {
    navigate(`/home/tag/${encodeURIComponent(tag)}`);
  };

  // Hàm quay lại trang home (nút Back)
  const handleBack = () => {
    navigate("/home");
  };

  if (!user || !caption) {
    return <div className={styles.error}>Error: Missing data for the post.</div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* Nút Back */}
      <button className={styles.backButton} onClick={handleBack}>
        <img src={backIcon} alt="Back" />
        Back
      </button>
  
      {/* Container chính của bài post */}
      <div className={styles.container}>
        <div className={styles.postContent}>
          {/* Nội dung bài post */}
          <div className={styles.header}>
            <div className={styles.profilePic}></div>
            <div className={styles.name}>{user}</div>
          </div>
          <div className={styles.caption}>{caption}</div>
  
          {isTrending && (
            <div className={styles.trending}>
              <img src={Trending} alt="Trending" />
              Trending
            </div>
          )}
  
          {/* Hiển thị các tag của bài post */}
          {tags && tags.length > 0 && (
            <div className={styles.postTags}>
              {tags.map((tag, index) => (
                <button key={index} className={styles.tagButton} onClick={() => handleTagClick(tag)}>
                  #{tag}
                </button>
              ))}
            </div>
          )}
  
          <div className={styles.imagePlaceholder}></div>
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
              {comments.length}
            </button>
          </div>
  
          {/* Phần bình luận */}
          <div className={styles.commentSection}>
            <textarea
              className={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className={styles.commentButton} onClick={handleAddComment}>
              Post
            </button>
  
            {/* Danh sách bình luận */}
            <div className={styles.commentList}>
              {comments.map((item, index) => (
                <div key={index} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAvatar}></div>
                    <span className={styles.commentUsername}>User</span>
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
  
                  {/* Khu vực nhập reply */}
                  {item.replied && (
                    <div className={styles.replySection}>
                      <textarea
                        className={styles.replyInput}
                        placeholder="Write a reply..."
                        value={item.replyText || ''}
                        onChange={(e) => handleReplyInputChange(index, e.target.value)}
                      />
                      <button className={styles.replyButton} onClick={() => handlePostReply(index)}>
                        Reply
                      </button>
                    </div>
                  )}
  
                  {/* Hiển thị các reply */}
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
        </div> {/* Kết thúc div .postContent */}
      </div> {/* Kết thúc div .container */}
  
      {/* Chỉ hiển thị nếu showTags === true */}
      {showTags && (
        <div className={styles.tagSection}>
          <div className={styles.tagHeader}>
            <span className={styles.tagTitle}>TAGS</span>
            <button className={styles.clearTags} onClick={handleClearTags}>Clear</button>
          </div>

          <div className={styles.tagItem}>
            <div className={styles.tagInfo}>
              <span className={styles.tagName}>Sharing</span>
              <span className={styles.trending}><img src={Trending} alt='Trending'/> Trending</span>
              <button className={styles.subscribeButton}>Subscribe</button>
            </div>
            <span className={styles.tagPosts}>14,045 POSTS</span>
            <p className={styles.tagDescription}>Share your knowledge for everyone!</p>
          </div>

          <div className={styles.tagItem}>
            <div className={styles.tagInfo}>
              <span className={styles.tagName}>Working Experience</span>
              <button className={styles.subscribedButton}>
                <img src={Bell} alt="Bell" />
                Subscribed
              </button>
            </div>
            <span className={styles.tagPosts}>2,345 POSTS</span>
            <p className={styles.tagDescription}>Have something to share with new comers?</p>
          </div>
        </div>
      )}

    </div>
  );
  
};

export default PostDetail;
