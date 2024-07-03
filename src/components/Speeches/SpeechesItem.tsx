import {
  Text,
  Grid,
  Paper,
  Flex,
  ActionIcon,
  useMantineTheme,
  Badge,
  Button,
} from "@mantine/core";
import {
  IconBrandPagekit,
  IconTrashX,
  IconVolume,
  IconVolume3,
  IconStack,
} from "@tabler/icons-react";
import { deleteModal } from "../../utils/deleteModal";
import { useParagraph } from "../../hooks/useParagraph";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import { useEffect, useState } from "react";
import { convertSecondsToHMS, playOrPauseAudio } from "../../utils/common";
import { useNavigate } from "react-router-dom";

const SpeechesItem: React.FC<{
  id: number;
  index: number;
  name: string;
  question: string;
  topic: string;
  level: string;
  your_speech: string;
  audio_url: string;
  handleSuccess: () => void;
  date: string;
  currentPage?: number;
}> = ({
  id,
  index,
  question,
  topic,
  level,
  your_speech,
  audio_url,
  handleSuccess,
  date,
  name,
  currentPage,
}) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState<number>(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const audio = new Audio(audio_url);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    return () => {
      audio.removeEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
    };
  }, [audio_url]);

  const theme = useMantineTheme();
  const { handleDeleteParagraph, onDeleteParagraph } = useParagraph();
  const handleDeleteSpeechesData = (id: number) => {
    onDeleteParagraph(
      id,
      () => {
        notificationShow("success", "Success!", "Speech unsaved successfully");
        handleSuccess();
      },
      (error) => {
        handleGlobalException(error, () => {});
      }
    );
  };
  useEffect(() => {
    setAudio(null);
  }, [id]);
  useEffect(() => {
    setIsPlaying(false);
    audio?.pause();
  }, [currentPage]);
  return (
    <>
      <Paper
        onClick={() => {
          navigate(`${id}`);
        }}
        style={{ cursor: "pointer" }}
        bg="#fefaf6"
        w="100%"
        p="md"
        radius="md"
        mb="1rem"
        withBorder
      >
        <Grid w="100%" justify="space-between" align="flex-start">
          <Grid.Col span={1}>
            <Text fw={450} fz={14} color="#454b53" mx="auto">
              {index}
            </Text>
          </Grid.Col>
          <Grid.Col span={2}>
            <Text fw={450} fz={14} color="#454b53" mx="auto">
              {name}
            </Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <Flex
              w="100%"
              justify="flex-start"
              align="flex-start"
              direction="column"
              gap="md"
            >
              {question && (
                <Text lineClamp={3} fw={450} fz={14} color="#454b53">
                  {question}
                </Text>
              )}
              {!question && (
                <Badge
                  tt="capitalize"
                  p="0.5rem 0.8rem"
                  radius="0.7rem"
                  fw={450}
                  fz={13}
                  h="auto"
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.navyBlurLight[0],
                      color: theme.colors.navyBlur[0],
                    },
                  })}
                >
                  Free subject
                </Badge>
              )}
              {topic && level && (
                <Flex gap="md">
                  <Button
                    p="0 1rem"
                    styles={(theme) => ({
                      root: {
                        pointerEvents: "none",
                        border: " 0.0625rem solid #dee2e6",
                        borderRadius: "1rem",
                        backgroundColor: "rgba(255, 239, 224, 0.1)",
                        ...theme.fn.hover({
                          backgroundColor: "rgba(255, 239, 224, 0.1)",
                        }),
                      },
                    })}
                    variant="default"
                  >
                    <Flex
                      justify="flex-center"
                      align="flex-center"
                      direction="row"
                      wrap="wrap"
                      gap="xs"
                    >
                      {/* <IconStack color="#f582a7" stroke={1.8} size="1.12rem" /> */}
                      <Text color="#f582a7" fz={13} fw={450}>
                        {level == "EASY"
                          ? "Easy"
                          : level == "MEDIUM"
                          ? "Medium"
                          : "Hard"}
                      </Text>
                    </Flex>
                  </Button>
                  <Button
                    p="0 1rem"
                    styles={(theme) => ({
                      root: {
                        pointerEvents: "none",
                        border: " 0.0625rem solid #dee2e6",
                        borderRadius: "1rem",
                        backgroundColor: "rgba(255, 239, 224, 0.1)",
                        ...theme.fn.hover({
                          backgroundColor: "rgba(255, 239, 224, 0.1)",
                        }),
                      },
                    })}
                    variant="default"
                  >
                    <Flex
                      justify="flex-center"
                      align="flex-center"
                      direction="row"
                      wrap="wrap"
                      gap="xs"
                    >
                      {/* <IconBrandPagekit
                        color="#1f4172"
                        stroke={1.8}
                        size="1.12rem"
                      /> */}
                      <Text color="#1f4172" fz={13} fw={450}>
                        {topic}
                      </Text>
                    </Flex>
                  </Button>
                </Flex>
              )}
            </Flex>
          </Grid.Col>{" "}
          <Grid.Col span={3}>
            <Text fw={450} fz={14} color="#454b53" lineClamp={2}>
              {your_speech}
            </Text>
          </Grid.Col>
          <Grid.Col span={1}>
            <Flex
              w="100%"
              justify="center"
              align="center"
              direction="row"
              gap="xs"
            >
              <ActionIcon
                onClick={(event) => {
                  event.stopPropagation();
                  if (audio) {
                    playOrPauseAudio(audio, isPlaying, setIsPlaying);
                  } else {
                    const audio = new Audio(audio_url);
                    setAudio(audio);
                    playOrPauseAudio(audio, isPlaying, setIsPlaying);
                  }
                }}
                className={isPlaying ? "actioniconDone" : "actionicon"}
                radius="xl"
                variant="filled"
              >
                {isPlaying ? (
                  <IconVolume3 size="1.1rem" />
                ) : (
                  <IconVolume size="1.1rem" />
                )}
              </ActionIcon>
              {/* <Text fw={450} fz={14} color="#454b53">
                {convertSecondsToHMS(duration)}
              </Text> */}
            </Flex>
          </Grid.Col>
          <Grid.Col span={2}>
            <Grid align="center" justify="space-between">
              <Grid.Col span="auto">
                <Text fw={450} fz={14} color="#454b53">
                  {date}
                </Text>
              </Grid.Col>
              <Grid.Col span="content">
                <ActionIcon
                  style={{
                    backgroundColor: "#FFC470",
                    ...theme.fn.hover({
                      backgroundColor: "#FFC470",
                    }),
                  }}
                  radius="md"
                  variant="filled"
                  loading={handleDeleteParagraph.isLoading}
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteModal(
                      "Unsave speeches",
                      "Are you sure you want to unsave this speeches?",
                      "Delete",
                      () => {
                        handleDeleteSpeechesData(id);
                      }
                    );
                  }}
                >
                  <IconTrashX size="1.1rem" />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
};

export default SpeechesItem;
