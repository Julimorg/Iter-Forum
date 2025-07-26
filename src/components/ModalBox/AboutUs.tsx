import { Modal } from 'antd';
import React from 'react';
import { motion } from 'framer-motion';
import { WizardImg } from '../../utils/utils';

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string | number;
  className?: string;
  centered?: boolean;
}

const AboutUsModal: React.FC<ReusableModalProps> = ({
  visible,
  onClose,
  title = 'About Us',
  content,
  footer = (
    <div className="flex justify-end">
      <button
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  ),
  width = '100%',
  className = 'max-w-lg mx-4 sm:mx-auto rounded-xl shadow-2xl',
  centered = true,
}) => {
  return (
    <Modal
      title={
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xl sm:text-2xl font-bold ">
            {title}
          </span>
        </motion.div>
      }
      open={visible}
      onCancel={onClose}
      footer={footer}
      centered={centered}
      width={width}
      className={className}
      styles={{
        // content: { background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)' },
        header: { borderBottom: '1px solid #e5e7eb' },
      }}
    >
      {content || (
        <motion.div
          className="flex flex-col items-center gap-6 py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center max-w-md">
            <motion.p
              className="text-lg sm:text-xl text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Iter-Forum is an aspiration and vision to create a social network community dedicated to Vietnamese people, where they can share knowledge about software technology, life sciences, engage in open discussions, and more...
            </motion.p>
            <motion.p
              className="text-base sm:text-lg text-gray-500 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              We haven’t officially announced our team members yet, so please stay tuned!
            </motion.p>
            <motion.p
              className="text-base font-semibold text-blue-600 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Signed, <br /> Iter-Forum ( Daz )
            </motion.p>
          </div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <img
              src={WizardImg}
              alt="Friendly avatar"
              className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-full border-4 border-blue-200 shadow-md"
            />
          </motion.div>
        </motion.div>
      )}
    </Modal>
  );
};

export default AboutUsModal;