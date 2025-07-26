
import React, { useState } from 'react';
import { Modal, Button, Radio, Input, message } from 'antd';
import { API_BE } from '../../config/configApi';
import axiosClient from '../../apis/axiosClient';

interface ReportPanelProps {
  onClose: () => void;
  type: string; 
  user_id: string;
  post_id?: string | null;
  comment_id?: string | null;
}

interface ReportRequest {
  report_title: string;
  report_body: string;
  reported_user_id: string;
  post_id?: string | null;
  comment_id?: string | null;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ onClose, type, user_id, post_id, comment_id }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    "I don't want to see this",
  ];

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason);
    setError(null);
  };

  const handleBackClick = () => {
    setSelectedReason(null);
    setDescription('');
    setError(null);
  };

  const handleConfirmReport = async () => {
    if (!selectedReason) {
      setError('Vui lòng chọn lý do báo cáo');
      return;
    }

    const reportData: ReportRequest = {
      reported_user_id: user_id,
      report_title: selectedReason,
      report_body: description || '',
      ...(type === 'Post' && post_id && { post_id }),
      ...(type === 'Comment' && comment_id && { comment_id }),
    };

    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.post(
        `${API_BE}/api/v1/report/${encodeURIComponent(type)}`,
        reportData
      );

      if (response.data.is_success) {
        setReportSubmitted(true);
        message.success('Báo cáo đã được gửi thành công!');
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
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      centered
      width={450}
      className="rounded-lg"
      bodyStyle={{ padding: '24px', background: '#fff' }}
    >
      <div className="flex flex-col items-center">
        {reportSubmitted ? (
          <>
            <div className="text-green-600 text-lg font-semibold mb-4">
              Báo cáo đã được gửi thành công!
            </div>
            <Button
              type="primary"
              onClick={onClose}
              className="w-full h-10 bg-blue-500 hover:bg-blue-600 border-none rounded-md"
            >
              Đóng
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedReason ? `Detail - ${selectedReason}` : 'Report Reason'}
            </h2>
            {selectedReason ? (
              <div className="w-full">
                <Button
                  onClick={handleBackClick}
                  className="mb-4 h-9 bg-gray-200 hover:bg-gray-300 border-none text-gray-700 rounded-md"
                >
                  Come Back
                </Button>
                <Input.TextArea
                  placeholder="Describe the problem (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full mb-4 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <Button
                  type="primary"
                  onClick={handleConfirmReport}
                  loading={isLoading}
                  className="w-full h-10 bg-blue-500 hover:bg-blue-600 border-none rounded-md"
                >
                  {isLoading ? 'Sending...' : 'Send report'}
                </Button>
              </div>
            ) : (
              <div className="w-full max-h-[300px] overflow-y-auto mb-4">
                <Radio.Group
                  onChange={(e) => handleReasonClick(e.target.value)}
                  value={selectedReason}
                  className="w-full"
                >
                  {reportReasons.map((reason) => (
                    <div
                      key={reason}
                      className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
                    >
                      <Radio value={reason}>{reason}</Radio>
                    </div>
                  ))}
                </Radio.Group>
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </div>
            )}
            {!selectedReason && (
              <Button
                onClick={onClose}
                className="w-full h-10 bg-gray-200 hover:bg-gray-300 border-none text-gray-700 rounded-md"
              >
                Cancle
              </Button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ReportPanel;
