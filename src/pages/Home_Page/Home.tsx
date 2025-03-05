import React from 'react';
import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import styles from './home.module.css'
import Header from '../../components/Header_HomePage/Header';
import Footer from '../../components/Footer_HomePage/Footer';

// ? API HANDLER LOGIC ONLY


const Home = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/home";
    return (
        <>
            {/* HEADER */}
            <div className={styles.header}>
                <Header />
            </div>
            {/* BODY */}
            <div className={styles.homeBody}>
                <div className={styles.sidebar}>

                </div>
                <div className={styles.mainContent}>
                    {/* Config child routes here */}
                    {
                        isHomePage ? (
                            <>
                                <div className={styles.content}>

                                </div>
                                <div className={styles.recentPost}>
                                    
                                </div>
                            </>
                        ) : (
                            <Outlet />
                        )
                   }
                </div>

            </div>
            {/* FOOTER */}
            <div className={styles.footer}>
                <Footer />
            </div>
        </>
    )
}

export default Home;