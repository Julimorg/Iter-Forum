import { FaPlus } from "react-icons/fa";
import ButtonIconLeft from "../../components/ButtonIconLeft/ButtonIconLeft";
import TextField from "../../components/TextField_LoginSignUp/Textfield";
import styles from "./createpost.module.css";
import { useState } from "react";


const CreatePost = () => {
    const [images, setImages] = useState<string[]>([]);
    const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const newImage = URL.createObjectURL(event.target.files[0]);
            setImages((prevImages) => [...prevImages, newImage]);
        }
    };
    const openFilePicker = () => {
        document.getElementById("fileInput")?.click();
    };
    return (
        <div>
            <div className="createContainer">
                <div className={styles.createPost}>
                    <h1>Create Your Post</h1>
                    <div className={styles.createPostBody}>
                        {/* Create Post Main Function */}
                        <div className={styles.createPostMainFunction}>
                            {/* Adding Title */}
                            <div className={styles.addTitleField}>
                                <p>Add your title</p>
                                <input type="text" autoComplete="off" required />
                            </div>
                            {/* Adding Description */}
                            <div className={styles.addDescription}>
                                <p>Add Description</p>
                                <textarea autoComplete="off" required />
                            </div>
                            {/* Adding Media */}
                            <div className={styles.addMedia}>
                                <p>Add Media: </p>
                                <div className={styles.mediaContainer}>
                                    {
                                        images.length === 0 ? (
                                            <p>No media uploaded yet.</p>
                                        ) : (
                                            images.map((image, index) => (
                                                <img key={index} src={image} alt={`uploaded ${index}`} />
                                            ))
                                        )
                                    }
                                </div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleAddImage}
                                />
                                <ButtonIconLeft
                                    Icon={FaPlus} size={20} color="#333" title='Add a Picture' onclick={openFilePicker}
                                />
                            </div>
                            {/* Adding Tags */}
                            <div className={styles.addTag}>
                                <p>Tags: </p>
                                <ButtonIconLeft
                                    Icon={FaPlus} size={20} color="#333" title='Add a tag' onclick={() => {"Hello Worl"}}
                                />
                            </div>
                            {/* Policiy*/}
                            <div className={styles.policyTerm}>
                                <p>Tags</p>
                               
                            </div>
                        </div>
                        {/* Display Data from Create Post in Card */}
                        <div className={styles.postViewData}>
                            <div className={styles.cardData}>
                                <p>Your Post View </p>
                                <div className="cardOverlay"></div>
                                <div className="cardInner">YOUR<br />CONTENT<br />HERE</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="postViewBanner">

                </div>
            </div>
        </div>
    )
}

export default CreatePost;