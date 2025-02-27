import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './home.module.css'
import BlurText from '../../components/BlurText/BlurText';


const Home = () => {
    return (
        <>
            <div className={styles.header}>
                <div className="logoName">
                    <BlurText text = "Iter-Forum"/>
                </div>
                <div className="selectionHeader">

                </div>
            </div>
            <div className={styles.homeBody}>
                    <div className = {styles.sidebar}>

                    </div>
                    <div className={styles.mainContent}>
                    <div className={styles.content}>
                        
                        </div>
                        <div className={styles.recentPost}>
    
                        </div>
                    </div>

            </div>
            <div className={styles.footer}>

            </div>
        </>
    )
}

export default Home;