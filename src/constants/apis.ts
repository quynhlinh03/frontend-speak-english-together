// AUTH
export const REQUEST_AUTH_LOGIN_PASSWORD = "/auth/login";
export const REQUEST_AUTH_LOGOUT = "/auth/logout";
export const REQUEST_CHANGE_PASSWORD = "/user/me/change-password";

//LIVE
export const REQUEST_LIVE = "/room";
export const REQUEST_DETAIL_LIVE = (id: number) => `/room/${id}`;
export const REQUEST_JOIN_LIVE = (id: string) => `/room/${id}/join`;
export const REQUEST_LEAVE_LIVE = (id: string) => `/room/${id}/leave`;
export const REQUEST_TOKEN_LIVE = "/room/video-sdk-token";
export const UPLOAD_IMAGES = "/file/upload";
export const REQUEST_TOPIC = "/topic";
export const REQUEST_SPEAKING_SENTENCE = (id: number, refresh?: boolean) =>
  `/room/${id}/get-speaking-sentence${refresh ? `?refresh=${refresh}` : ""}`;
export const REQUEST_REMOVE_MEMBER = "/room/remove-member"
export const REQUEST_LEAVE_AUTO = (userId: number, roomID: number) => `/room/auto-leave?userId=${userId}&&roomId=${roomID}`

//PROFILE
export const REQUEST_USER_PROFILE = "/user/me";

//USER
export const REQUEST_USER = "/user";
export const REQUEST_DETAIL_USER = (id: number) => `/user/${id}`;

//USER_FOLLOWER
export const USER_FOLLOW = (id: number) => `/user-follower/follow/${id}`;
export const USER_UNFOLLOW = (id: number) => `/user-follower/unfollow/${id}`;
export const USER_FOLLOWER = (id: number) => `/user-follower/followers/${id}`;
export const USER_FOLLOWING = (id: number) => `/user-follower/following/${id}`;

//TRANSLATE
export const TRANSLATE = "/translate";

//VOCABULARY
export const VOCABULARY = "/vocabulary";
export const VOCABULARY_DETAIL = (id: number) => `/vocabulary/${id}`;

//VOCABULARY
export const PARAGRAPH = "/paragraph";
export const PARAGRAPH_DETAIL = (id: number) => `/paragraph/${id}`;

//COLLECTION
export const COLLECTION = "/collection";
export const COLLECTION_DETAIL = (id: number) => `/collection/${id}`;

//GOOGLE SPEECH
export const SPEECH = "/google-speech/text-to-speech";

//GOOGLE TEXT
export const SPEECH_TO_TEXT = "/google-speech/speech-to-text";

//OPEN AI
export const GENERATE_QUESTION = "/open-ai/generate-speaking-question";
export const ANALYZE_TEXT = "/open-ai/analyze-text";
