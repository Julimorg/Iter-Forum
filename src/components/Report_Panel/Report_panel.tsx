import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Làm tối nền phía sau */
  z-index: 999; /* Đảm bảo nó phủ trên các phần tử khác */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReportPanelContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: scale(1); /* Đặt kích thước mặc định */
  transition: transform 0.3s ease-in-out;
`;

const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const ReasonButton = styled.button`
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: left;
  border-radius: 4px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ConfirmationMessage = styled.p`
  color: green;
  text-align: center;
  font-size: 16px;
`;

interface ReportPanelProps {
  onClose: () => void;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ onClose }) => {
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReportSubmit = () => {
    setReportSubmitted(true); // Đặt trạng thái là đã gửi báo cáo
  };

  // Đảm bảo khi bấm ra ngoài panel thì đóng nó
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Kiểm tra xem target có phải là phần tử con của ReportPanelContainer không
      const target = event.target as Element; // Ép kiểu target thành Element
      if (target && !target.closest('.report-panel-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <PanelOverlay>
      <ReportPanelContainer className="report-panel-container">
        {!reportSubmitted ? (
          <>
            <PanelTitle>Why are you reporting this post?</PanelTitle>
            <ReasonButton onClick={handleReportSubmit}>Spam</ReasonButton>
            <ReasonButton onClick={handleReportSubmit}>Inappropriate Content</ReasonButton>
            <ReasonButton onClick={handleReportSubmit}>Hate Speech</ReasonButton>
            <ReasonButton onClick={handleReportSubmit}>Harassment</ReasonButton>
          </>
        ) : (
          <ConfirmationMessage>Your report has been successfully submitted. Thank you!</ConfirmationMessage>
        )}
      </ReportPanelContainer>
    </PanelOverlay>
  );
};

export default ReportPanel;
