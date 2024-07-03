import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Flex,
  Paper,
  Text,
  ActionIcon,
  Avatar,
  Grid,
  Modal,
} from "@mantine/core";
import {
  IconPlus,
  IconVolume,
  IconVolume3,
  IconCheck,
} from "@tabler/icons-react";
import { playOrPauseAudio } from "../../../utils/common";
import { handleGlobalException } from "../../../utils/error";
import { useSpeech } from "../../../hooks/useSpeech";
import { useDisclosure } from "@mantine/hooks";
import CollectionsListModal from "../../Collections/CollectionsListModal";

export const SentencesItem: React.FC<{
  index: number;
  english: string;
  translate: string;
}> = ({ index, english, translate }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  const [url, setUrl] = useState();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { handleToSpeech, onSubmitHandleToSpeech } = useSpeech();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [opened, { open, close }] = useDisclosure(false);

  function handleTextToSpeech({ text }: { text: string }) {
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };

    onSubmitHandleToSpeech(
      { text: text },
      (res) => {
        setUrl(res.data);
        const audio = new Audio(res.data);
        setAudio(audio);
        playOrPauseAudio(audio, isPlaying, setIsPlaying);
      },
      handleError
    );
  }
  return (
    <Paper p="0.5rem" w="100%">
      <Grid w="100%" justify="flex-start" align="flex-start">
        <Grid.Col span="content">
          <Avatar radius="xl" size={40} className="indexBg">
            {index + 1}
          </Avatar>
        </Grid.Col>
        <Grid.Col span="auto">
          <Flex gap={2} align="flex-start" justify="flex-start" direction="column">
            <Text color="#212529" fw={450}>
              {english}
            </Text>
            <Text color="#868e96">{translate}</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span="content">
          <Flex
            gap="0.4rem"
            align="center"
            justify="flex-start"
            direction="column"
          >
            <ActionIcon
              loading={handleToSpeech.isLoading}
              onClick={() => {
                if (!audio) {
                  handleTextToSpeech({
                    text: english,
                  });
                } else {
                  playOrPauseAudio(audio, isPlaying, setIsPlaying);
                }
              }}
              className={isPlaying ? "actioniconDone" : "actionicon"}
              radius="xl"
              variant="filled"
            >
              {isPlaying ? (
                <IconVolume3 size="1rem" />
              ) : (
                <IconVolume size="1rem" />
              )}
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                if (!isSaved) {
                  open();
                }
              }}
              radius="xl"
              variant="filled"
            >
              {isSaved ? <IconCheck size="1rem" /> : <IconPlus size="1rem" />}
            </ActionIcon>
          </Flex>
        </Grid.Col>
      </Grid>
      <Modal
        title="Save to"
        opened={opened}
        onClose={close}
        size={450}
        centered
        m={20}
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        <CollectionsListModal
          vocabulary={{
            word: english,
            meaning: translate,
            word_audio_url: url,
          }}
          setIsSaved={setIsSaved}
          handleSuccessAddVocabulary={() => {
            close();
          }}
        />
      </Modal>
    </Paper>
  );
};
