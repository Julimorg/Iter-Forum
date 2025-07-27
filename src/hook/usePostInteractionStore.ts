import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";
import { IPostInteractionState } from "../interface/Socket/IStorePostInteract";

export const usePostInteractionStore = create<IPostInteractionState>()(
  persist(
    (set, get) => ({
      interactions: {},
      setInteraction: (postId: string, liked: boolean, disliked: boolean) =>
        set((state) => ({
          interactions: {
            ...state.interactions,
            [postId]: { liked, disliked },
          },
        })),
      getInteraction: (postId: string) => get().interactions[postId] || null,
    }),
    {
      name: 'post-interaction-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);