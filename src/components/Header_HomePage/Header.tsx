import React from 'react';
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BlurText from '../BlurText/BlurText';
import UserProfileButton from '../UserProfileButton/UserProfileButton';
import IconButton from '../RoundButtonIcon/RoundButtonIcon';
import { FaBell, FaPlus } from 'react-icons/fa';
import ButtonIconLeft from '../ButtonIconLeft/ButtonIconLeft';
import styled from "styled-components";
import NotificationElements from '../Notification_Elements/NotificationElements';
// ? API HANDLER LOGIC ONLY


//? VIEW ONLY
function NotiModel({ isOpen }: { isOpen: boolean }) {
    return (
        <>
            <StyleWrapper>
                <div className={isOpen ? `notiModel show` : `notiModel hide`}>
                    <div className="NoticationPopUps">
                        <NotificationElements
                            imgSrc={fakeAvatar}
                            title='Fong'
                            content='hdqwdqwdqdqdiqwdqwdqdqwdqwdqdqwdqwdqd'
                            time='1 minutes ago'
                            onClick={() => { alert("Hello") }}
                        />
                        <NotificationElements
                            imgSrc={fakeAvatar}
                            title='Fong'
                            content='hdqwdqwdqdqdiqwdqwdqdqwdqwdqdqwdqwdqd'
                            time='1 minutes ago'
                            onClick={() => { alert("Hello") }}
                        />
                        <NotificationElements
                            imgSrc={fakeAvatar}
                            title='Fong'
                            content='hdqwdqwdqdqdiqwdqwdqdqwdqwdqdqwdqwdqd'
                            time='1 minutes ago'
                            onClick={() => { alert("Hello") }}
                        />
                    </div>
                </div>
            </StyleWrapper>
        </>
    );
}
function UserModel({ isOpen }: { isOpen: boolean }) {
    return (
        <>
            <StyleWrapper>
                <div className={isOpen ? `userModel show` : `userModel hide`}>
                    <div className="userModelContent">
                        <div className="userProfile">
                            <button className='userBtn'>
                                <Link to="profile">User Profile</Link>
                            </button>
                            <div className="span" />
                        </div>
                    </div>
                </div>
            </StyleWrapper>
        </>
    )
}
const fakeAvatar: string = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";
const Header = () => {
    const [isNotiModelOpen, setIsNotiOpen] = useState(false);
    const [isUserModel, setIstUserModelOpen] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    //? Handle click outside for model
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
                setIsNotiOpen(false);
                // console.log(notiRef.current)
            }
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIstUserModelOpen(false);
                // console.log(userRef.current)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);
    return (
        <StyleWrapper>
            <div className="headerContent">
                {/* Website Name */}
                <BlurText text="Iter-Forum" />
                {/* Search Input */}
                <div className="searchForm">
                    <input
                        type="text"
                        autoComplete="off"
                        name="text"
                        className="inputSearch"
                        placeholder="Search something......"
                    />
                </div>
                <div className="headerSelectionButton">
                    {/* Create Post Button */}
                    <div className="createPostBtn">
                        <ButtonIconLeft Icon={FaPlus} size={20} color="#333" title={<Link to="create-post">Create Post</Link>} />
                    </div>
                    {/* Icon Button */}
                    <div className="notificationContainer" ref={notiRef}>
                        <IconButton
                            Icon={FaBell}
                            size={20}
                            color="#333"
                            onClick={() => setIsNotiOpen(!isNotiModelOpen)} />
                        <NotiModel isOpen={isNotiModelOpen} />
                    </div>
                    <div className="userProfileContainer" ref={userRef}>
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
        </StyleWrapper>
    )
}

export default Header


//? Css
const StyleWrapper = styled.div`
.headerContent{
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    display: flex;
    line-height: 3.5rem;
    justify-content: space-between;
}
.headerSelectionButton{
    display: flex;
    padding-top: 5px;
    gap: 1rem;
    right: 0;
}
.inputSearch {
  width: 40rem;
  border: none;
  outline: none;
  border-radius: 15px;
  padding: 1em;
  background-color: #ccc;
  box-shadow: inset 2px 5px 10px rgba(0,0,0,0.3);
  transition: 300ms ease-in-out;
}

.inputSearch:focus {
  background-color: white;
  transform: scale(1.05);
  box-shadow: 13px 13px 100px #969696,
             -13px -13px 100px #ffffff;
}
.notificationContainer , .userProfileContainer{
    position: relative;
}
.notiModel {
    position: absolute;
    top: 4rem;
    right: -3rem;
    z-index: 100;
    width: 25rem;
    height: 16rem;
    border-radius: 30px;
    box-shadow: rgba(0, 0, 0, 0.3) 4px 9px 27px 7px;
    background-color: #ffffff;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none; 
}
.NoticationPopUps{
    margin-top: 1rem;
    overflow-y: auto;
    width: 24.5rem;
    height: 14.5rem;
}
.NoticationPopUps::-webkit-scrollbar {
    height: 2px; 
    width:5px;
}

.NoticationPopUps::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.NoticationPopUps::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 10px;
    height: 2px;
}

.NoticationPopUps::-webkit-scrollbar-thumb:hover {
    background: #555; 
}
.userModel{
    position: absolute;
    top: 4rem;
    right: 0;
    z-index: 100;
    width: 12rem;
    height: 11rem;
    border-radius: 30px;
    box-shadow: rgba(0, 0, 0, 0.3) 4px 9px 27px 7px;
    background-color: #ffffff;

    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none; 
}

.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.hide {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
}
.userBtn{
  position: relative;
  left: 0.3rem;
  background-color: #fff;
  border: none;
  width: 11.5rem;
  height: 3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 0;
  overflow: hidden;
  margin-top: 1rem;
  margin-bottom: 5px;
}
.userBtn a {
    color: #333;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    font-size: 1.2rem;
}
.userBtn:hover {
    background-color:0 0 2px #969696;
}
.userBtn:active {
    transform: translateY(2px);
  }

`
