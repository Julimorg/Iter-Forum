import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Button, Input, Checkbox, Tag, Upload, message, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DOMPurify from 'dompurify';
import { ICreatePostRequest } from '../../interface/Posts/ICreatePost';
import { useCreatePost } from './Hooks/useCreatePost';

const predefinedTags = [
  'Student',
  'Intern',
  'Web developer',
  'Game developer',
  'Mobile developer',
  'Sharing',
  'I have a problem',
  'Problem solving',
  'Ask me anything',
  'Recruitment',
  'News',
  'Programming language',
  'Framework',
  'Technology',
  'Game',
  'What if?',
  'Quiz',
];

const CreatePost: React.FC = () => {
  const DESCRIP_MAX_LENGTH = 500;
  const TAG_MAX_LENGTH = 5;
  const [isChecked, setIsChecked] = useState(false);
  const [title, setTitle] = useState('');
  const [img_files, setImages] = useState<string[]>([]);
  // const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [textDescripLimit, setTextDescripLimit] = useState('');
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate, isPending, isError, error } = useCreatePost({
    onSuccess: () => {
      message.success('Post created successfully!');
      setTitle('');
      setTextDescripLimit('');
      setImages([]);
      // setImageFiles([]);
      setTags([]);
      setIsChecked(false);
      setIsExpanded(false);
    },
    onError: (err) => {
      message.error(err.response?.data?.message || 'Failed to post. Please try again.');
    },
  });

  //? config toolbar cho React Quill
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['code-block'],
    ],
  };

  const handleTextLimit = (value: string) => {
    const plainText = value.replace(/<[^>]+>/g, '').replace(/ /g, ' ');
    if (plainText.length <= DESCRIP_MAX_LENGTH) {
      setTextDescripLimit(value);
    }
  };

  const handleAddImage = (file: File) => {
    const newImageUrl = URL.createObjectURL(file);
    // if (img_files.length >= 5) {
    //   message.error('Only up to 5 images can be uploaded!');
    //   return false;
    // }
    setImages((prevImages) => [...prevImages, newImageUrl]);
    // setImageFiles((prevFiles) => [...prevFiles, file]);
    return false;
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    // setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const showTagModal = () => {
    setSelectedTags(tags);
    setIsTagModalVisible(true);
  };

  const handleTagModalOk = () => {
    if (selectedTags.length <= TAG_MAX_LENGTH) {
      setTags(selectedTags);
      setIsTagModalVisible(false);
    } else {
      message.error('You can only select up to 5 tags!');
    }
  };

  const handleTagModalCancel = () => {
    setIsTagModalVisible(false);
  };

  const handleTagSelection = (checkedValues: string[]) => {
    setSelectedTags(checkedValues);
  };

  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      message.error('Title is required!');
      return;
    }
    if (!textDescripLimit.trim()) {
      message.error('Content is required!');
      return;
    }
    if (!isChecked) {
      message.error('You must accept the Terms of Service!');
      return;
    }

    //? Tạo FormData theo interface ICreatePostRequest
    const formData: ICreatePostRequest = {
      post_title: title,
      post_content: DOMPurify.sanitize(textDescripLimit)
        .replace(/<[^>]+>/g, '')
        .replace(/ /g, ' '),
      img_file: img_files,
      tags,
    };

    mutate(formData);
  };

  //? config plain text
  const plainTextLength = textDescripLimit.replace(/<[^>]+>/g, '').replace(/ /g, ' ').length;

  // ? Làm sạch HTML và xử lý nội dung hiển thị
  const sanitizedContent = DOMPurify.sanitize(textDescripLimit);
  const displayContent =
    plainTextLength > 0
      ? isExpanded
        ? sanitizedContent
        : plainTextLength < 300
        ? sanitizedContent
        : `${sanitizedContent.slice(0, 300)}...`
      : 'Hãy viết nội dung bài viết của bạn...';

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex justify-center py-16 px-6">
      <div className="w-full max-w-7xl flex gap-10">
        {/* Form Nhập liệu */}
        <div className="w-1/2 bg-white rounded-2xl shadow-md p-10 transition-all duration-300 hover:shadow-lg">
          <h1 className="text-4xl font-semibold text-[#1A1F36] mb-10 font-['Inter',Roboto,sans-serif]">
            Create Post
          </h1>

          {/* Tiêu đề */}
          <div className="mb-8">
            <Input
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="large"
              className="rounded-xl border-[#D8DDE6] hover:border-[#0078D4] focus:border-[#0078D4] transition-all duration-200 text-lg font-['Inter',Roboto,sans-serif] py-3"
              required
            />
          </div>

          {/* Mô tả (React Quill) */}
          <div className="mb-8">
            <ReactQuill
              theme="snow"
              value={textDescripLimit}
              onChange={handleTextLimit}
              modules={quillModules}
              placeholder="Write your post content..."
              className="border border-[#D8DDE6] rounded-xl hover:border-[#0078D4] focus-within:border-[#0078D4] transition-all duration-200 font-['Inter',Roboto,sans-serif] text-base [&_.ql-editor]:min-h-[150px] [&_.ql-editor_p]:mb-2 [&_.ql-editor_ul]:mb-2 [&_.ql-editor_ol]:mb-2 [&_.ql-editor_pre]:bg-[#F0F2F5] [&_.ql-editor_pre]:p-2 [&_.ql-editor_pre]:rounded [&_.ql-editor_pre]:font-mono [&_.ql-editor_pre]:text-sm [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-b-0 [&_.ql-toolbar]:border-[#D8DDE6] [&_.ql-container]:border-[#D8DDE6]"
            />
            <p className="text-sm text-[#65676B] mt-3 font-['Inter',Roboto,sans-serif]">
              {plainTextLength} / {DESCRIP_MAX_LENGTH} ký tự
            </p>
          </div>

          {/* Thêm hình ảnh */}
          <div className="mb-8">
            <label className="block text-[#1A1F36] font-medium mb-3 font-['Inter',Roboto,sans-serif]">
              Images
            </label>
            <Upload.Dragger
              beforeUpload={handleAddImage}
              accept="image/*"
              showUploadList={false}
              multiple
              className="rounded-xl bg-[#F5F7FA] border-[#D8DDE6] hover:border-[#0078D4] transition-all duration-200"
            >
              <p className="text-[#65676B] text-base font-['Inter',Roboto,sans-serif]">
                Drag and drop or click to upload images
              </p>
              <Button
                icon={<UploadOutlined />}
                className="mt-3 bg-[#F0F2F5] text-[#1A1F36] hover:bg-[#E4E6EB] border-none rounded-lg font-['Inter',Roboto,sans-serif]"
              >
                Upload
              </Button>
            </Upload.Dragger>
            {img_files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4 animate-fadeIn">
                {img_files.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`uploaded ${index}`}
                      className="w-32 h-32 object-cover rounded-xl transition-transform duration-200 group-hover:scale-105"
                    />
                    <Button
                      type="text"
                      shape="circle"
                      icon={<FaTimes />}
                      className="absolute -top-2 -right-2 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => handleRemoveImage(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thêm thẻ */}
          <div className="mb-8">
            <label className="block text-[#1A1F36] font-medium mb-3 font-['Inter',Roboto,sans-serif]">
              Tags
            </label>
            <Button
              type="primary"
              icon={<FaPlus />}
              onClick={showTagModal}
              className="bg-[#0078D4] hover:bg-[#005BB5] border-none rounded-lg font-['Inter',Roboto,sans-serif]"
            >
              Add Tags
            </Button>
            <Modal
              title="Select Tags"
              open={isTagModalVisible}
              onOk={handleTagModalOk}
              onCancel={handleTagModalCancel}
              okText="Confirm"
              cancelText="Cancle"
              className="font-['Inter',Roboto,sans-serif]"
            >
              <Checkbox.Group
                options={predefinedTags}
                value={selectedTags}
                onChange={handleTagSelection}
                className="grid grid-cols-2 gap-2"
              />
            </Modal>
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 animate-fadeIn">
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveTag(index)}
                    className="bg-[#F0F2F5] text-[#1A1F36] rounded-lg text-sm font-['Inter',Roboto,sans-serif] px-3 py-1"
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Điều khoản */}
          <div className="mb-8 flex items-center">
            <Checkbox
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="text-[#65676B] font-['Inter',Roboto,sans-serif]"
            >
              I have read{' '}
              <a href="#" className="text-[#0078D4] hover:underline">
                Community Rules
              </a>{' '}
              and accept{' '}
              <a href="#" className="text-[#0078D4] hover:underline">
                Terms of Service
              </a>
            </Checkbox>
          </div>

          {/* Nút đăng bài */}
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={isPending}
            className="w-full bg-[#0078D4] hover:bg-[#005BB5] border-none rounded-lg text-lg font-semibold font-['Inter',Roboto,sans-serif] py-6 transition-all duration-200 hover:scale-105"
          >
            Post
          </Button>
          {isError && (
            <p className="text-red-500 mt-4">
              Error: {error.response?.data?.message || error.message}
            </p>
          )}
        </div>

        {/* VIEW POST */}
        <div className="w-1/2 bg-white rounded-2xl shadow-md p-10 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-3xl font-semibold text-[#1A1F36] mb-8 font-['Inter',Roboto,sans-serif]">
            View your post
          </h2>
          <div className="border border-[#D8DDE6] rounded-xl p-6 bg-white h-[50rem]">
            <h3 className="text-2xl font-semibold text-[#1A1F36] mb-4 font-['Inter',Roboto,sans-serif]">
              {title || 'Bạn đang nghĩ gì?'}
            </h3>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    className="bg-[#F0F2F5] text-[#1A1F36] rounded-lg text-sm font-['Inter',Roboto,sans-serif] px-3 py-1"
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}
            <div
              className="text-[#65676B] text-base font-['Inter',Roboto,sans-serif] max-w-full break-words whitespace-pre-wrap [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_pre]:bg-[#F0F2F5] [&_pre]:p-2 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-sm"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
            {plainTextLength > 300 && (
              <Button
                type="link"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#0078D4] hover:text-[#005BB5] font-['Inter',Roboto,sans-serif] mt-2 p-0"
              >
                {isExpanded ? 'Collapse' : 'Read more'}
              </Button>
            )}
            {img_files.length > 0 && (
              <div className="mt-20">
                {img_files.length === 1 ? (
                  <img
                    src={img_files[0]}
                    alt="uploaded image"
                    className="w-full h-96 object-cover rounded-xl transition-transform duration-200 hover:scale-105"
                  />
                ) : (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={{
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                    }}
                    pagination={{ clickable: true }}
                    className="w-full"
                  >
                    {img_files.map((img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img}
                          alt={`uploaded image ${index}`}
                          className="w-full h-96 object-cover rounded-xl"
                        />
                      </SwiperSlide>
                    ))}
                    <div className="swiper-button-prev bg-[#F0F2F5] text-[#0078D4] w-10 h-10 rounded-full shadow-md hover:bg-[#E4E6EB] hover:scale-110 transition-all duration-300 after:text-lg"></div>
                    <div className="swiper-button-next bg-[#F0F2F5] text-[#0078D4] w-10 h-10 rounded-full shadow-md hover:bg-[#E4E6EB] hover:scale-110 transition-all duration-300 after:text-lg"></div>
                    <div className="swiper-pagination bottom-2 [&_.swiper-pagination-bullet]:bg-[#D8DDE6] [&_.swiper-pagination-bullet]:opacity-60 [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:bg-[#0078D4] [&_.swiper-pagination-bullet-active]:opacity-100"></div>
                  </Swiper>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
