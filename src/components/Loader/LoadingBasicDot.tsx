
import styled from 'styled-components';

const LoadingBasicDot = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
  }

  .loader::after {
    content: "";
    width: 75px;
    height: 75px;
    border: 15px solid #dddddd;
    border-top-color: #46C380;
    border-radius: 50%;
    animation: loading 0.75s ease-out infinite;
  }

  @keyframes loading {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(1turn);
    }
  }`;

export default LoadingBasicDot;
