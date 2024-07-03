import { ActionIcon, Flex, List, Text, Textarea } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import { IconVolume, IconVolume3 } from "@tabler/icons-react";
import { handleGlobalException } from "../../../utils/error";
import { useSpeech } from "../../../hooks/useSpeech";
import { useEffect, useState } from "react";
import { playOrPauseAudio } from "../../../utils/common";

interface AnalysisItemProps {
  title: string;
  content?: string;
  text?: string;
  arr?: Array<string>;
  setUpgradedAudio?: React.Dispatch<React.SetStateAction<string | null>>;
  upgradedAudio?: string | null;
  originalAudio?: string | undefined;
  is_audio?: boolean;
  color?: string;
  icon?: any;
  underline?: boolean;
  element?: any;
}

function AnalysisItem({
  title,
  content,
  text,
  arr,
  upgradedAudio,
  setUpgradedAudio,
  originalAudio,
  is_audio,
  color,
  icon,
  underline,
  element,
}: AnalysisItemProps) {
  const { handleToSpeech, onSubmitHandleToSpeech } = useSpeech();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>();

  useEffect(() => {
    setAudio(null);
    setUpgradedAudio?.(null);
  }, [text]);

  function handleTextToSpeech(text: string) {
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };

    onSubmitHandleToSpeech(
      { text: text },
      (res) => {
        setUpgradedAudio && setUpgradedAudio(res.data);
        const audio = new Audio(res.data);
        setAudio(audio);
        playOrPauseAudio(audio, isPlaying, setIsPlaying);
      },
      handleError
    );
  }
  return (
    <Flex
      w="100%"
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      <Flex
        w="100%"
        gap="xs"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {icon}
        <Text
          td={underline ? "underline" : ""}
          pr={6}
          color={color || "#1f4172"}
          fz={14}
          fw={500}
        >
          {title}
        </Text>
        {(is_audio || originalAudio) && (
          <ActionIcon
            loading={handleToSpeech.isLoading}
            onClick={() => {
              if (upgradedAudio || originalAudio) {
                if (audio) {
                  playOrPauseAudio(audio, isPlaying, setIsPlaying);
                } else {
                  const audioRes = new Audio(upgradedAudio || originalAudio);
                  setAudio(audioRes);
                  playOrPauseAudio(audioRes, isPlaying, setIsPlaying);
                }
              } else {
                text && handleTextToSpeech(text);
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
      </Flex>
      {content && (
        <Textarea
          style={{ pointerEvents: "none" }}
          w="100%"
          className="customTextInput profile iconArea"
          radius="md"
          autosize
          value={content}
        ></Textarea>
      )}
      {text && !element && <Text>{text}</Text>}
      {element && element}
      {arr && (
        <List mt={-5}>
          {arr.map((item, index) => {
            return (
              <List.Item
                py={5}
                key={index}
                icon={<IconPointFilled className="color4" size="0.9rem" />}
              >
                <Text py={2} fz={14}>
                  {item}
                </Text>
              </List.Item>
            );
          })}
        </List>
      )}
    </Flex>
  );
}

export default AnalysisItem;
