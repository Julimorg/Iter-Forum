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

  // Định nghĩa kiểu cho CommentItem
  interface CommentItem {
    text: string;
    likeCount: number;
    dislikeCount: number;
    replyCount: number;
    liked: boolean;
    disliked: boolean;
    replied: boolean;
  }
  
  // Sử dụng state cho comments (mảng các CommentItem)
  const [comments, setComments] = useState<CommentItem[]>([]);
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
        likeCount: 0,
        dislikeCount: 0,
        replyCount: 0,
        liked: false,
        disliked: false,
        replied: false,
      };
      setComments(prev => [...prev, newCommentItem]);
      setNewComment('');
    }
  };

  // Xử lý like cho comment theo index
  const handleCommentLike = (index: number) => {
    setComments(prevComments => {
      const newComments = [...prevComments];
      const current = newComments[index];
      if (current.liked) {
        current.liked = false;
        current.likeCount -= 1;
      } else {
        if (current.disliked) {
          current.disliked = false;
          current.dislikeCount -= 1;
        }
        current.liked = true;
        current.likeCount += 1;
      }
      return newComments;
    });
  };

  // Xử lý dislike cho comment theo index
  const handleCommentDislike = (index: number) => {
    setComments(prevComments => {
      const newComments = [...prevComments];
      const current = newComments[index];
      if (current.disliked) {
        current.disliked = false;
        current.dislikeCount -= 1;
      } else {
        if (current.liked) {
          current.liked = false;
          current.likeCount -= 1;
        }
        current.disliked = true;
        current.dislikeCount += 1;
      }
      return newComments;
    });
  };

  // Xử lý reply cho comment theo index (toggle reply)
  const handleCommentReply = (index: number) => {
    setComments(prevComments => {
      const newComments = [...prevComments];
      const current = newComments[index];
      if (current.replied) {
        current.replied = false;
        current.replyCount -= 1;
      } else {
        current.replied = true;
        current.replyCount += 1;
      }
      return newComments;
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
    <div className={styles.container}>
      {/* Nút Back */}
      <button className={styles.backButton} onClick={handleBack}>
        <img
          src={backIcon}
          alt="Back"
          style={{ width: '16px', height: '16px', marginRight: '8px' }}
        />
        Back
      </button>

      <div className={styles.header}>
        <div className={styles.profilePic}></div>
        <div className={styles.name}>{user}</div>
      </div>
      <div className={styles.caption}>{caption}</div>
      
      {/* Hiển thị Trending nếu isTrending true */}
      {isTrending && (
        <div className={styles.trending}>
          <img
            src={Trending}
            alt="Trending"
            style={{ width: '16px', height: '16px', marginRight: '8px' }}
          />
          Trending
        </div>
      )}
      
      {/* Hiển thị các tag của bài post */}
      {tags && tags.length > 0 && (
        <div className={styles.postTags}>
          {tags.map((tag: string, index: number) => (
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
        {/* Danh sách comment */}
        <div className={styles.commentList}>
          {comments.map((item, index) => (
            <div key={index} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <div className={styles.commentAvatar}></div>
                <span className={styles.commentUsername}>User</span>
              </div>
              <div className={styles.commentText}>{item.text}</div>
              <div className={styles.commentActions}>
                <button
                  className={styles.commentActionButton}
                  onClick={() => handleCommentLike(index)}
                >
                  <img 
                    src={item.liked ? likeFilled : like} 
                    alt="Like" 
                    style={{ width: '14px', height: '14px', marginRight: '4px' }} 
                  />
                  {item.likeCount}
                </button>
                <button
                  className={styles.commentActionButton}
                  onClick={() => handleCommentDislike(index)}
                >
                  <img 
                    src={item.disliked ? dislikeFilled : dislike} 
                    alt="Dislike" 
                    style={{ width: '14px', height: '14px', marginRight: '4px' }} 
                  />
                  {item.dislikeCount}
                </button>
                <button
                  className={styles.commentActionButton}
                  onClick={() => handleCommentReply(index)}
                >
                  <img 
                    src={item.replied ? replyFilled : replyIcon} 
                    alt="Reply" 
                    style={{ width: '14px', height: '14px', marginRight: '4px' }} 
                  />
                  {item.replyCount}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
