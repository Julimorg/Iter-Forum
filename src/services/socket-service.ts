import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../utils/utils';
import { toast } from 'react-toastify';

class SocketService {
  private socket: Socket | null = null;
  private joinedRooms: Set<string> = new Set();
  private userId: string | null = null;
  private isConnecting: boolean = false;

  public connect(userId: string): Socket | null {
    if (this.isConnecting || (this.socket && this.socket.connected)) {
      return this.socket;
    }

    this.isConnecting = true;
    this.userId = userId;
    this.socket = io(`${SOCKET_URL}`, {
      transports: ['websocket'], 
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500, // Giảm delay để thử lại nhanh
      reconnectionDelayMax: 2000,
      timeout: 3000, // Timeout ngắn để phát hiện lỗi sớm
      forceNew: true, // Tái sử dụng kết nối
      query: { userId },
    });

    this.socket.on('connect', () => {
      // console.log(`Socket connected to with ID: ${this.socket?.id}`);
      this.isConnecting = false;
      if (this.userId) {
        this.joinRoom(this.userId);
      }
    });

    this.socket.on('disconnect', () => {
      toast.info('Socket disconnected');
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      toast.error(`WebSocket connection error : ${error.message}`);
      this.isConnecting = false;
    });

    return this.socket;
  }

  public joinRoom(roomId: string) {
    if (this.socket && this.socket.connected && !this.joinedRooms.has(roomId)) {
      this.socket.emit('joinRoom', roomId);
      this.joinedRooms.add(roomId);
      // console.log(`Joined room: ${roomId}`);
    }
  }

  public joinRoomPost(postId: string) {
    if (this.socket && this.socket.connected && !this.joinedRooms.has(postId)) {
      this.socket.emit('joinRoomPost', postId);
      this.joinedRooms.add(postId);
      // console.log(`Joined post room: ${postId}`);
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  public emit(event: string, data: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.joinedRooms.clear();
      this.socket = null;
      this.userId = null;
      this.isConnecting = false;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();