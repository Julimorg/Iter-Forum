
import React, { useState } from 'react';
import blockUserIcon from '../../assets/block.png';
import reportIcon from '../../assets/report.png';
import ReportPanel from '../ModalBox/ReportModal';
import DevModal from '../ModalBox/OnDeveloped';

interface ReportPopupProps {
  type: string;
  user_id?: string;
  post_id?: string | null;
  comment_id?: string;
}

const ReportPopup: React.FC<ReportPopupProps> = ({ type, user_id, post_id, comment_id }) => {
  const [showReportPanel, setShowReportPanel] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleClose = (): void => {
    setIsModalVisible(false);
  };
  const handleOpenReportPanel = () => {
    setShowReportPanel(true);
  };

  const handleCloseReportPanel = () => {
    setShowReportPanel(false);
  };

  // Debugging log
  function show() {
    console.log("user_id:", user_id);
    console.log("post_id:", post_id);
    console.log("comment_id:", comment_id);
  }
  show();

  return (
    <>
      <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col p-2 min-w-[180px]">
        <button className="flex items-center justify-start px-3 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors border-b border-gray-200 last:border-b-0"
          onClick={showModal}
        >
          <img src={blockUserIcon} alt="Block This User" className="w-5 h-5 mr-2" />
          Block this user
        </button>
        <button
          className="flex items-center justify-start px-3 py-2 text-red-500 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors border-b border-gray-200 last:border-b-0"
          onClick={handleOpenReportPanel}
        >
          <img src={reportIcon} alt="Report" className="w-5 h-5 mr-2" />
          Report this {type}
        </button>
      </div>

      {showReportPanel && (
        <ReportPanel
          onClose={handleCloseReportPanel}
          type={type}
          user_id={user_id ?? ''}
          post_id={type !== 'User' ? post_id : undefined}
          comment_id={type === 'Comment' ? comment_id : undefined}
        />
      )}
      <DevModal visible={isModalVisible} onClose={handleClose} />

    </>
  );
};

export default ReportPopup;
