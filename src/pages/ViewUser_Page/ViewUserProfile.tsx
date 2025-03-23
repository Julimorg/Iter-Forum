import React, { useEffect, useState } from "react";
import styles from "./viewuserprofile.module.css";
import authorizedAxiosInstance from "../../services/Auth";

const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";
const ViewUserProfile = () => {
    const messageRef = useRef();
    const handleSave = async (e) => {
        e.preventDefault();
        console.log(messageRef.current.value);
    }
    return (
        <>
            <div className={styles.profileContainer}>
                <div className="userProfileBody">
                    {/* Header Profile */}
                    <div className="userProfileContact">
                        {/* User Basic info */}
                        <div className={styles.userProfileInformation}>
                            <div className={styles.userProfileImage}>
                                <img src={fakeAvatar} alt="unknown" />
                            </div>
                            <div className={styles.userProfileName}>
                                <h1>User Name</h1>
                                <p>Status: Active</p>
                            </div>
                            <div className={styles.userProfileBio}>
                                <div className={styles.userBasicInfo}>
                                    <h1>My information</h1>
                                    <p>Email: kienphongtran2003@gmail.com</p>
                                    <p>Phone: 0935459488</p>
                                    <p>Age: 22</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <span />
                    {/* User Profile Post, ... etc */}
                    <div className="userProfileContent">

                    </div>
                </div>
            </div>
        </>
    )
}


export default ViewUserProfile;