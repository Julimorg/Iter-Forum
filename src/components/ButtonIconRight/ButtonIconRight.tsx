import React from 'react';
import styled from "styled-components";

interface ButtonIconRightProps {
    Icon: React.ElementType;
    size?: number;
    color?: string;
    buttonText: string,
    onclick?: () => void;
}

const ButtonIconRight: React.FC<ButtonIconRightProps> = ({
    Icon,
    size = 24,
    color = "#ffffff",
    buttonText,
    onclick,
}) => {
    return (
        <StyleWrapper>
            <div className='buttonIconRight'>
                <button className="btn" onClick={onclick}>
                    <IconStyled as={Icon} size={size} color={color} />
                    <p>{buttonText}</p>
                </button>
            </div>
        </StyleWrapper>

    )
}

export default ButtonIconRight

const StyleWrapper = styled.div`
    .btn{
    background-color: #fff;
  border: none;
  width: 6rem;
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