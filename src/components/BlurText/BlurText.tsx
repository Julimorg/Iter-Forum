import React from "react";
import styles from "./blurtext.module.css"
interface BlurTextProps {
    text: string;
}

const BlurText: React.FC<BlurTextProps> = ({ text }) => {
    return (
        <>
            <div className={styles.loader}>
                <span className={styles.loaderText}>{text}</span>
            </div>
        </>
    )
}

export default BlurText;