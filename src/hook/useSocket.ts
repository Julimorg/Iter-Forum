import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { IInteractData, ISocketHookReturn } from '../interface/Socket/IConfigSocket';
import { useAuthStore } from './useAuthStore';
import { usePostInteractionStore } from './usePostInteractionStore';
import { socketService } from '../services/socket-service';

export const useSocket = (postId: string, initialLikes: number, initialDislikes: number): ISocketHookReturn => {
  const { user_id } = useAuthStore();
  const { getInteraction, setInteraction } = usePostInteractionStore();
  const [isConnected, setIsConnected] = useState<boolean>(socketService.isConnected());
  const [currentLikes, setCurrentLikes] = useState<number>(initialLikes);
  const [currentDislikes, setCurrentDislikes] = useState<number>(initialDislikes);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setError(null);
    socketService.joinRoomPost(postId);
  }, [postId]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setError('Mất kết nối WebSocket');
  }, []);

  const handleConnectError = useCallback((err: Error) => {
    setError(`Lỗi kết nối WebSocket: ${err.message}`);
    console.error('WebSocket connect error:', err);
  }, []);

  const handleUpdateInteract = useCallback(
    (data: IInteractData) => {
      if (data.post_id === postId) {
        setCurrentLikes(data.like);
        setCurrentDislikes(data.dislike);

        const interaction = getInteraction(postId);
        if (interaction) {
          setLiked(interaction.liked);
          setDisliked(interaction.disliked);
        }
      }
    },
    [postId, getInteraction]
  );

  useEffect(() => {
    if (!user_id) {
      setError('Không tìm thấy userId');
      return;
    }

    let socket: Socket | null = null;

    try {
      socket = socketService.connect(user_id);
      if (!socket) {
        setError('Đang chờ kết nối WebSocket');
        return;
      }

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);
      socketService.on('updateInteractFromServer', handleUpdateInteract);

      const interaction = getInteraction(postId);
      if (interaction) {
        setLiked(interaction.liked);
        setDisliked(interaction.disliked);
      }

      setIsConnected(socketService.isConnected());
    } catch (err) {
      setError('Lỗi khi khởi tạo WebSocket');
      console.error('Error in useSocket:', err);
    }

    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socketService.off('updateInteractFromServer', handleUpdateInteract);
      }
    };
  }, [user_id, postId, handleConnect, handleDisconnect, handleConnectError, handleUpdateInteract, getInteraction]);

  const emitInteraction = useCallback(
    (data: { post_id: string; user_post_id: string; is_upvote: boolean; upvote: number; downvote: number }) => {
      if (!socketService.isConnected()) {
        setError('WebSocket chưa kết nối');
        return;
      }
      socketService.emit('newInteractFromClient', data);
    },
    []
  );

  return {
    isConnected,
    currentLikes,
    currentDislikes,
    liked,
    disliked,
    setCurrentLikes,
    setCurrentDislikes, 
    emitInteraction,
    error,
  };
};