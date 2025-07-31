
import { formatDistanceToNow,  } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { useAuthStore } from "../hook/useAuthStore";
import ava_unknown from "../assets/ava_unknown.webp";
export const SOCKET_URL = import.meta.env.VITE_API_SOCKET
export const API_URL = import.meta.env.VITE_API_URL;

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
  if (!utcDate || typeof utcDate !== 'string') {
    return 'Không xác định';
  }

  try {
    const date = new Date(utcDate);

    if (isNaN(date.getTime())) {
      return 'Không xác định';
    }

    const vietnamDate = toZonedTime(date, 'Asia/Ho_Chi_Minh');
    const now = new Date();
    const diffInSeconds = (now.getTime() - vietnamDate.getTime()) / 1000;

    if (diffInSeconds < 0 && Math.abs(diffInSeconds) < 24 * 60 * 60) {
      return 'vừa mới';
    }

    return formatDistanceToNow(vietnamDate, { addSuffix: true});
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Không xác định';
  }
}

export const my_user_id = useAuthStore.getState().user_id; 


export const fakeAvatar = "https://i.pinimg.com/564x/eb/5f/b9/eb5fb972ef581dc0e303b9f80d10d582.jpg";


export const WizardImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6MxzkYx8c_WfMcXQMng1xa70R37bSLgzLA&s";

export const avatar_unknown = ava_unknown;