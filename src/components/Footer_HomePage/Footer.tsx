import { styled } from "styled-components";
const Footer = () => {
    return (
        <StyleWrapper>
            <div className="footerContainer">
                <div className="footerContent">
                    <p className={`cursor typewriterAnimation`}>Xin chào, tụi mình là hội người đẹp trai nhất vũ trụ</p>
                </div>
                <div className="createdBy">
                    <p>&copy; <span id="year"></span> Hội người đẹp trai nhất xóm. All rights reserved.</p>
                </div>
            </div>
        </StyleWrapper>

    )
}

export default Footer;

const StyleWrapper = styled.div`
.cursor{
    margin-top: 2rem;
    position: relative;
    width: 24em;
    border-right: 2px solid rgba(255,255,255,.75);
    font-size: 30px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    transform: translateY(-50%);    
}
.typewriterAnimation {
  animation: 
    typewriter 5s steps(50) 1s 1 normal both, 
    blinkingCursor 500ms steps(50) infinite normal;
}
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes blinkingCursor{
  from { border-right-color: rgba(255,255,255,.75); }
  to { border-right-color: transparent; }
}

.createdBy {
    margin-top: 6rem;
}
`