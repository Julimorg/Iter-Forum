export type IPostInteraction = {
  liked: boolean;
  disliked: boolean;
}

export type IPostInteractionState = {
  interactions: { [postId: string]: IPostInteraction };
  setInteraction: (postId: string, liked: boolean, disliked: boolean) => void;
  getInteraction: (postId: string) => IPostInteraction | null;
}