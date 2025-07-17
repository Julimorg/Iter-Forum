export type SubscribedTag = {
  tag_id: string;
  tag_title: string;
  post_count: number;
};

export type NotificationData = {
  notification_id: string,
  notification_content: String,
  date_sent: string,
}

export type SubscribedTagResponse = {
    subscribed_tags: SubscribedTag[] | null;
    username?: string;
    ava_img_path?: string | null;
    notifications?: NotificationData[] | null;
};
