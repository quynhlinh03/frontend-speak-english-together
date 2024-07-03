import type { ReactElement } from "react";
import {
  IconFriends,
  IconArticle,
  IconLanguageKatakana,
  IconAntenna,
  IconRobot,
  IconStar,
  IconAddressBook,
  IconMessages
} from "@tabler/icons-react";

export interface Option {
  icon: ReactElement;
  url: string;
  label: string;
  links: { url: string; label: string }[];
}

export const options: Option[] = [
  {
    icon: <IconAntenna size="1rem"></IconAntenna>,
    url: "live",
    label: "Live Room",
    links: [],
  },
  // {
  //   icon: <IconArticle size="1rem"></IconArticle>,
  //   url: "feed",
  //   label: "News Feed",
  //   links: [],
  // },
  {
    icon: <IconRobot size="1rem"></IconRobot>,
    url: "ai-room",
    label: "SpeakAI",
    links: [],
  },
  {
    icon: <IconLanguageKatakana size="1rem"></IconLanguageKatakana>,
    url: "translate",
    label: "Translate",
    links: [],
  },
  {
    icon: <IconAddressBook size="1rem"></IconAddressBook>,
    url: "handbook/all",
    label: "Handbook",
    links: [],
  },
  {
    icon: <IconFriends size="1rem"></IconFriends>,
    url: "buddy",
    label: "Buddies",
    links: [],
  },
  {
    icon: <IconMessages size="1rem"></IconMessages>,
    url: "chat",
    label: "Chat",
    links: [],
  },
  // {
  //   icon: <IconMessages size="1rem"></IconMessages>,
  //   url: "cometchat",
  //   label: "Comet Chat",
  //   links: [],
  // },
];
