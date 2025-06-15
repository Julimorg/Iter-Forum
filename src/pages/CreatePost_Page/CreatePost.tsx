import { FaPlus, FaTimes } from "react-icons/fa";
import ButtonIconLeft from "../../components/ButtonIconLeft/ButtonIconLeft";
import styles from "./createpost.module.css";
import { useEffect, useState } from "react";
import ButtonTextComponent from "../../components/ButtonTextOnly/ButtonText";
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import authorizedAxiosInstance from "../../services/Auth";
import axios from "axios";
import { API_BE } from "../../config/configApi";

const CreatePost = () => {
    const DESCRIP_MAX_LENGTH = 500;
    // const TITLE_MAX_LENGTH = 20;
    const TAG_MAX_LENGTH = 50;
    const [title, setTitle] = useState("");
    const [textTag, setTextTag] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [img_file, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [textDescripLimit, setTextDescripLimit] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [error, setError] = useState<string | null>(null);
    
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
          const file = event.target.files[0];
          const newImageUrl = URL.createObjectURL(file); // Blob URL cho preview
    
          // Cập nhật state
          setImages((prevImages) => [...prevImages, newImageUrl]); // Preview
          setImageFiles((prevFiles) => [...prevFiles, file]); // File để upload
    
          // Giải phóng bộ nhớ khi component unmount hoặc ảnh bị xóa
          return () => URL.revokeObjectURL(newImageUrl);
        }
      };
    // const removeImage = (index: number) => {
    //     setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    // };
    const openFilePicker = () => {
        document.getElementById("fileInput")?.click();
    };

    const accessToken = localStorage.getItem('accessToken');
    //? Create Post API
    useEffect(() => {
        const submitPost = async () => {
            if (!isSubmitting || !accessToken) return;
    
            // Kiểm tra dữ liệu trước khi gửi
            if (!title || !textDescripLimit) {
                // setError("Title and content are required");
                setIsSubmitting(false);
                return;
            }
    
            try {
                // Tạo FormData để gửi dữ liệu
                const formData = new FormData();
                formData.append("post_title", title);
                formData.append("post_content", textDescripLimit);
    
                // Gửi file ảnh (giả định key là 'images' dựa trên 'img_url' trong response)
                imageFiles.forEach((file) => {
                    formData.append("img_file", file); // Đổi từ 'img_file' sang 'images'
                });
    
                // Gửi tags dưới dạng tags[0], tags[1], v.v.
                tags.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
    
                // Log dữ liệu gửi lên để debug
                console.log("Sending POST request with FormData:");
                for (const [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }
    
                // Gửi request POST với FormData
                const response = await authorizedAxiosInstance.post(
                    `${API_BE}/api/v1/posts/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
    
                console.log("Post created successfully:", response.data);
                alert("Post created successfully!");
    
                // Reset form sau khi thành công
                setTitle("");
                setTextDescripLimit("");
                setImages([]);
                setImageFiles([]);
                setTags([]);
                setIsChecked(false);
                // setError(null);
            } catch (error) {
                console.error("Error creating post:", error);
                if (axios.isAxiosError(error)) {
                    const errorData = error.response?.data;
                    console.log("Full error response:", errorData); // Log chi tiết lỗi
                    // setError(errorData?.message || "Failed to create post");
                } else {
                    // setError("An unexpected error occurred");
                }
                alert("Failed to create post. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        };
    
        submitPost();
    }, [isSubmitting, title, textDescripLimit, imageFiles, tags, accessToken]);

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
        // alert("Success!");
        setIsSubmitting(true);
    };

    // const handleTextLimit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     if (e.target.value.length <= DESCRIP_MAX_LENGTH) {
    //         setTextDescripLimit(e.target.value);
    //     }
    // };
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
                                <div className={img_file.length === 0 ? `${styles.meidaContainerHide}` : `${styles.mediaContainer}`}>
                                    {
                                        (
                                            img_file.map((image, index) => (
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
                                        {img_file.length === 1 ? (
                                            <img src={img_file[0]} alt="uploaded image" />
                                        ) : (
                                            <Swiper
                                                modules={[Navigation, Pagination]}
                                                spaceBetween={10}
                                                slidesPerView={1}
                                                navigation={true}
                                                pagination={{ clickable: true }}
                                                className={styles.swiper}
                                            >
                                                {img_file.map((img, index) => (
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