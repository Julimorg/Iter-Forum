import React, { useState } from 'react';
import styled from 'styled-components';
import blockUserIcon from '../../assets/block.png';
import reportIcon from '../../assets/report.png';
import ReportPanel from '../Report_Panel/Report_panel'; // Đảm bảo đường dẫn đúng

const Popup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 8px;
  min-width: 180px;
`;

const PopupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  text-align: left;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  border-bottom: 1px solid #e0e0e0;
  &:hover {
    background-color: #f0f0f0;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const ReportPopup: React.FC = () => {
  const [showReportPanel, setShowReportPanel] = useState<boolean>(false);

  const handleOpenReportPanel = () => {
    setShowReportPanel(true); // Mở ReportPanel
  };

  const handleCloseReportPanel = () => {
    setShowReportPanel(false); // Đóng ReportPanel
  };

  return (
    <>
      <Popup>
        <PopupButton>
          <img src={blockUserIcon} alt="Block This User" />
          Block this user
        </PopupButton>
        <PopupButton style={{ color: 'red' }} onClick={handleOpenReportPanel}>
          <img src={reportIcon} alt="Report Post" />
          Report this post
        </PopupButton>
      </Popup>

      {/* Hiển thị ReportPanel nếu cần */}
      {showReportPanel && <ReportPanel onClose={handleCloseReportPanel} />}
    </>
  );
};

export default ReportPopup;
