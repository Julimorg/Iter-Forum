import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap');

          body {
            font-family: 'Lexend', sans-serif;
            display: flex;
            margin: 0;
            height: 100vh;
            overflow: hidden;
          }

          .blank {
            margin: 0;
            height: 60px;
          }

          .sidebar {
            width: 250px;
            background-color: #f8f9fa;
            padding: 20px;
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
            padding: 10px;
            border-radius: 4px;
            transition: background-color 0.3s;
            justify-content: space-between;
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
            justify-content: space-between;
            min-height: 60px;
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
            margin-left: 270px;
            padding: 20px;
            flex-grow: 1;
          }
        `}
      </style>
      <div className="sidebar">
        <div className="blank"></div>
        <nav>
          <ul>
            <li><Link to="/home" onClick={scrollToTop}>Home</Link></li>
            <li><Link to="/home/popular" onClick={scrollToTop}>Popular</Link></li>
            <li><Link to="/home/explore" onClick={scrollToTop}>Explore</Link></li>
          </ul>
        </nav>
        <div className="subscribed-tags">
          <h3>SUBSCRIBED TAGS</h3>
          <ul>
            <li>
              <Link to="/working-experience">
                <span className="tag-name">Working Experience</span>
                <span className="new-posts">5 NEW POSTS</span>
              </Link>
            </li>
            <li>
              <Link to="/intern">
                <span className="tag-name">Intern</span>
                <span className="new-posts">16 NEW POSTS</span>
              </Link>
            </li>
            <li>
              <Link to="/all-tags"><span className="tag-name">All Subscribed tags</span></Link>
            </li>
          </ul>
        </div>
        <div className="about-us">
          <h3>ABOUT US</h3>
          <ul>
            <li><Link to="/about"><i className="fas fa-info-circle"></i> About</Link></li>
            <li><Link to="/rules"><i className="fas fa-gavel"></i> Rules</Link></li>
            <li><Link to="/privacy-policy"><i className="fas fa-shield-alt"></i> Privacy Policy</Link></li>
            <li><Link to="/user-agreement"><i className="fas fa-file-contract"></i> User Agreement</Link></li>
          </ul>
        </div>
        <div className="advanced">
          <ul>
            <li><Link to="/logout"><i className="fas fa-sign-out-alt"></i> Log out</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
