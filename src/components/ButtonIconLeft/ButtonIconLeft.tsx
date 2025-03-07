import React, { ReactNode } from 'react';
import styled from "styled-components";

interface ButtonIconLeftProps {
  Icon: React.ElementType;
  size?: number;
  color?: string;
  title: string | ReactNode;
  onclick?: () => void;
}

const ButtonIconLeft: React.FC<ButtonIconLeftProps> = ({
  Icon,
  size = 24,
  color = "#ffffff",
  title,
  onclick,
}) => {
  return (
    <StyleWrapper>
      <div className='buttonIconRight'>
        <button className="btn" onClick={onclick}>
          <IconStyled as={Icon} size={size} color={color} />
          <p> {typeof title === "string" ? <span>{title}</span> : title}</p>
        </button>
      </div>
    </StyleWrapper>

  )
}

export default ButtonIconLeft

const StyleWrapper = styled.div`
  .btn{
  border: 2px solid #f0f0f0;
  // border: none;
  background-color: #fff;
  width: 7.8rem;
  height: 3rem;
  border-radius: 1rem;
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
   border-radius: 1rem;
  }
&:active {
    transform: translateY(2px);
  }
`
const IconStyled = styled.span<{ size: number; color: string }>`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color};
`;