import { FaPlus, FaTimes } from "react-icons/fa";
import ButtonIconLeft from "../../components/ButtonIconLeft/ButtonIconLeft";
import styles from "./createpost.module.css";
import { useState } from "react";
import ButtonTextComponent from "../../components/ButtonTextOnly/ButtonText";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';

const CreatePost = () => {
    const DESCRIP_MAX_LENGTH = 500;
    // const TITLE_MAX_LENGTH = 20;
    const TAG_MAX_LENGTH = 10;
    const [title, setTitle] = useState("");
    const [textTag, setTextTag] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [textDescripLimit, setTextDescripLimit] = useState("");


    const handleTextLimit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= DESCRIP_MAX_LENGTH) {
            setTextDescripLimit(e.target.value);
        }
    }

    const handleTagLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (tags.length < TAG_MAX_LENGTH) {
            setTextTag(e.target.value);
        }
    };
    const handleAddTag = () => {
        if (textTag.trim() !== "") {
            setTags([...tags, textTag.trim()]);
            setTextTag("");
        } else {
            alert("Tag cannot be empty!");
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };
    const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const newImage = URL.createObjectURL(event.target.files[0]);
            setImages((prevImages) => [...prevImages, newImage]);
            // Giải phóng bộ nhớ khi ảnh không còn sử dụng
            return () => URL.revokeObjectURL(newImage);

        }
    };
    // const removeImage = (index: number) => {
    //     setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    // };
    const openFilePicker = () => {
        document.getElementById("fileInput")?.click();
    };
    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!title.trim()) {
            alert("Title is required!");
            return;
        }
        if (!isChecked) {
            alert("You must accept the Terms of Service!");
            return;
        }
        alert("Success!");
    };
    return (
        <div>
            <div className={styles.createContainer}>
                <div className={styles.createPost}>
                    <h1>Create Your Post</h1>
                    <div className={styles.createPostBody}>
                        {/* Create Post Main Function */}
                        <div className={styles.createPostMainFunction}>
                            {/* Adding Title */}
                            <div className={styles.addTitleField}>
                                <p>Add your title</p>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setTitle(e.target.value)

                                    }}
                                    value={title}
                                    required
                                />
                            </div>
                            {/* Adding Description */}
                            <div className={styles.addDescription}>
                                <p>Add Description - {textDescripLimit.length} / {DESCRIP_MAX_LENGTH} characters</p>
                                <textarea
                                    autoComplete="off"
                                    required
                                    onChange={handleTextLimit}
                                    value={textDescripLimit}
                                    maxLength={DESCRIP_MAX_LENGTH}
                                />
                            </div>
                            {/* Adding Media */}
                            <div className={styles.addMedia}>
                                <p>Add Media: </p>
                                <div className={images.length === 0 ? `${styles.meidaContainerHide}` : `${styles.mediaContainer}`}>
                                    {
                                        (
                                            images.map((image, index) => (
                                                <img key={index} src={image} alt={`uploaded ${index}`} />
                                                //    Chỗ này dùng để xóa image nhưng để tính sau                                       
                                                //   <div key={index} className={styles.imageWrapper}>
                                                //     <img src={image} alt={`uploaded ${index}`} />
                                                //     <button onClick={() => removeImage(index)}>X</button>
                                                // </div>
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
                                    Icon={FaPlus}
                                    size={20}
                                    color="#333"
                                    title='Add a Picture'
                                    onclick={openFilePicker}
                                />
                            </div>
                            {/* Adding Tags */}
                            <div className={styles.addTag}>
                                <div className={styles.addTagContainer}>
                                    <p>Tags: </p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        onChange={handleTagLimit}
                                        value={textTag}
                                        maxLength={TAG_MAX_LENGTH}
                                        required
                                    />
                                    <ButtonIconLeft
                                        Icon={FaPlus}
                                        size={20}
                                        color="#333"
                                        title='Add a tag'
                                        onclick={handleAddTag}
                                    />
                                </div>
                                {/* <div className={styles.addTagContent}> */}
                                {tags.length > 0 && (
                                    <div className={styles.addTagContent}>
                                        {/* <div className={styles.tagAdded}> */}
                                        {tags.map((tag, index) => (
                                            <div key={index} className={styles.tagAdded}>
                                                <button onClick={() => handleRemoveTag(index)} className={styles.removeTag}>
                                                    <FaTimes size={14} />
                                                </button>
                                                <p>/{tag}</p>
                                            </div>
                                        ))}
                                        {/* </div> */}
                                    </div>
                                )}
                                {/* </div> */}
                            </div>
                            {/* Policiy*/}
                            <div className={styles.policyTerm}>
                                <label className={styles.checkboxBtn}>
                                    <input className="checkbox"
                                        type="checkbox"

                                        checked={isChecked}
                                        onChange={(e) => setIsChecked(e.target.checked)} />

                                </label>
                                <p>I read the Community Rules and accept the Terms of Service </p>
                            </div>
                            <div className={styles.requestCreatePost}>
                                <ButtonTextComponent
                                    $backgroundColor="#C5F6FF"
                                    $hoverBackgroundColor="C5F6FF"
                                    $hoverColor="C5F6FF"
                                    title="Post"
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                        {/* Display Data from Create Post in Card */}
                        <div className={styles.postViewData}>
                            <div className={styles.cardData}>
                                <div className={styles.cardOverlay}>
                                    <p>Your Post View Here!</p>
                                </div>
                                <span />
                                <div className={styles.cardDataInner}>
                                    {
                                        title.length > 0 ? (
                                            <h2>{title}</h2>
                                        ) : (
                                            <h2>Your Title Here!</h2>
                                        )
                                    }
                                     {/* {tags.map((tag, index) => (
                                            <div key={index} className={styles.tagAdded}>
                                                <button onClick={() => handleRemoveTag(index)} className={styles.removeTag}>
                                                    <FaTimes size={14} />
                                                </button>
                                                <p>{tag}</p>
                                            </div>
                                        ))} */}
                                    <div className={styles.displayTag}>
                                        Your Tags:
                                        <div className={styles.displayTagContainer}>
                                        {tags.map((tag, index) => (
                                            <div key={index} className={styles.displayTagAdded}>
                                                 <h5> /{tag} </h5>
                                            </div>
                                           
                                        ))}
                                    </div>
                                    </div>
                                    {
                                        textDescripLimit.length > 0 ? (
                                            <p> {textDescripLimit.length < 300
                                                ? textDescripLimit
                                                : `${textDescripLimit.slice(0, 300)}... view more`}</p>
                                        ) : (
                                            <p>Your Description Here!</p>
                                        )
                                    }
                                    <div className={styles.imgDisplay}>
                                        {images.length === 1 ? (
                                            <img src={images[0]} alt="uploaded image" />
                                        ) : (
                                            <Swiper
                                            modules={[Navigation, Pagination]}
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            navigation = {true}
                                            pagination={{ clickable: true }}
                                            className={styles.swiper}
                                        >
                                            {images.map((img, index) => (
                                                <SwiperSlide key={index} className={styles.swiperSlide}>
                                                    <img src={img} alt={`uploaded image ${index}`} />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        )
                                    }
                                    </div>
                                   
                                    {/* <div className={styles.tags}>
                                        {tags.map((tag, index) => (
                                            <span key={index}>{tag} </span>
                                        ))}
                                    </div> */}
                                </div>
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