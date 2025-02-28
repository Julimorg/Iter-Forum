import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './home.module.css'
import BlurText from '../../components/BlurText/BlurText';
import UserProfileButton from '../../components/UserProfileButton/UserProfileButton';
import IconButton from '../../components/RoundButtonIcon/RoundButtonIcon';
import { FaBell, FaPlus } from 'react-icons/fa';
import ButtonIconRight from '../../components/ButtonIconRight/ButtonIconRight';

const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";
const Home = () => {
    return (
        <>
            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    {/* Website Name */}
                    <BlurText text="Iter-Forum" />
                    {/* Search Input */}
                    <div className="searchForm">
                        <input
                            type="text"
                            autoComplete="off"
                            name="text"
                            className={styles.inputSearch}
                            placeholder="Search something......"
                        />
                    </div>
                    <div className={styles.headerSelectionButton}>
                        {/* Create Post Button */}
                        <div className="createPostBtn">
                            <ButtonIconRight Icon={FaPlus} size={20} color="#333" onclick={() => alert("Create")}
                                buttonText="Create"
                            />
                        </div>
                        {/* Icon Button */}
                        <div className="notiBtn">
                            <IconButton Icon={FaBell} size={20} color="#333" onClick={() => alert("Notification clicked!")} />
                        </div>
                        <div className="userProfileBtn">
                            {/* User button */}
                            <UserProfileButton
                                buttonImg={fakeAvatar}
                                ImgName='#'
                            //  onClick = {null} // Thêm Sự kiện thì thêm ở đây
                            />
                        </div>
                    </div>
                </div>
                <div className="selectionHeader">

                </div>
            </div>
            {/* BODY */}
            <div className={styles.homeBody}>
                <div className={styles.sidebar}>

                </div>
                <div className={styles.mainContent}>
                    <div className={styles.content}>

                    </div>
                    <div className={styles.recentPost}>

                    </div>
                </div>

            </div>
            {/* FOOTER */}
            <div className={styles.footer}>

            </div>
        </>
    )
}

export default Home;