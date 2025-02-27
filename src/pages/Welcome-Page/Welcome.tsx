import { Link } from "react-router-dom";
import styles from "./welcome.module.css"

const Welcome = () => {
  return (
    <div className= {styles.body}>
      <Link to="/login">
        <h1 className = {styles.welcomeTitle}>
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
