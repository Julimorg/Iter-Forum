export type IInteractData = {
    post_id: string;
    like: number;
    dislike: number;
}


export type ISocketHookReturn = {
    isConnected: boolean;
    currentLikes: number;
    currentDislikes: number;
    liked: boolean;
    disliked: boolean;
    setCurrentLikes: (likes: number) => void; 
    setCurrentDislikes: (dislikes: number) => void;
    emitInteraction: (data: {
        post_id: string;
        user_post_id: string;
        is_upvote: boolean;
        upvote: number;
        downvote: number;
    }) => void;
    error: string | null
}