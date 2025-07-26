import { Modal } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import React from 'react';
import { motion } from 'framer-motion';

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string | number;
  className?: string;
  centered?: boolean;
}

const RulesModal: React.FC<RulesModalProps> = ({
  visible,
  onClose,
  title = 'Community Rules',
  content,
  footer = (
    <div className="flex justify-end">
      <button
        className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  ),
  width = '100%',
  className = 'max-w-xl mx-4 sm:mx-auto rounded-2xl shadow-2xl',
  centered = true,
}) => {
  return (
    <Modal
      title={
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SafetyOutlined className="text-3xl text-green-500" />
          <span className="text-xl sm:text-2xl font-bold text-gray-800 font-sans">
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
        // content: { background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' },
        header: { borderBottom: '1px solid #10b981' },
      }}
    >
      {content || (
        <motion.div
          className="flex flex-col gap-6 py-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-lg mx-auto">
            <motion.h3
              className="text-lg sm:text-xl font-semibold text-gray-800 font-sans mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Our Community Guidelines
            </motion.h3>
            <ul className="list-none space-y-4">
              {[
                'Respect all members: Treat everyone with kindness and avoid offensive language or behavior.',
                'Share appropriate content: No spam, hate speech, or explicit material.',
                'Protect privacy: Do not share personal information without consent.',
                'Engage constructively: Contribute to discussions with meaningful and relevant input.',
                'Follow legal guidelines: Adhere to copyright laws and avoid illegal activities.',
              ].map((rule, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <span className="text-green-500">•</span>
                  <span className="text-base sm:text-lg text-gray-700 font-sans">
                    {rule}
                  </span>
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="text-base sm:text-lg text-gray-600 mt-6 font-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Thank you for helping us maintain a safe and vibrant community!
            </motion.p>
          </div>
        </motion.div>
      )}
    </Modal>
  );
};

export default RulesModal;