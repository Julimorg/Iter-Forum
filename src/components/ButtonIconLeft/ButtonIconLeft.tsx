import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";

interface ButtonIconLeftProps {
  Icon: React.ElementType;
  size?: number;
  color?: string;
  onclick?: () => void;
}

const ButtonIconLeft: React.FC<ButtonIconLeftProps> = ({
  Icon,
  size = 24,
  color = "#ffffff",
  onclick,
}) => {
  return (
    <StyleWrapper>
      <div className='buttonIconRight'>
        <button className="btn" onClick={onclick}>
          <IconStyled as={Icon} size={size} color={color} />
          <p><Link to = "create-post">Create Post</Link></p>
        </button>
      </div>
    </StyleWrapper>

  )
}

export default ButtonIconLeft

const StyleWrapper = styled.div`
  .btn{
  background-color: #fff;
  border: none;
  width: 6.8rem;
  height: 3rem;
  border-radius: 13%;
  box-shadow: 0 0px 3px gray;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0;
  overflow: hidden;
}

p{
  font-size: 15px;
  font-weight: 500;
}
p a{
  color: #333;
  text-decoration: none;
}
   &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    box-shadow: 0 0 2px darkslategray;
    transform: translateY(2px);
  }
`
const IconStyled = styled.span<{ size: number; color: string }>`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color};
`;