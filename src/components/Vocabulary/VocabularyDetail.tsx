import {
  Text,
  Grid,
  Paper,
  Flex,
  ActionIcon,
  Highlight,
  Accordion,
  List,
  rem,
} from "@mantine/core";
import { VocabularyExamples } from "./type";
import {
  IconVolume,
  IconVolume3,
  IconCopyCheck,
  IconCopy,
  IconBulbFilled,
  IconPawFilled,
  IconPointFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { capitalizeFirstLetter, playOrPauseAudio } from "../../utils/common";

const VocabularyDetail: React.FC<{
  word: string;
  word_audio_url?: string | null;
  meaning_audio_url?: string | null;
  meaning?: string;
  examples?: VocabularyExamples[];
  context?: string;
  isCopy: boolean;
  setIsCopy: React.Dispatch<React.SetStateAction<boolean>>;
  isCopyMean: boolean;
  setIsCopyMean: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  word,
  word_audio_url,
  meaning_audio_url,
  meaning,
  examples,
  context,
  isCopy,
  setIsCopy,
  isCopyMean,
  setIsCopyMean,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingMean, setIsPlayingMean] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>();
  const [audioMean, setAudioMean] = useState<HTMLAudioElement | null>();

  return (
    <Paper bg="#fefaf6" radius="md" w="100%" shadow="xs" p="md">
      <Flex
        justify="flex-start"
        align="flex-start"
        direction="column"
        gap="1rem"
      >
        <Accordion
          className="accordionCustom"
          radius="md"
          bg="#fefaf6"
          w="100%"
          chevronPosition="right"
          variant="contained"
          multiple
          defaultValue={["word", "meaning", "examples", "context"]}
        >
          <Accordion.Item value="word">
            <Accordion.Control
              bg="#fefaf6"
              icon={<IconBulbFilled color="#FFC470" size={rem(14)} />}
              fz={14}
              lh={1.6}
            >
              {" "}
              <Text color="#212529"> Word</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Grid justify="space-between" align="center">
                <Grid.Col span="auto">
                  {word && (
                    <Highlight
                      lh={1.6}
                      highlight={word}
                      highlightStyles={(theme) => ({
                        backgroundColor: theme.colors.orange[0],
                        fontWeight: 500,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      })}
                      color="#212529"
                    >
                      {word}
                    </Highlight>
                  )}
                </Grid.Col>
                <Grid.Col span="content">
                  <Flex
                    w="100%"
                    gap="1rem"
                    justify="flex-end"
                    align="center"
                    direction="row"
                    wrap="wrap"
                  >
                    <ActionIcon
                      onClick={() => {
                        if (word_audio_url) {
                          if (audio) {
                            playOrPauseAudio(audio, isPlaying, setIsPlaying);
                          } else {
                            const audioRes = new Audio(word_audio_url);
                            setAudio(audioRes);
                            playOrPauseAudio(audioRes, isPlaying, setIsPlaying);
                          }
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

                    <ActionIcon
                      onClick={() => {
                        word && navigator.clipboard.writeText(word);
                        setIsCopy(true);
                        setTimeout(() => {
                          setIsCopy(false);
                        }, 5000);
                      }}
                      className={isCopy ? "actioniconDone" : "actionicon"}
                      radius="xl"
                      variant="filled"
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
            </Accordion.Panel>
          </Accordion.Item>
          {meaning && (
            <Accordion.Item value="meaning">
              <Accordion.Control
                bg="#fefaf6"
                icon={<IconBulbFilled className="color1" size={rem(14)} />}
                fz={14}
                lh={1.6}
              >
                <Text color="#212529">Meaning</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Grid justify="space-between" align="center">
                  <Grid.Col span="auto">
                    {meaning && (
                      <Highlight
                        lh={1.6}
                        highlight={meaning}
                        highlightStyles={(theme) => ({
                          backgroundColor: theme.colors.navyBlur[0],
                          fontWeight: 500,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        })}
                        color="#212529"
                      >
                        {meaning}
                      </Highlight>
                    )}
                  </Grid.Col>
                  <Grid.Col span="content">
                    {" "}
                    <Flex
                      gap="1rem"
                      justify="center"
                      align="center"
                      direction="row"
                      wrap="wrap"
                    >
                      <ActionIcon
                        onClick={() => {
                          if (meaning_audio_url) {
                            if (audioMean) {
                              playOrPauseAudio(
                                audioMean,
                                isPlayingMean,
                                setIsPlayingMean
                              );
                            } else {
                              const audioRes = new Audio(meaning_audio_url);
                              setAudioMean(audioRes);
                              playOrPauseAudio(
                                audioRes,
                                isPlayingMean,
                                setIsPlayingMean
                              );
                            }
                          }
                        }}
                        className={
                          isPlayingMean ? "actioniconDone" : "actionicon"
                        }
                        radius="xl"
                        variant="filled"
                      >
                        {isPlayingMean ? (
                          <IconVolume3 size="1.125rem" />
                        ) : (
                          <IconVolume size="1.125rem" />
                        )}
                      </ActionIcon>

                      <ActionIcon
                        onClick={() => {
                          meaning && navigator.clipboard.writeText(meaning);
                          setIsCopyMean(true);
                          setTimeout(() => {
                            setIsCopyMean(false);
                          }, 5000);
                        }}
                        className={isCopyMean ? "actioniconDone" : "actionicon"}
                        radius="xl"
                        variant="filled"
                      >
                        {isCopyMean ? (
                          <IconCopyCheck size="1.125rem" />
                        ) : (
                          <IconCopy size="1.125rem" />
                        )}
                      </ActionIcon>
                    </Flex>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {examples && examples[0] && (
            <Accordion.Item bg="#fefaf6" value="examples">
              <Accordion.Control
                bg="#fefaf6"
                icon={<IconPawFilled className="color2" size={rem(14)} />}
                fz={14}
              >
                <Text color="#212529">Examples</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <List mt={-5}>
                  {word &&
                    examples?.map((item, index) => {
                      return (
                        <List.Item
                          py={5}
                          key={index}
                          icon={
                            <IconPointFilled className="color4" size="0.9rem" />
                          }
                        >
                          <Highlight
                            py={2}
                            fz={14}
                            lh={1.6}
                            highlight={word}
                            highlightStyles={(theme) => ({
                              backgroundColor: theme.colors.orange[0],
                              fontWeight: 500,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            })}
                            color="#212529"
                          >
                            {item.text}
                          </Highlight>
                          {meaning && item.translation && (
                            <Highlight
                              lh={1.6}
                              highlight={meaning}
                              highlightStyles={(theme) => ({
                                backgroundColor: theme.colors.navyBlur[0],
                                fontWeight: 500,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              })}
                              py={2}
                              color="#868e96"
                              fz={14}
                            >
                              {item.translation}
                            </Highlight>
                          )}
                        </List.Item>
                      );
                    })}
                </List>
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {context && (
            <Accordion.Item value="context">
              <Accordion.Control
                bg="#fefaf6"
                icon={<IconPawFilled className="color3" size={rem(14)} />}
                fz={14}
                color="#212529"
              >
                <Text color="#212529">Context</Text>
              </Accordion.Control>
              <Accordion.Panel>
                {word && context && meaning && (
                  <Highlight
                    lh={1.6}
                    highlight={[word, meaning]}
                    sx={(theme) => ({
                      [`& [data-highlight="${word}"]`]: {
                        backgroundColor: theme.colors.orange[0],
                      },
                      [`& [data-highlight="${word.toLowerCase()}"]`]: {
                        backgroundColor: theme.colors.orange[0],
                      },
                      [`& [data-highlight="${capitalizeFirstLetter(word)}"]`]: {
                        backgroundColor: theme.colors.orange[0],
                      },
                      [`& [data-highlight="${meaning}"]`]: {
                        backgroundColor: theme.colors.navyBlur[0],
                      },
                      [`& [data-highlight="${meaning.toLowerCase()}"]`]: {
                        backgroundColor: theme.colors.navyBlur[0],
                      },
                      [`& [data-highlight="${capitalizeFirstLetter(meaning)}"]`]: {
                        backgroundColor: theme.colors.navyBlur[0],
                      },
                    })}
                    highlightStyles={() => ({
                      fontWeight: 500,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    })}
                    color="#212529"
                  >
                    {context}
                  </Highlight>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      </Flex>
    </Paper>
  );
};

export default VocabularyDetail;
