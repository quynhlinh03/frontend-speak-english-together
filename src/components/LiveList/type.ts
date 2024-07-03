export interface Live {
  name: string;
  topicId: number;
  isPrivate: boolean;
  password: string;
  description: string;
  thumbnail: string;
  maxMemberAmount: number;
  videoSDKToken: string;
  level: string;
}

export interface TopicData {
  id: number;
  name: string;
  image: string;
  content: string;
}

export interface ConvertedTopicData {
  id: number;
  image: string;
  label: string;
  value: number;
}

export interface RoomItem {
  id: number;
  name: string;
  host_user_id: number;
  topic: Topic;
  level?: string;
  is_private: true;
  description: string;
  thumbnail: string;
  max_member_amount: number;
  current_member_amount: number;
  video_sdk_room_id: string;
  created_at: Date;
  room_members: RoomMember[];
}

export interface Topic {
  name: string;
  image: string;
  content?: string;
}

export interface RoomMember {
  user_id: number;
  room_id: number;
  is_host: boolean;
  avatar_url: string;
  full_name: string;
  is_muted: boolean;
}

export interface RemoveMember {
  room_id: number;
  user_id: number;
}

export interface RemoveMemberAuto {
  room_id: number;
  user_id: number;
  videoSDKToken: string;
}
