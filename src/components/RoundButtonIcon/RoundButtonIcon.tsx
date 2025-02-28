import React from "react";
import styled from "styled-components";

interface IconButtonProps {
  Icon: React.ElementType; // Nhận icon từ `react-icons`
  size?: number;
  color?: string;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ Icon, size = 24, color = "#333", onClick }) => {
  return (
    <Button onClick={onClick}>
      <IconStyled as={Icon} size={size} color={color} />
    </Button>
  );
};

export default IconButton;

//? Style CSS for Component
const Button = styled.button`
  background-color: #fff;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  box-shadow: 0 0px 3px gray;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow: hidden;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    box-shadow: 0 0 2px darkslategray;
    transform: translateY(2px);
  }
`;

const IconStyled = styled.span<{ size: number; color: string }>`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color};
`;
