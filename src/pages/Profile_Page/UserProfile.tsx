import React, { useEffect, useRef, useState } from 'react';
import styles from "./userProfile.module.css"
import ButtonIconLeft from '../../components/ButtonIconLeft/ButtonIconLeft';
import { FaUserPen, FaXmark } from 'react-icons/fa6';
import IconButton from '../../components/RoundButtonIcon/RoundButtonIcon';

import ButtonTextComponent from '../../components/ButtonTextOnly/ButtonText';



const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";

const UserProfile = () => {
    const [profileEditModel, setProfileEditModel] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const profileEditModelRef = useRef<HTMLDivElement>(null);
    const userNameRef = useRef<HTMLInputElement>(null);
    const userEmailRef = useRef<HTMLInputElement>(null);
    const userPhoneRef = useRef<HTMLInputElement>(null);
    const userAgeRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");

    //? Handle Submit Form
    const handleSubmit = () => {
        const userName = userNameRef.current?.value || "";
        const userEmail = userEmailRef.current?.value || "";
        const userAge = userAgeRef.current?.value || "";

        if (userName.length > 20) {
            setError("Tên không được quá 20 ký tự");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(userEmail)) {
            setError("Email không hợp lệ");
            return;
        }

        const age = Number(userAge);
        if (age < 13 || age > 100) {
            setError("Tuổi phải từ 13 đến 100");
            return;
        }

        setError(""); // Xóa lỗi nếu hợp lệ
        alert("Thông tin hợp lệ!");
    };

    //? Hanlde Open User Profile Edit Modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileEditModelRef.current && !profileEditModelRef.current.contains(event.target as Node)) {
                setProfileEditModel(false);
                // console.log(profileEditModelRef.current);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    //? Handle input only 1 img to avatar
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // --> Chỉ lấy 1 file duy nhất
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };
    const eventClickOpenFile = () => {
        document.getElementById("avatarUpload")?.click();
    };
    const handleRemoveImage = () => {
        setSelectedImage(null);
    };
    //? Handle Open User Profile Edit Modal
    function UserProfileEditForm({ isOpen }: { isOpen: boolean }) {
        // if (!isOpen) return null;
        return (
            <>
                <div className={isOpen ? `${styles.editModel} ${styles.show}` : `${styles.editModel} ${styles.hide}`}>
                    <div className="userEditForm">
                        <div className={styles.editFormHeader}>
                            <h2>Edit Profile</h2>
                            <IconButton
                                Icon={FaXmark}
                                size={20}
                                color="#333"
                                onClick={
                                    () => setProfileEditModel(false)
                                } />
                        </div>
                        <div className={styles.editFormBody}>
                            {/* Edit Text */}
                            <div className={styles.fillTextForm}>
                                {/* User Name */}
                                <div className={styles.editUserName}>
                                    <p>Your Name</p>
                                    <input
                                        ref={userNameRef}
                                        className={styles.userNameInput}
                                        type="text"
                                        placeholder="Your user name..."
                                    />
                                </div>

                                {/* User Email */}
                                <div className={styles.editUserEmail}>
                                    <p>Your Email</p>
                                    <input
                                        ref={userEmailRef}
                                        className={styles.userEmailInput}
                                        type="email"
                                        placeholder="Your email..."
                                    />
                                </div>

                                {/* User Phone */}
                                <div className={styles.editUserPhone}>
                                    <p>Your Phone Number</p>
                                    <input
                                        ref={userPhoneRef}
                                        className={styles.userPhoneInput}
                                        type="text"
                                        placeholder="Your phone number..."
                                    />
                                </div>

                                {/* User Age */}
                                <div className={styles.editUserAge}>
                                    <p>Your Age</p>
                                    <input
                                        ref={userAgeRef}
                                        className={styles.userAgeInput}
                                        type="number"
                                        placeholder="Your Age..."
                                    />
                                </div>

                                {/* Hiển thị lỗi nếu có */}
                                {error &&
                                    <p className={styles.errorText}>
                                        Alert: <br />
                                        - All fields must not be empty <br />
                                        - User name limit 20 chars <br />
                                        - Email validation <br />
                                        - Age limit from 13 to 100 <br />
                                    </p>
                                }
                            </div>
                            {/* Edit Img Avatar */}
                            <div className={styles.editAvartar}>
                                <div className={styles.userEditAvatar}>
                                    <div className={styles.userImageInput}>
                                        <img src={selectedImage || fakeAvatar} alt="Avatar" />
                                    </div>

                                </div>
                                <div className={styles.inputImgAvatarBtn}>
                                    {/* Input File Hidden */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="avatarUpload"
                                        onChange={handleImageChange}
                                    />
                                    <ButtonTextComponent
                                        $backgroundColor="rgb(200, 200, 200)"
                                        $hoverBackgroundColor="C5F6FF"
                                        $hoverColor="#333"
                                        title="Input image"
                                        onClick={eventClickOpenFile}
                                    />
                                    {selectedImage && (
                                        <ButtonTextComponent
                                            $backgroundColor="rgb(200, 200, 200)"
                                            $hoverBackgroundColor="C5F6FF"
                                            $hoverColor="#333"
                                            title="Remove image"
                                            onClick={handleRemoveImage}
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className={styles.confirmBtn}>
                            <ButtonTextComponent
                                $backgroundColor="rgb(200, 200, 200)"
                                $hoverBackgroundColor="C5F6FF"
                                $hoverColor="#333"
                                title="Confirm new information"
                                $width="15em"
                                onClick={handleSubmit}
                            />

                        </div>
                    </div>
                </div>
            </>
        )
    }
    //** Main View */
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
                                {/* Ovelay khi modal hiện lên */}
                                {profileEditModel && <div className={styles.overlay} onClick={() => setProfileEditModel(false)}></div>}
                                <div className="editUserProfile" ref={profileEditModelRef}>
                                    <ButtonIconLeft
                                        Icon={FaUserPen}
                                        size={20}
                                        color="#333"
                                        title="Edit Profile"
                                        onclick={() => {
                                            setProfileEditModel(!profileEditModel);
                                        }}
                                    />
                                    <UserProfileEditForm isOpen={profileEditModel} />
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
export default UserProfile;