import { Modal } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import React from 'react';
import { motion } from 'framer-motion';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string | number;
  className?: string;
  centered?: boolean;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
  title = 'Privacy Policy',
  content,
  footer = (
    <div className="flex justify-end">
      <button
        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  ),
  width = '100%',
  className = 'max-w-2xl mx-4 sm:mx-auto rounded-lg shadow-2xl ring-1 ring-purple-200',
  centered = true,
}) => {
  return (
    <Modal
      title={
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LockOutlined className="text-3xl text-purple-500" />
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
        // content: { background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' },
        header: { borderBottom: '1px solid #c4b5fd' },
      }}
    >
      {content || (
        <motion.div
          className="flex flex-col gap-6 py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-xl mx-auto">
            <motion.h3
              className="text-lg sm:text-xl font-semibold text-gray-800 font-sans mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Our Commitment to Your Privacy
            </motion.h3>
            <div className="space-y-6">
              {[
                {
                  title: 'Data Collection',
                  description:
                    'We collect only the information necessary to provide our services, such as your username, email, and activity on the platform.',
                },
                {
                  title: 'Data Usage',
                  description:
                    'Your data is used to enhance your experience, personalize content, and improve our services. We do not sell your personal information.',
                },
                {
                  title: 'Data Protection',
                  description:
                    'We implement robust security measures to protect your data from unauthorized access, including encryption and secure storage.',
                },
                {
                  title: 'Your Rights',
                  description:
                    'You have the right to access, update, or delete your personal information at any time through your account settings.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="border-l-4 border-purple-400 pl-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 font-sans">
                    {item.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 font-sans">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.p
              className="text-base sm:text-lg text-gray-600 mt-6 font-sans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              We are committed to transparency and protecting your privacy. Contact us for any questions!
            </motion.p>
          </div>
        </motion.div>
      )}
    </Modal>
  );
};

export default PrivacyPolicyModal;