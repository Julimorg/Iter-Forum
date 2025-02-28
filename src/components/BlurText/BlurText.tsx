import React from "react";
import styles from "./blurtext.module.css"
interface BlurTextProps {
    text: string;
}

const BlurText: React.FC<BlurTextProps> = ({ text }) => {
    return (
        <>
            <div className={styles.spliTtextContainer}>
                <span className={`${styles.textPart} ${styles.left}`}>{text}</span>
                {/* <span className={`${styles.textPart} ${styles.right}`}></span> */}
            </div>
        </>
    )
}

export default BlurText;