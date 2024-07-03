import {
  ActionIcon,
  Button,
  Center,
  Container,
  Flex,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconPlayerStopFilled,
  IconMicrophoneFilled,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { handleGlobalException } from "../../utils/error";
import { AxiosResponse } from "axios";
import { UseMutationResult } from "@tanstack/react-query";
import { notificationShow } from "../Notification";
import { deleteModal } from "../../utils/deleteModal";
import { AnalyzeDataProps } from "./type";

interface VoiceRecordProps {
  setYourText: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setIsAnalyze: React.Dispatch<React.SetStateAction<boolean>>;
  yourText: string | null;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  handleAnalyzeText: UseMutationResult<
    AxiosResponse<any, any>,
    unknown,
    {
      text: string;
      question: string;
    },
    unknown
  >;
  setOriginalAudio: React.Dispatch<React.SetStateAction<string | undefined>>;
  analyzeData: AnalyzeDataProps | null | undefined;
  setAnalyzeData: React.Dispatch<
    React.SetStateAction<AnalyzeDataProps | null | undefined>
  >;
  isShowAnalyze: boolean;
  setIsShowAnalyze: React.Dispatch<React.SetStateAction<boolean>>
}

function VoiceRecord({
  setYourText,
  setIsAnalyze,
  setActive,
  handleAnalyzeText,
  setOriginalAudio,
  analyzeData,
  setAnalyzeData,
  isShowAnalyze, setIsShowAnalyze
}: VoiceRecordProps) {
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
      2,
      "0"
    )} : ${String(seconds).padStart(2, "0")}`;
  };

  const audioTrackConstraints = {
    noiseSuppression: true,
    echoCancellation: true,
  };

  const onNotAllowedOrFound = (error: any) => {
    console.log("getUserMedia error:", error);
  };

  const { handleToText, onSubmitHandleToText } = useSpeechToText();

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder(audioTrackConstraints, onNotAllowedOrFound);
  const audioContainerRef = useRef(null);
  const [isDiscard, setIsDiscard] = useState(true);

  useEffect(() => {
    if (!isDiscard) {
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
              setYourText(res.data.transcription);
              setOriginalAudio(res.data.audioUrl);
              setActive(3);
              setIsShowAnalyze(true);
            } else {
              setIsShowAnalyze(false);
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
      if (audioContainerRef.current) {
        if (audioContainerRef.current.innerHTML) {
          setIsShowAnalyze(false);
          setIsAnalyze(false);
          audioContainerRef.current.innerHTML = "";
        }
        audioContainerRef.current.appendChild(audio);
      }
    }
  }, [recordingBlob]);

  const discardRecording = () => {
    if (isRecording) {
      stopRecording();
      setIsDiscard(true);
    }
  };

  return (
    <Flex
      w="100%"
      gap="md"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      {isRecording && (
        <Text pb="1rem" color="#fa5252" fz={16} fw={600}>
          {formatTime(recordingTime)}
        </Text>
      )}
      <Flex
        w="100%"
        gap="2rem"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Tooltip fz={12} label="Discard">
          <ActionIcon
            className="voiceIcon"
            style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 15px 0px" }}
            bg="#fff"
            size="2rem"
            radius="2rem"
            variant="filled"
            onClick={discardRecording}
          >
            <IconPlayerStopFilled color="#fa5252" size="1.125rem" />
          </ActionIcon>
        </Tooltip>
        <ActionIcon
          className={isRecording && !isPaused ? "animation" : ""}
          style={{ boxShadow: "rgba(250, 82, 82, 0.2) 0px 5px 15px 0px" }}
          color="red"
          size="4rem"
          radius="4rem"
          variant="filled"
          loading={handleToText.isLoading}
          onClick={
            isRecording
              ? () => {
                  setIsDiscard(false);
                  stopRecording();
                }
              : () => {
                  if (analyzeData) {
                    deleteModal(
                      "Confirm recording",
                      "If you record again, analyzed speech will be lost. Do you want this?",
                      "Confirm",
                      () => {
                        setIsShowAnalyze(false);
                        startRecording();
                        setAnalyzeData(null);
                      }
                    );
                  } else {
                    startRecording();
                  }
                }
          }
        >
          <IconMicrophoneFilled size="1.4rem" />
        </ActionIcon>
        <Tooltip fz={12} label="Pause">
          <ActionIcon
            className="voiceIcon"
            style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 15px 0px" }}
            bg="#fff"
            size="2rem"
            radius="2rem"
            variant="filled"
            onClick={togglePauseResume}
          >
            {isPaused ? (
              <IconPlayerPlayFilled color="#fa5252" size="1.125rem" />
            ) : (
              <IconPlayerPauseFilled color="#fa5252" size="1.125rem" />
            )}
          </ActionIcon>
        </Tooltip>
      </Flex>
      <Center>
        <Text color="#868e96" fz={12} fw={400}>
          {isRecording ? "Tap to stop" : "Tap to speak"}
        </Text>
      </Center>

      <Container p={0} ref={audioContainerRef} />

      {isShowAnalyze && (
        <Button
          loading={handleAnalyzeText.isLoading}
          onClick={() => {
            setIsAnalyze(true);
          }}
          mt={10}
          p="0 0.7rem"
          fw={500}
          fz={14}
          radius="1.5rem"
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.pinkPastel[0],
              ...theme.fn.hover({
                backgroundColor: theme.fn.darken(
                  theme.colors.pinkPastel[0],
                  0.1
                ),
              }),
            },
          })}
        >
          Analyze
        </Button>
      )}
    </Flex>
  );
}

export default VoiceRecord;
