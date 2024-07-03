import React from "react";
import {
  Avatar,
  Box,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import ava1 from "../../../src/assets/images/bee.png";
import ava2 from "../../../src/assets/images/savege.png";

const TopicContent: React.FC<{
  topic?: string;
  topic_url?: string;
  content: string;
  style?: boolean;
}> = ({ content, style, topic, topic_url }) => {
  const dialogues = content.split("\n").map((dialogue) => {
    const [speaker, message] = dialogue.split(":");
    return { speaker: speaker.trim(), message: message.trim() };
  });
  const speakers: string[] = dialogues.map((dialogue) => dialogue.speaker);
  const uniqueSpeakers = speakers.filter((speaker, index) => {
    return speakers.indexOf(speaker) === index;
  });

  return (
    <Paper
      className="paperColor"
      {...(style ? {} : { withBorder: true })}
      p="md"
      shadow="lg"
      radius={20}
    >
      <Flex
        gap="md"
        justify="center"
        align="flex-end"
        direction="column"
        wrap="wrap"
      >
        {topic && (
          <Flex
            gap="xs"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Text fz={12} fw={400} color="dimmed">
              Topic:
            </Text>
            {topic_url && <Avatar size={20} src={topic_url}></Avatar>}
            <div>
              <Text fw={400} fz={14}>
                {topic}
              </Text>
            </div>
          </Flex>
        )}
        <ScrollArea w="100%" h={780} type="never">
          {dialogues.map((dialogue, index) => (
            <Flex
              py={10}
              key={index}
              gap="sm"
              justify={
                dialogue.speaker === uniqueSpeakers[0]
                  ? "flex-start"
                  : "flex-start"
              }
              align="center"
              direction={
                dialogue.speaker === uniqueSpeakers[0] ? "row" : "row-reverse"
              }
              wrap="wrap"
            >
              <Avatar
                src={dialogue.speaker === uniqueSpeakers[0] ? ava1 : ava2}
              ></Avatar>
              <Flex
                gap={3}
                justify={
                  dialogue.speaker === uniqueSpeakers[0] ? "start" : "end"
                }
                align={dialogue.speaker === uniqueSpeakers[0] ? "start" : "end"}
                direction="column"
                wrap="wrap"
              >
                <Text color="#868e96" fz={12}>
                  {dialogue.speaker}
                </Text>
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      dialogue.speaker === uniqueSpeakers[0]
                        ? "rgba(31, 65, 114, 0.05)"
                        : "#B3C8CF",
                    textAlign:
                      dialogue.speaker === uniqueSpeakers[0] ? "start" : "end",
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.md,
                    cursor: "pointer",
                  })}
                  maw={style ? 300 : 450}
                >
                  <Text>{dialogue.message}</Text>
                </Box>
              </Flex>
            </Flex>
          ))}
        </ScrollArea>
      </Flex>
    </Paper>
  );
};

export default TopicContent;
