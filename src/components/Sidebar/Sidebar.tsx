import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Home from '../../assets/home.png';
import Popular from '../../assets/popular.png';
import Explore from '../../assets/explore.png';
import ExpandIcon from '../../assets/expand.png';
import CollapseIcon from '../../assets/collapse.png';
import styles from './Sidebar.module.css';
import axios from 'axios';
import { API_BE } from '../../config/configApi';

interface TagSubscribed {
  tag_title: string;
  post_count: number;
  tag_id: string;
}

interface SidebarProps {
  onSignOutClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSignOutClick }) => {
  const [subscribedTags, setSubscribedTags] = useState<TagSubscribed[]>([]);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchSubscribedTags = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('No access token found in localStorage');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BE}/api/v1/recommend`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const subscribedTagsData = response.data.data.subscribed_tags;
        setSubscribedTags(subscribedTagsData);
      } catch (error) {
        console.error('Error fetching subscribed tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribedTags();
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap');

          body {
            font-family: 'Lexend', sans-serif;
            margin: 0;
          }

          .blank {
            margin: 0;
            height: 5vh;
          }

          .sidebar {
            width: 20vw;
            min-width: 250px;
            max-width: 300px;
            background-color: #f8f9fa;
            padding: 2vh 2vw;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            overflow-y: auto;
          }

          .sidebar nav ul,
          .sidebar .subscribed-tags ul,
          .sidebar .about-us ul,
          .sidebar .advanced ul {
            list-style-type: none;
            padding: 0;
          }

          .sidebar nav ul li,
          .sidebar .subscribed-tags ul li,
          .sidebar .about-us ul li,
          .sidebar .advanced ul li {
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
          }

          .sidebar nav ul li a,
          .sidebar .subscribed-tags ul li a,
          .sidebar .about-us ul li a,
          .sidebar .advanced ul li a,
          .sidebar .new-posts {
            text-decoration: none;
            color: #000;
            display: flex;
            align-items: center;
            padding: 1vh 1vw;
            border-radius: 4px;
            transition: background-color 0.3s;
            justify-content: flex-start;
            gap: 20px;
          }

          .sidebar .subscribed-tags ul li a {
            flex-direction: column;
            align-items: flex-start;
          }

          .sidebar .subscribed-tags h3,
          .sidebar .about-us h3 {
            margin-bottom: 10px;
            font-size: 14px;
            color: #6c757d;
          }

          .sidebar .subscribed-tags ul li {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 0.5rem;
            min-height: 6vh;
          }

          .sidebar .subscribed-tags ul li .tag-name {
            margin-bottom: 5px;
          }

          .sidebar .new-posts {
            font-size: 12px;
            color: #6c757d;
          }

          .sidebar nav ul li a.active,
          .sidebar nav ul li a:hover,
          .sidebar .subscribed-tags ul li a:hover,
          .sidebar .about-us ul li a:hover,
          .sidebar .advanced ul li a:hover {
            background-color: #e9ecef;
          }

          .main-content {
            margin-left: calc(20vw + 2vw);
            padding: 2vh 2vw;
            flex-grow: 1;
          }
          .buttonLogOut {
            border: none;
            background-color: #f8f9fa;
            display: flex;
            align-items: center;
            padding: 1vh 1vw;
            transition: background-color 0.3s;
            justify-content: flex-start;
            gap: 20px;
          }
          .buttonLogOut:hover {
            background-color: #e9ecef;
            cursor: pointer;
          }
        `}
      </style>
      <div className="sidebar">
        <div className="blank"></div>
        <nav>
          <ul>
            <li>
              <Link to="/home" onClick={scrollToTop}>
                <img src={Home} alt="Home" />
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/home/popular" onClick={scrollToTop} className={styles.navLink}>
                <img src={Popular} alt="Popular" />
                Popular
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/home/explore" onClick={scrollToTop} className={styles.navLink}>
                <img src={Explore} alt="Explore" />
                Explore
              </Link>
            </li>
          </ul>
        </nav>

        {/* Subscribed tags */}
        <div>
          <h3 className={styles.subscribedTagsHeader}>SUBSCRIBED TAGS</h3>
          {isLoading ? (
            <div>Loading subscribed tags...</div>
          ) : (
            <ul className={styles.tagList}>
              {(showAllTags ? subscribedTags : subscribedTags.slice(0, 3)).map((tag, index) => (
                <li key={index} className={styles.tagItem}>
                  <Link
                    to={`/home/tag/${tag.tag_id}`}
                    className={styles.tagLink}
                  >
                    <span className={styles.tagName}>{tag.tag_title} {tag.post_count} </span>
                  </Link>
                </li>
              ))}

              {/* Nút "Show All" hoặc "Collapse" */}
              {subscribedTags.length > 3 && (
                <li className={styles.tagItem}>
                  <button
                    className={`${styles.tagLink} ${styles.tagItemButton}`}
                    onClick={() => setShowAllTags(!showAllTags)}
                  >
                    <span className={styles.tagName}>
                      <img
                        src={showAllTags ? CollapseIcon : ExpandIcon}
                        alt={showAllTags ? 'Collapse' : 'Expand'}
                        className={styles.tagIcon}
                      />
                      {showAllTags ? 'Collapse' : 'Show All'}
                    </span>
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* About Us */}
        <div>
          <h3 className={styles.aboutUsHeader}>ABOUT US</h3>
          <ul className={styles.tagList}>
            <li>
              <Link to="/about" className={styles.aboutUsLink}>
                <i className="fas fa-info-circle"></i> About
              </Link>
            </li>
            <li>
              <Link to="/rules" className={styles.aboutUsLink}>
                <i className="fas fa-gavel"></i> Rules
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className={styles.aboutUsLink}>
                <i className="fas fa-shield-alt"></i> Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/user-agreement" className={styles.aboutUsLink}>
                <i className="fas fa-file-contract"></i> User Agreement
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <div>
          <ul className={styles.tagList}>
            <li>
              <button onClick={onSignOutClick} className="buttonLogOut">
                <i className="fas fa-sign-out-alt"></i>
                <p>Log out</p>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;