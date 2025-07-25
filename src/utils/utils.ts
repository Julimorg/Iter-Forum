
import { formatDistanceToNow, addHours } from "date-fns";


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



export function formatRelativeTime(utcDate: string | null): string {

  if (!utcDate || typeof utcDate !== "string") {
    return "Unknown time";
  }

  try {
    const date = new Date(utcDate);

    if (isNaN(date.getTime())) {
      return "Unknown time";
    }
    const vietnamDate = addHours(date, 7);
   return formatDistanceToNow(vietnamDate, { addSuffix: true });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Unknown time";
  }
}



export const fakeAvatar = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";


export const WizardImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6MxzkYx8c_WfMcXQMng1xa70R37bSLgzLA&s";