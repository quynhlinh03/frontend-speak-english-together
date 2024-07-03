import {
  ActionIcon,
  Flex,
  Paper,
  Textarea,
  Grid,
  Button,
  Modal,
  Text,
  Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { TranslateProps, TranslateResProps } from "./type";
import {
  IconExchange,
  IconVolume,
  IconVolume3,
  IconMicrophone,
  IconCopy,
  IconCopyCheck,
  IconPlayerStopFilled,
} from "@tabler/icons-react";
import useUserProfile from "../../hooks/useUserProfile";
import { useTranslate } from "../../hooks/useTranslate";
import { handleGlobalException } from "../../utils/error";
import { Vocabulary } from "../Vocabulary/type";
import { useSpeech } from "../../hooks/useSpeech";
import { useDisclosure } from "@mantine/hooks";
import CollectionsListModal from "../Collections/CollectionsListModal";
import TranslateModal from "./TranslateModal";
import { native_language, playOrPauseAudio } from "../../utils/common";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { notificationShow } from "../Notification";

const TranslateTool: React.FC<{ style?: boolean; isSmall?: boolean }> = ({
  style,
  isSmall,
}) => {
  const { userProfile, fetchUserProfile } = useUserProfile();
  const [from, setFrom] = useState(userProfile?.data.native_language);
  const [to, setTo] = useState("english");
  const [text, setText] = useState<string>();
  const [vocabulary, setVocabulary] = useState<Vocabulary | null>();
  const [translate, setTranslate] = useState<TranslateResProps | null>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isCopyMean, setIsCopyMean] = useState<boolean>(false);
  const { onSubmitHandleTranslate, handleTranslate } = useTranslate();
  const { handleToSpeech, onSubmitHandleToSpeech } = useSpeech();
  const [isWord, setIsWord] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  const [audioMean, setAudioMean] = useState<HTMLAudioElement | null>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingMean, setIsPlayingMean] = useState<boolean>(false);
  const { handleToText, onSubmitHandleToText } = useSpeechToText();
  const { startRecording, stopRecording, recordingBlob, isRecording } =
    useAudioRecorder();

  let detechItem =
    // {
    //   image:
    //     "https://storage.googleapis.com/speaking-english-together.appspot.com/images/1716566754501_detection1.png",
    //   label: "Detect language",
    //   value: "",
    // };
    {
      label: "Detect language",
      value: "",
    };
  let nationalDataFrom = [detechItem, ...native_language];
  const [opened, { open, close }] = useDisclosure(false);

  const handleTranslateData = async (data: TranslateProps) => {
    onSubmitHandleTranslate(
      data,
      (res) => {
        setTranslate(res.data);
        setVocabulary((prev) => {
          return {
            ...prev,
            word: text,
            ...res.data,
          };
        });
      },
      (error) => {
        handleGlobalException(error, () => {});
        setTranslate(null);
      }
    );
  };

  function handleTextToSpeech({
    text,
    isText,
  }: {
    text: string;
    isText: boolean;
  }) {
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };

    onSubmitHandleToSpeech(
      { text: text },
      (res) => {
        const audio = new Audio(res.data);
        if (isText) {
          setAudio(audio);
          playOrPauseAudio(audio, isPlaying, setIsPlaying);
        } else {
          setAudioMean(audio);
          playOrPauseAudio(audio, isPlayingMean, setIsPlayingMean);
        }
        setVocabulary((prev) => {
          return isText
            ? {
                ...prev,
                word_audio_url: res.data,
              }
            : {
                ...prev,
                meaning_audio_url: res.data,
              };
        });
      },
      handleError
    );
  }

  useEffect(() => {
    setAudio(null);
  }, [text]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!recordingBlob) return;
    const url = URL.createObjectURL(recordingBlob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    const file = new File([recordingBlob], "recording.webm", {
      type: recordingBlob.type,
      lastModified: new Date().getTime(),
    });

    if (file) {
      onSubmitHandleToText(
        { audio: file },
        (res) => {
          if (typeof res.data.transcription === "string") {
            setText(res.data.transcription);
            setTranslate(null);
            setVocabulary(null);
          } else {
            notificationShow(
              "error",
              "Error!",
              "Cannot hear your speech, please try again"
            );
          }
        },
        (error) => {
          handleGlobalException(error, () => {});
        }
      );
    }
  }, [recordingBlob]);

  return (
    <Flex
      p={style ? "" : "2rem"}
      w="100%"
      gap={style ? "2rem" : "3rem"}
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <Flex
        w={isSmall || style ? "100%" : "80%"}
        gap={style ? "1rem" : "2rem"}
        justify="center"
        align="center"
        direction={style ? "column" : "row"}
        wrap="wrap"
      >
        <Select
          className="customTextInput profile"
          placeholder="Translate from"
          data={nationalDataFrom}
          value={from}
          onChange={(selectedValue: string) => setFrom(selectedValue)}
        />
        {/* <SelectCustom
          props={{
            data: nationalDataFrom,
            placeholder: "Translate from",
            onChange: (selectedValue: string) => setFrom(selectedValue),
            value: from,
          }}
        /> */}
        <ActionIcon
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="actionicon"
          radius="xl"
          variant="filled"
        >
          <IconExchange size="1.125rem" />
        </ActionIcon>
        <Select
          className="customTextInput profile"
          placeholder="Translate to"
          data={native_language}
          value={to}
          onChange={(selectedValue: string) => setTo(selectedValue)}
        />
        {/* <SelectCustom
          props={{
            data: nationalData,
            placeholder: "Translate to",
            onChange: (selectedValue: string) => setTo(selectedValue),
            value: to,
          }}
        /> */}
        <Button
          loading={handleTranslate.isLoading}
          fz={13}
          fw={500}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.navyBlur[0],
              color: theme.white,
              ...theme.fn.hover({
                backgroundColor: theme.fn.darken(theme.colors.navyBlur[0], 0.1),
              }),
            },
          })}
          radius={20}
          px="1rem"
          ml={style ? "" : "2rem"}
          onClick={() => {
            setIsSaved(false);
            text &&
              handleTranslateData({
                text: text,
                to: to,
                from: from,
              });
          }}
        >
          Translate
        </Button>
      </Flex>
      <Paper
        bg="#fefaf6"
        radius="md"
        w={isSmall || style ? "100%" : "80%"}
        shadow="xs"
        p="md"
      >
        <Grid>
          <Grid.Col span="auto">
            <Textarea
              className="textarea"
              radius="md"
              placeholder="Type to translate"
              autosize
              minRows={5}
              value={text}
              onChange={(event) => {
                setText(event.currentTarget.value);
                setTranslate(null);
                setVocabulary(null);
              }}
            />
            {vocabulary?.meaning && (
              <Button
                mt="xs"
                onClick={() => {
                  if (vocabulary && !isSaved) {
                    open();
                  }
                }}
                styles={(theme) =>
                  !isSaved
                    ? {
                        root: {
                          backgroundColor: theme.colors.orangeLight[0],
                          color: theme.colors.orange[0],
                          ...theme.fn.hover({
                            backgroundColor: theme.fn.darken(
                              theme.colors.orangeLight[0],
                              0.1
                            ),
                          }),
                        },
                      }
                    : {
                        root: {
                          backgroundColor: theme.colors.navyBlurLight[0],
                          color: theme.colors.navyBlur[0],
                          ...theme.fn.hover({
                            backgroundColor: theme.fn.darken(
                              theme.colors.navyBlurLight[0],
                              0.1
                            ),
                          }),
                        },
                      }
                }
                fz={13}
                fw={500}
                variant="light"
                radius={20}
              >
                {!isSaved ? "Save" : "Saved"}
              </Button>
            )}
            {translate?.status === "not_found" && (
              <Text pt="xs" fz={13} fw={420} color="red">
                The input text is probably incorrect. Please try again.
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span="content">
            <Flex
              gap="1rem"
              justify="flex-end"
              align="center"
              direction="column"
              wrap="wrap"
            >
              {text && (
                <ActionIcon
                  loading={handleToSpeech.isLoading && isWord}
                  onClick={() => {
                    setIsWord(true);
                    if (!audio) {
                      handleTextToSpeech({ text: text, isText: true });
                    } else {
                      playOrPauseAudio(audio, isPlaying, setIsPlaying);
                    }
                  }}
                  className={isPlaying ? "actioniconDone" : "actionicon"}
                  radius="xl"
                  variant="filled"
                >
                  {isPlaying ? (
                    <IconVolume3 size="1.125rem" />
                  ) : (
                    <IconVolume size="1.125rem" />
                  )}
                </ActionIcon>
              )}
              <ActionIcon
                loading={handleToText.isLoading}
                onClick={
                  isRecording
                    ? () => {
                        stopRecording();
                      }
                    : () => {
                        startRecording();
                      }
                }
                className={!isRecording ? "actionicon" : "actioniconDone"}
                radius="xl"
                variant="filled"
              >
                {isRecording ? (
                  <IconPlayerStopFilled size="1.125rem" />
                ) : (
                  <IconMicrophone size="1.125rem" />
                )}
              </ActionIcon>
              <ActionIcon
                className={isCopy ? "actioniconDone" : "actionicon"}
                radius="xl"
                variant="filled"
                onClick={() => {
                  if (text) {
                    navigator.clipboard.writeText(text);
                    setIsCopy(true);
                    setTimeout(() => {
                      setIsCopy(false);
                    }, 5000);
                  }
                }}
              >
                {isCopy ? (
                  <IconCopyCheck size="1.125rem" />
                ) : (
                  <IconCopy size="1.125rem" />
                )}
              </ActionIcon>
            </Flex>
          </Grid.Col>
        </Grid>
      </Paper>

      {translate?.status === "success" && (
        <TranslateModal
          style={style}
          text={text}
          translate={translate}
          setIsWord={setIsWord}
          setIsCopyMean={setIsCopyMean}
          vocabulary={vocabulary}
          isCopyMean={isCopyMean}
          handleTextToSpeech={handleTextToSpeech}
          isWord={isWord}
          handleToSpeech={handleToSpeech}
          audioMean={audioMean}
          isPlayingMean={isPlayingMean}
          setIsPlayingMean={setIsPlayingMean}
          setAudioMean={setAudioMean}
        />
      )}

      {vocabulary?.word && (
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
            vocabulary={vocabulary}
            setIsSaved={setIsSaved}
            handleSuccessAddVocabulary={() => {
              close();
            }}
          />
        </Modal>
      )}
    </Flex>
  );
};

export default TranslateTool;
