import React from "react";
import styled from "styled-components";

interface UserProfileButtonProps {
  buttonImg: string;
  ImgName: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({
  buttonImg,
  ImgName,
  onClick,
}) => {
  return (
    <Button onClick={onClick}>
      <Avatar src={buttonImg} alt={ImgName} />
    </Button>
  );
};

export default UserProfileButton;

//? Style CSS for Component
const Button = styled.button`
  background-color: #fff;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 70%;
  box-shadow: 0 0px 3px gray;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow: hidden;

  &:hover {
    background-color: #fff;
  }

  &:active {
    box-shadow: 0 0 2px darkslategray;
    transform: translateY(2px);
  }
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 70%;
`;
