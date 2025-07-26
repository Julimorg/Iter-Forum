import { Modal } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import React from 'react';
import { WizardImg } from '../../utils/utils';

interface DevModalProps {
  visible: boolean;
  onClose: () => void;
}

const DevModal: React.FC<DevModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <SmileOutlined className="text-2xl text-yellow-500" />
          <span className="text-lg sm:text-xl font-semibold text-gray-800">
            Notification
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width="100%"
      className="max-w-md mx-4 sm:mx-auto rounded-l  g"
    >
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="text-center">
          <p className="text-base sm:text-lg text-gray-700">
            This feature is <strong>currently under development</strong>!
          </p>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Please come back later! 😊
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={WizardImg}
            alt="Friendly avatar"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default DevModal;