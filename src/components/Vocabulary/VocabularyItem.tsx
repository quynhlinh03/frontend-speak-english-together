import {
  Text,
  Grid,
  Paper,
  Flex,
  ActionIcon,
  Modal,
  Highlight,
  useMantineTheme,
} from "@mantine/core";
import { VocabularyExamples } from "./type";
import {
  IconGripVertical,
  IconTrashX,
  IconVolume,
  IconPencilMinus,
  IconVolume3,
} from "@tabler/icons-react";
import { deleteModal } from "../../utils/deleteModal";
import { useVocabulary } from "../../hooks/useVocabulary";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import { useDisclosure } from "@mantine/hooks";
import VocabularyForm from "./VocabularyForm";
import { useEffect, useState } from "react";
import VocabularyDetail from "./VocabularyDetail";
import { playOrPauseAudio } from "../../utils/common";

const VocabularyItem: React.FC<{
  id: number;
  word: string;
  word_audio_url: string | null;
  meaning_audio_url: string | null;
  meaning: string;
  examples: VocabularyExamples[];
  handleSuccess: () => void;
  context?: string;
  currentPage?: number;
}> = ({
  id,
  word,
  word_audio_url,
  meaning_audio_url,
  meaning,
  examples,
  handleSuccess,
  context,
  currentPage,
}) => {
  const theme = useMantineTheme();
  const { handleDeleteVocabulary, onDeleteVocabulary } = useVocabulary();
  const [
    openedEditVocabulary,
    { open: openEditVocabulary, close: closeEditVocabulary },
  ] = useDisclosure(false);
  const [
    openedViewVocabulary,
    { open: openViewVocabulary, close: closeViewVocabulary },
  ] = useDisclosure(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isCopyMean, setIsCopyMean] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  const [audioMean, setAudioMean] = useState<HTMLAudioElement | null>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingMean, setIsPlayingMean] = useState<boolean>(false);
  const handleDeleteVocabularyData = (id: number) => {
    onDeleteVocabulary(
      id,
      () => {
        notificationShow(
          "success",
          "Success!",
          "Vocabulary unsaved successfully"
        );
        handleSuccess();
      },
      (error) => {
        handleGlobalException(error, () => {});
      }
    );
  };
  useEffect(() => {
    setAudio(null);
    setAudioMean(null);
  }, [id]);
  useEffect(() => {
    setIsPlaying(false);
    audio?.pause();
    setIsPlayingMean(false);
    audioMean?.pause();
  }, [currentPage]);
  return (
    <>
      <Paper
        onClick={openViewVocabulary}
        style={{ cursor: "pointer" }}
        bg="#fefaf6"
        w="100%"
        p="md"
        withBorder
      >
        <Grid w="100%" justify="space-between" align="flex-start">
          <Grid.Col h="100%" my="auto" span="content">
            <IconGripVertical color="#868e96" size="1rem" />
          </Grid.Col>
          <Grid.Col span={3}>
            <Grid justify="flex-start" align="center">
              <Grid.Col p={0} pr={5} span="content" maw="88%">
                <Text fw={500} color="#F582A7" fz={14}>
                  {word}
                </Text>
              </Grid.Col>
              {word_audio_url && (
                <Grid.Col p={0} span="content">
                  <ActionIcon
                    onClick={(event) => {
                      event.stopPropagation();
                      if (audio) {
                        audio &&
                          playOrPauseAudio(
                            audio,
                            isPlayingMean,
                            setIsPlayingMean
                          );
                      } else {
                        const audioRes = new Audio(word_audio_url);
                        setAudio(audioRes);
                        playOrPauseAudio(
                          audioRes,
                          isPlayingMean,
                          setIsPlayingMean
                        );
                      }
                    }}
                  >
                    {isPlayingMean ? (
                      <IconVolume3 size="1.1rem" />
                    ) : (
                      <IconVolume size="1.1rem" />
                    )}
                  </ActionIcon>
                </Grid.Col>
              )}
            </Grid>
          </Grid.Col>
          <Grid.Col span={5}>
            {meaning && (
              <Flex
                gap="xs"
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <Grid justify="flex-start" align="center">
                  <Grid.Col pr={5} p="0" span="auto">
                    <Text color="#1F4172" fz={14} fw={500}>
                      {meaning}
                    </Text>
                  </Grid.Col>
                  {meaning_audio_url && (
                    <Grid.Col p="0" span="content">
                      <ActionIcon
                        onClick={(event) => {
                          event.stopPropagation();
                          if (audioMean) {
                            playOrPauseAudio(
                              audioMean,
                              isPlaying,
                              setIsPlaying
                            );
                          } else {
                            const audioRes = new Audio(meaning_audio_url);
                            setAudioMean(audioRes);
                            playOrPauseAudio(audioRes, isPlaying, setIsPlaying);
                          }
                        }}
                      >
                        {isPlaying ? (
                          <IconVolume3 size="1.1rem" />
                        ) : (
                          <IconVolume size="1.1rem" />
                        )}
                      </ActionIcon>
                    </Grid.Col>
                  )}
                </Grid>

                {examples[0]?.text && (
                  <Grid justify="flex-start" align="flex-start">
                    <Grid.Col pl={0} span="content" pr={5}>
                      <Text color="#868e96" fz={14} fw={400}>
                        Ex:
                      </Text>
                    </Grid.Col>
                    <Grid.Col px={0} span="auto">
                      <Highlight
                        lh={1.6}
                        highlight={word}
                        highlightStyles={() => ({
                          backgroundColor: "#F582A7",
                          fontWeight: 500,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        })}
                        pb={5}
                        color="#868e96"
                        fz={14}
                        fw={400}
                      >
                        {examples[0]?.text}
                      </Highlight>
                      <Highlight
                        lh={1.6}
                        highlight={meaning}
                        highlightStyles={(theme) => ({
                          backgroundColor: theme.colors.navyBlur[0],
                          fontWeight: 500,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        })}
                        pb={5}
                        color="#868e96"
                        fz={14}
                        fw={400}
                      >
                        {examples[0].translation}
                      </Highlight>
                    </Grid.Col>
                  </Grid>
                )}
              </Flex>
            )}
          </Grid.Col>
          <Grid.Col span="content">
            <Flex
              gap="xs"
              justify="flex-start"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <ActionIcon
                style={{
                  backgroundColor: "#FFC470",
                  ...theme.fn.hover({
                    backgroundColor: "#FFC470",
                  }),
                }}
                radius="md"
                variant="filled"
                onClick={(event) => {
                  event.stopPropagation();
                  openEditVocabulary();
                }}
              >
                <IconPencilMinus size="1.1rem" />
              </ActionIcon>
              <ActionIcon
                style={{
                  backgroundColor: "#FFC470",
                  ...theme.fn.hover({
                    backgroundColor: "#FFC470",
                  }),
                }}
                radius="md"
                variant="filled"
                loading={handleDeleteVocabulary.isLoading}
                onClick={(event) => {
                  event.stopPropagation();
                  deleteModal(
                    "Unsave vocabulary",
                    "Are you sure you want to unsave this vocabulary?",
                    "Delete",
                    () => {
                      handleDeleteVocabularyData(id);
                    }
                  );
                }}
              >
                <IconTrashX size="1.1rem" />
              </ActionIcon>
            </Flex>
          </Grid.Col>
        </Grid>
      </Paper>
      <Modal
        title="View vocabulary"
        opened={openedViewVocabulary}
        onClose={closeViewVocabulary}
        size={800}
        centered
        m={20}
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        <VocabularyDetail
          word={word}
          word_audio_url={word_audio_url}
          meaning_audio_url={meaning_audio_url}
          meaning={meaning}
          examples={examples}
          context={context}
          isCopy={isCopy}
          setIsCopy={setIsCopy}
          isCopyMean={isCopyMean}
          setIsCopyMean={setIsCopyMean}
        />
      </Modal>
      <Modal
        title="Edit vocabulary"
        opened={openedEditVocabulary}
        onClose={closeEditVocabulary}
        size={800}
        centered
        m={20}
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        <VocabularyForm
          id={id}
          handleAddSuccess={handleSuccess}
          handleCancel={closeEditVocabulary}
        />
      </Modal>
    </>
  );
};

export default VocabularyItem;
