import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Home from '../../assets/home.png';
import Popular from '../../assets/popular.png';
import Explore from '../../assets/explore.png';
import styles from './Sidebar.module.css'; // Import CSS module
import ExpandIcon  from '../../assets/expand.png';
import CollapseIcon from '../../assets/collapse.png';

interface SiderbarProps{
  onSignOutClick?: () => void;
}
const Sidebar: React.FC<SiderbarProps>= ({onSignOutClick}) => {

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  const subscribedTags = [
    { name: 'JavaScript' },
    { name: 'ReactJS' },
    { name: 'CSS' },
    { name: 'NodeJS' },
    { name: 'Python' },
    { name: 'Machine Learning' },
    { name: 'Data Science' },
    { name: 'Gaming' },
    { name: 'AI' },
    { name: 'Web Development' },
  ];
  

  return (
    <div className={styles.sidebar}>
      {/* Điều hướng */}
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/home" onClick={scrollToTop} className={styles.navLink}>
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
        <div>
          <h3 className={styles.subscribedTagsHeader}>SUBSCRIBED TAGS</h3>
          <ul className={styles.tagList}>
            {(showAllTags ? subscribedTags : subscribedTags.slice(0, 3)).map((tag, index) => (
              <li key={index} className={styles.tagItem}>
                <Link
                  to={`/home/tag/${encodeURIComponent(tag.name)}`}
                  className={styles.tagLink}
                >
                  <span className={styles.tagName}>{tag.name}</span>
                </Link>
              </li>
            ))}

          {/* Nút "Show All" hoặc "Collapse" */}
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

          
        </div>
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
              <button onClick={onSignOutClick} className={styles.logoutLink}>
                <i className="fas fa-sign-out-alt"></i> Log out
              </button>
            </li>
          </ul>
        </div>

    </div>
  );
};

export default Sidebar;
