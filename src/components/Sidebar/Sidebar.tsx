import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Home from '../../assets/home.png';
import Popular from '../../assets/popular.png';
import Explore from '../../assets/explore.png';
import styles from './Sidebar.module.css'; // Import CSS module

const Sidebar: React.FC = () => {
  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {/* Subscribed tags */}
        <div>
          <h3 className={styles.subscribedTagsHeader}>SUBSCRIBED TAGS</h3>
          <ul className={styles.tagList}>

            <li className={styles.tagItem}>
              <Link to={`/home/tag/${encodeURIComponent('Web Development')}`} className={styles.tagLink}>
                <span className={styles.tagName}>Web Development</span>
                <span className={styles.newPosts}>5 NEW POSTS</span>
              </Link>
            </li>

            <li className={styles.tagItem}>
              <Link to={`/home/tag/${encodeURIComponent('JavaScript')}`} className={styles.tagLink}>
                <span className={styles.tagName}>JavaScript</span>
                <span className={styles.newPosts}>16 NEW POSTS</span>
              </Link>
            </li>

            <li className={styles.tagItem}>
              <Link to={`/home/tag/${encodeURIComponent('ReactJS')}`} className={styles.tagLink}>
                <span className={styles.tagName}>ReactJS</span>
                <span className={styles.newPosts}>1 NEW POST</span>
              </Link>
            </li>

            {/* All Subscribed Tags */}
            <li className={styles.tagItem}>
              <Link to={`/home/all-subscribed-tags`} className={styles.tagLink}>
                <span className={styles.tagName}>All Subscribed tags</span>
              </Link>
            </li>
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
              <Link to="/logout" className={styles.logoutLink}>
                <i className="fas fa-sign-out-alt"></i> Log out
              </Link>
            </li>
          </ul>
        </div>

    </div>
  );
};

export default Sidebar;
