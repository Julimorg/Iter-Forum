import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_BE } from '../../config/configApi';

interface ReportPanelProps {
  onClose: () => void;
  type: string;
  user_id: string;
  post_id?: string | null;
}
interface ReportRequest{
  reported_user_id: string;
  report_title: string;
  report_body: string;
  post_id?: string | null;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ onClose, type, user_id , post_id}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //? handle report API 

  const reportReasons = [
    'Problem involving someone under 18',
    'Pretending to be someone',
    'Fake account',
    'Fake name',
    'Harassment or bullying',
    'Suicide or self-harm',
    'Violent hateful or disturbing content',
    'Selling or promoting restricted items',
    'Adult content',
    'Scam fraud or false information',
    'I dont want to see this',
  ];

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleBackClick = () => {
    setSelectedReason(null);
  };

  //? Handle Report API Report
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

  const handleConfirmReport = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Vui lòng đăng nhập để gửi báo cáo');
      return;
    }

    if (!selectedReason) {
      setError('Vui lòng chọn lý do báo cáo');
      return;
    }

    // Chỉ thêm post_id vào reportData nếu nó tồn tại và type !== 'User'
    const reportData: ReportRequest = {
      reported_user_id: user_id,
      report_title: selectedReason,
      report_body: description,
      ...(type !== 'User' && post_id !== undefined && { post_id }), 
    };

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(
        `${API_BE}/api/v1/report/${encodeURIComponent(type)}`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.is_success) {
        setReportSubmitted(true);
      } else {
        setError('Không thể gửi báo cáo');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi gửi báo cáo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PanelOverlay>
      <ReportPanelContainer className="report-panel-container">
      {reportSubmitted ? (
        <>
          <SuccessMessage>Báo cáo đã được gửi thành công!</SuccessMessage>
          <ConfirmButton onClick={onClose}>Đóng</ConfirmButton>
        </>
      ) : (
        <>
          <Title>{selectedReason ? `More detail - ${selectedReason} ` : 'Chose your reasons'}</Title>
          {selectedReason ? (
            <>
             <BackButton onClick={handleBackClick}>Return</BackButton>
              <Textarea
                placeholder="Describe your problem with this post (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <ConfirmButton onClick={handleConfirmReport} disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Submit Report'}
              </ConfirmButton>
            </>
          ) : (
            <ReasonList>
              {reportReasons.map((reason) => (
                <ReasonItem key={reason} onClick={() => handleReasonClick(reason)}>
                  {reason}
                </ReasonItem>
              ))}
            </ReasonList>
          )}
          {error && !selectedReason && <div style={{ color: 'red' }}>{error}</div>}
          <ConfirmButton onClick={onClose}>Cancel</ConfirmButton>
        </>
      )}
      </ReportPanelContainer>
    </PanelOverlay>
  );
};

export default ReportPanel;


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

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 1.5rem;
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
const ReasonItem = styled.li`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  &:hover {
    background: #f5f5f5;
  }
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


const ReasonList = styled.ul`
  list-style: none;
  padding: 0;
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

const SuccessMessage = styled.div`
  text-align: center;
  color: green;
  margin-top: 20px;
`;