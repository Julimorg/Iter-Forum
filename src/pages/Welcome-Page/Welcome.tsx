import { Link } from "react-router-dom";
import "./style.css"

const Welcome = () => {
  return (
    <div>
      <Link to="/login">
        <h1>
        <span>w</span>
        <span>e</span>
        <span>l</span>
        <span>c</span>
        <span>o</span>
        <span>m</span>
        <span>e</span>
        </h1>
      </Link>
    </div>
  );
};

export default Welcome;
