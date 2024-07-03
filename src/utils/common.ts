import { ConvertedTopicData, TopicData } from "../components/LiveList/type";

export const collection_img =
  "https://storage.googleapis.com/speaking-english-together.appspot.com/images/1716978702287_collection.jpg";
export const avatar_img =
  "https://cdn.pixabay.com/photo/2024/02/15/16/57/cat-8575768_1280.png";

export function convertData(data: TopicData[]): ConvertedTopicData[] {
  return data.map((item) => {
    return {
      id: item.id,
      image: item.image,
      label: item.name,
      value: item.id,
      content: item.content,
    };
  });
}
export const convertTimestamp = (timestamp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);

  // Check if the timestamp is valid (non-negative and not in the future)
  if (!timestamp || timestamp < 0 || timestamp > currentTime) {
    return undefined;
  }

  const timeDifference = currentTime - timestamp;

  if (timeDifference < 10) {
    return "just now";
  } else if (timeDifference < 60) {
    return `${timeDifference}s`;
  } else if (timeDifference < 3600) {
    return `${Math.floor(timeDifference / 60)}m`;
  } else if (timeDifference < 86400) {
    return `${Math.floor(timeDifference / 3600)}h`;
  } else if (timeDifference < 604800) {
    // Less than 7 days
    return `${Math.floor(timeDifference / 86400)}d`;
  } else {
    return `${Math.floor(timeDifference / 604800)}w`;
  }
};

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const timeAMPM = date.toLocaleTimeString("en-US", options);

  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = date.toLocaleDateString("en-US");
  const fullTime = date.toLocaleTimeString("en-US", options);

  if (date.toDateString() === now.toDateString()) {
    return timeAMPM;
  }

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() - now.getDay() + 6);

  if (date >= startOfWeek && date <= endOfWeek) {
    return `${dayOfWeek}, ${timeAMPM}`;
  }

  return `${fullDate} ${fullTime}`;
}

export function convertDate(data: string) {
  const date = new Date(data);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}

export function convertSecondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (hours > 0) {
    result += `${hours} h `;
  }
  if (minutes > 0 || hours > 0) {
    result += `${minutes} m `;
  }
  if (Number.isInteger(remainingSeconds)) {
    result += `${remainingSeconds} s`;
  } else {
    result += `${remainingSeconds.toFixed(1)} s`;
  }
  return result;
}

export function playOrPauseAudio(
  audio: HTMLAudioElement,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (isPlaying) {
    setIsPlaying(false);
    audio.pause();
  } else {
    setIsPlaying(true);
    audio.currentTime = 0;
    audio.play();
  }
  audio.addEventListener("ended", () => {
    setIsPlaying(false);
  });
}

export const json_verify = (s: string): boolean => {
  try {
    JSON.parse(s);
    return true;
  } catch (e) {
    return false;
  }
};

export function getQualityScore(stats: any): number {
  const packetLossPercent = stats.packetsLost / stats.totalPackets || 0;
  const jitter = stats.jitter;
  const rtt = stats.rtt;
  let score = 100;
  score -= packetLossPercent * 50 > 50 ? 50 : packetLossPercent * 50;
  score -= ((jitter / 30) * 25 > 25 ? 25 : (jitter / 30) * 25) || 0;
  score -= ((rtt / 300) * 25 > 25 ? 25 : (rtt / 300) * 25) || 0;
  return score / 10;
}

export function formatAMPM(date: Date): string {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? 0 + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export const trimSnackBarText = (text: string = ""): string => {
  const maxLength = 52;

  return text.length > maxLength ? `${text.substr(0, maxLength - 5)}...` : text;
};

export const nameTructed = (name: string, truncatedLength: number): string => {
  if (name?.length > truncatedLength) {
    if (truncatedLength === 15) {
      return `${name.substr(0, 12)}...`;
    } else {
      return `${name.substr(0, truncatedLength)}...`;
    }
  } else {
    return name;
  }
};

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
  CONTENT: "CONTENT",
  TRANSLATE: "TRANSLATE",
  SENTENCES: "SENTENCES",
};

export function debounce(
  func: Function,
  wait: number,
  immediate: boolean
): Function {
  var timeout: NodeJS.Timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

export const nationality = [
  { value: "American", label: "American" },
  { value: "British", label: "British" },
  { value: "Canadian", label: "Canadian" },
  { value: "Chinese", label: "Chinese" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Indian", label: "Indian" },
  { value: "Italian", label: "Italian" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Mexican", label: "Mexican" },
  { value: "Russian", label: "Russian" },
  { value: "Spanish", label: "Spanish" },
  { value: "Vietnam", label: "Vietnam" },
];

export const native_language = [
  { value: "arabic", label: "Arabic" },
  { value: "chinese", label: "Chinese" },
  { value: "dutch", label: "Dutch" },
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  { value: "hindi", label: "Hindi" },
  { value: "indonesian", label: "Indonesian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "polish", label: "Polish" },
  { value: "portuguese", label: "Portuguese" },
  { value: "russian", label: "Russian" },
  { value: "spanish", label: "Spanish" },
  { value: "swedish", label: "Swedish" },
  { value: "turkish", label: "Turkish" },
  { value: "vietnamese", label: "Vietnamese" },
];

export const interests = [
  "Reading",
  "Traveling",
  "Music",
  "Cooking",
  "Sports",
  "Photography",
  "Painting",
  "Gardening",
  "Writing",
  "Technology",
  "Fashion",
  "Health and fitness",
  "Movies and TV shows",
  "Video games",
  "Animals and pets",
  "Meditation and mindfulness",
  "DIY and crafts",
  "History",
  "Science and technology",
  "Nature and outdoor activities",
  "Food and cuisine",
];
export const learning_goals = [
  "Improve vocabulary",
  "Enhance grammar skills",
  "Practice speaking",
  "Enhance listening skills",
  "Improve writing skills",
  "Prepare for exams (TOEFL, IELTS, etc.)",
  "Learn for travel purposes",
  "Enhance career prospects",
];
export const occupation = [
  "Accountant",
  "Actor",
  "Architect",
  "Artist",
  "Author",
  "Baker",
  "Barista",
  "Bartender",
  "Biologist",
  "Blogger",
  "Carpenter",
  "Chef",
  "Coach",
  "Dancer",
  "Designer",
  "Developer",
  "Doctor",
  "Electrician",
  "Engineer",
  "Entrepreneur",
  "Firefighter",
  "Graphic Designer",
  "Hairdresser",
  "Journalist",
  "Lawyer",
  "Lecturer",
  "Marketer",
  "Musician",
  "Nurse",
  "Painter",
  "Photographer",
  "Pilot",
  "Plumber",
  "Police Officer",
  "Politician",
  "Professor",
  "Programmer",
  "Receptionist",
  "Singer",
  "Soldier",
  "Teacher",
  "Translator",
  "Travel Agent",
  "Veterinarian",
  "Waiter/Waitress",
  "Writer",
];
