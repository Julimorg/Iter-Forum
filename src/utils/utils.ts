
export const formatTimeAgo = (date: Date): string => {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 1) return `${diffDays} ngày trước`;
  if (diffDays === 1) return `1 ngày trước`;
  if (diffHours > 1) return `${diffHours} giờ trước`;
  if (diffHours === 1) return `1 giờ trước`;
  if (diffMinutes > 1) return `${diffMinutes} phút trước`;
  if (diffMinutes === 1) return `1 phút trước`;
  return `Vừa xong`;
};
