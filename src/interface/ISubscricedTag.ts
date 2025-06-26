export type SubscribedTag = {
  tag_id: string;
  tag_title: string;
  post_count: number;
};

export type SubscribedTagResponse = {
  is_success: boolean;
  status_code: number;
  message: string;
  data: {
    subscribed_tags: SubscribedTag[] | null;
    username?: string;
    ava_img_path?: string | null;
    notifications?: any[];
  };
};
