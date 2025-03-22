import React from 'react';
import styled from 'styled-components';

interface NotiProps {
    imgSrc?: string;
    title: string;
    content: string;
    time: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
const NotificationElements: React.FC<NotiProps> = ({
    imgSrc,
    title,
    content,
    time,
    onClick
}) => {
    return (
        <>
            <StyledWrapper>
                <div className="card" onClick={onClick}>
                    <img src={imgSrc} alt="avatar" className='img' />
                    <div className="textBox">
                        <div className="textContent">
                            <h3>{title}</h3>
                            <span>{time}</span>
                        </div>
                        <p>{content}</p>
                        <div>
                        </div>
                    </div>
                </div>
            </StyledWrapper>
        </>
    );
}

const StyledWrapper = styled.div`
  .card {
    // border: 1px solid;
    margin-left: 1.2rem;
    margin-top: 1rem;
    height: 6rem;
    width: 90%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: left;
    backdrop-filter: blur(10px);
    transition: 0.5s ease-in-out;
  }

  .card:hover {
    cursor: pointer;
    background: rgb(200, 200, 200);
  }

  .textBox {
    width: calc(100% - 90px);
    margin-left: 10px;
    color: black;
    font-family: 'Poppins', sans-serif;
  }

  .textContent {
    display: flex;
    height: 2rem;
    // border: 1px solid;
    align-items: center;
    justify-content: space-between;
  }
  
  span {
    font-size: 10px;
  }

  h3 {
    font-size: 16px;
    font-weight: bold;
  }

  p {
    font-size: 12px;
    font-weight: lighter;
    word-wrap: break-word;
    white-space: normal;
    overflow-wrap: break-word; 
  }
  .img{
    border: 1px solid #333;
    width: 4rem;
    height: 4rem;
    object-fit: cover;
    border-radius: 70%;
  }
`;

export default NotificationElements;
