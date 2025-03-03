import React from 'react';
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './home.module.css'
import BlurText from '../../components/BlurText/BlurText';
import UserProfileButton from '../../components/UserProfileButton/UserProfileButton';
import IconButton from '../../components/RoundButtonIcon/RoundButtonIcon';
import { FaBell, FaPlus } from 'react-icons/fa';
import ButtonIconRight from '../../components/ButtonIconRight/ButtonIconRight';

const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";
// ? API HANDLER LOGIC ONLY


// ? VIEW ONLY 
function NotiModel({ isOpen }: { isOpen: boolean }) {
    return (
        <>
            <div className={isOpen ? `${styles.notiModel} ${styles.show}` : `${styles.notiModel} ${styles.hide}`}>

            </div>
        </>
    );
}
function UserModel({ isOpen }: { isOpen: boolean }) {
    return (
        <>
            <div className={isOpen ? `${styles.userModel} ${styles.show}` : `${styles.userModel} ${styles.hide}`}>
                <div className="userModelContent">
                    <div className="userProfile">
                        <Link to="/user-profile">User Profile</Link>
                    </div>
                    <hr className='hrSpan'/>

                </div>
            </div>
        </>
    )
}
const Home = () => {
    const [isNotiModelOpen, setIsNotiOpen] = useState(false);
    const [isUserModel, setIstUserModelOpen] = useState(false);

    const notiRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    //? Handle click outside for model
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
                setIsNotiOpen(false);
                console.log(notiRef.current)
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIstUserModelOpen(false);
                console.log(userRef.current)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);
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
                        <div className={styles.notificationContainer} ref={notiRef}>
                            <IconButton
                                Icon={FaBell}
                                size={20}
                                color="#333"
                                onClick={() => setIsNotiOpen(!isNotiModelOpen)} />
                            <NotiModel isOpen={isNotiModelOpen} />
                        </div>
                        <div className={styles.userProfileContainer} ref={userRef}>
                            {/* User button */}
                            <UserProfileButton
                                buttonImg={fakeAvatar}
                                ImgName='#'
                                onClick={() => setIstUserModelOpen(!isUserModel)}
                            />
                            <UserModel isOpen={isUserModel} />
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
                <div className="footerContainer">
                    <div className="footerContent">
                        <p className={`${styles.cursor} ${styles.typewriterAnimation}`}>Xin chào, tụi mình là hội người đẹp trai nhất vũ trụ</p>
                    </div>
                    <div className={styles.createdBy}>
                        <p>&copy; <span id="year"></span> Hội người đẹp trai nhất xóm. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;