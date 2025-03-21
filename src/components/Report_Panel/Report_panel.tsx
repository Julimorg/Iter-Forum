import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
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
  transform: scale(1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden; /* Đảm bảo nội dung không tràn */
`;

const BackButton = styled.button`
  position: relative;
  margin-bottom: 10px;
  padding: 6px 12px;
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-start;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
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

const Textarea = styled.textarea`
  width: 100%;
  margin: 12px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

const ConfirmButton = styled.button`
  padding: 12px;
  margin: 8px 0;
  width: 100%;
  border: none;
  background-color: #d9d9d9;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #cfcfcf;
  }
`;

const ConfirmationMessage = styled.div`
  text-align: left;
`;

const ConfirmationTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ProcessInfo = styled.p`
  font-size: 14px;
  margin-bottom: 12px;
  color: #333;
`;

const HighlightedReason = styled.div`
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 4px;
  margin: 8px 0;
  font-weight: bold;
  color: #333;
`;

const DescriptionText = styled.p`
  color: #666;
  margin-top: 4px;
`;

interface ReportPanelProps {
  onClose: () => void;
  type: string;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ onClose, type }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const reportReasons = [
    'Problems with children under 18',
    'Bullying, harassment, or abuse',
    'Suicide or self-injury',
    'Content that is violent, hateful, or disruptive',
    'Adult content',
    'Fraudulent and false content',
    'Other problems',
  ];

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleBackClick = () => {
    setSelectedReason(null);
  };

  const handleConfirmReport = () => {
    setReportSubmitted(true);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element;
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
            {!selectedReason ? (
              <>
                <PanelTitle>Why are you reporting this {type}?</PanelTitle>
                {reportReasons.map((reason, index) => (
                  <ReasonButton key={index} onClick={() => handleReasonClick(reason)}>
                    {reason}
                  </ReasonButton>
                ))}
              </>
            ) : (
              <>
                <BackButton onClick={handleBackClick}>Back</BackButton>
                <PanelTitle>Description for {selectedReason}</PanelTitle>
                <Textarea
                  placeholder="Describe your problem with this post (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
                <ConfirmButton onClick={handleConfirmReport}>Submit Report</ConfirmButton>
              </>
            )}
          </>
        ) : (
          <ConfirmationMessage>
            <ConfirmationTitle>Report Submitted Successfully</ConfirmationTitle>
            <ProcessInfo>
              After we verify this {type}, we will inform you how to resolve this problem. Thank you for reporting!
            </ProcessInfo>
            <HighlightedReason>{selectedReason}</HighlightedReason>
            {description && <DescriptionText>{description}</DescriptionText>}
          </ConfirmationMessage>
        )}
      </ReportPanelContainer>
    </PanelOverlay>
  );
};

export default ReportPanel;
