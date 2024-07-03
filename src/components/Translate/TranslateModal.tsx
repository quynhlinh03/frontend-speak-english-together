import {
  ActionIcon,
  Flex,
  Paper,
  Text,
  Grid,
  Accordion,
  rem,
  List,
  Highlight,
} from "@mantine/core";
import {
  IconVolume,
  IconCopy,
  IconPawFilled,
  IconPointFilled,
  IconBulbFilled,
  IconCopyCheck,
  IconVolume3,
} from "@tabler/icons-react";
import { TranslateResProps } from "./type";
import { Vocabulary } from "../Vocabulary/type";
import { capitalizeFirstLetter, playOrPauseAudio } from "../../utils/common";
import { useEffect } from "react";

const TranslateModal: React.FC<{
  style?: boolean;
  text?: string;
  translate?: TranslateResProps | null;
  setIsWord: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCopyMean: React.Dispatch<React.SetStateAction<boolean>>;
  vocabulary?: Vocabulary | null;
  isCopyMean: boolean;
  handleTextToSpeech: any;
  isWord: boolean;
  handleToSpeech: any;
  audioMean: HTMLAudioElement;
  isPlayingMean: boolean;
  setIsPlayingMean: React.Dispatch<React.SetStateAction<boolean>>;
  setAudioMean: React.Dispatch<
    React.SetStateAction<HTMLAudioElement | null | undefined>
  >;
}> = ({
  style,
  text,
  translate,
  setIsWord,
  setIsCopyMean,
  vocabulary,
  handleToSpeech,
  isCopyMean,
  handleTextToSpeech,
  isWord,
  audioMean,
  isPlayingMean,
  setIsPlayingMean,
  setAudioMean,
}) => {
  useEffect(() => {
    if (translate?.meaning) {
      setAudioMean(null);
    }
  }, [translate?.meaning]);

  return (
    <>
      {translate && (
        <Paper
          bg="#fefaf6"
          radius="md"
          w={style ? "100%" : "80%"}
          shadow="xs"
          p="md"
        >
          <Grid>
            <Grid.Col span="auto">
              {translate?.status === "success" ? (
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
                    defaultValue={["meaning", "examples", "context"]}
                  >
                    <Accordion.Item value="meaning">
                      <Accordion.Control
                        className="meaning"
                        bg="#fefaf6"
                        icon={
                          <IconBulbFilled className="color1" size={rem(14)} />
                        }
                        fz={14}
                        lh={1.6}
                      >
                        <Text fw={500} color="#fc6736">
                          {translate?.meaning}
                        </Text>
                      </Accordion.Control>
                    </Accordion.Item>

                    <Accordion.Item bg="#fefaf6" value="examples">
                      <Accordion.Control
                        bg="#fefaf6"
                        icon={
                          <IconPawFilled className="color2" size={rem(14)} />
                        }
                        fz={14}
                      >
                        <Text color="#212529">Examples</Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <List mt={-5}>
                          {text &&
                            translate?.examples?.map((item, index) => {
                              return (
                                <List.Item
                                  py={5}
                                  key={index}
                                  icon={
                                    <IconPointFilled
                                      className="color4"
                                      size="0.9rem"
                                    />
                                  }
                                >
                                  <Highlight
                                    py={2}
                                    fz={14}
                                    lh={1.6}
                                    highlight={text}
                                    highlightStyles={(theme) => ({
                                      backgroundColor: theme.colors.navyBlur[0],
                                      fontWeight: 500,
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                    })}
                                    color="#212529"
                                  >
                                    {item.text}
                                  </Highlight>
                                  {translate?.meaning ? (
                                    <Highlight
                                      py={2}
                                      fz={14}
                                      lh={1.6}
                                      highlight={translate?.meaning}
                                      highlightStyles={() => ({
                                        backgroundColor: "#fc6736",
                                        fontWeight: 500,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                      })}
                                      color="#868e96"
                                    >
                                      {item.translation}
                                    </Highlight>
                                  ) : (
                                    <Text py={2} color="#868e96" fz={14}>
                                      {item.translation}
                                    </Text>
                                  )}
                                </List.Item>
                              );
                            })}
                        </List>
                      </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="context">
                      <Accordion.Control
                        bg="#fefaf6"
                        icon={
                          <IconPawFilled className="color3" size={rem(14)} />
                        }
                        fz={14}
                        color="#212529"
                      >
                        <Text color="#212529">Context</Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {text && translate?.meaning && translate?.context && (
                          <Highlight
                            lh={1.6}
                            highlight={[text, translate?.meaning]}
                            sx={(theme) => ({
                              [`& [data-highlight="${text}"]`]: {
                                backgroundColor: theme.colors.navyBlur[0],
                              },
                              [`& [data-highlight="${text.toLowerCase()}"]`]: {
                                backgroundColor: theme.colors.navyBlur[0],
                              },
                              [`& [data-highlight="${capitalizeFirstLetter(text)}"]`]: {
                                backgroundColor: theme.colors.navyBlur[0],
                              },
                              [`& [data-highlight="${translate?.meaning}"]`]: {
                                backgroundColor: theme.colors.orange[0],
                              },
                              [`& [data-highlight="${translate?.meaning?.toLowerCase()}"]`]: {
                                backgroundColor: theme.colors.orange[0],
                              },
                              [`& [data-highlight="${capitalizeFirstLetter(translate?.meaning)}"]`]: {
                                backgroundColor: theme.colors.orange[0],
                              },
                            })}
                            highlightStyles={() => ({
                              fontWeight: 500,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            })}
                            color="#212529"
                          >
                            {translate?.context}
                          </Highlight>
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Flex>
              ) : (
                <Text>Not found</Text>
              )}
            </Grid.Col>
            <Grid.Col span="content">
              <Flex
                w="100%"
                gap="1rem"
                justify="flex-end"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <ActionIcon
                  loading={handleToSpeech.isLoading && !isWord}
                  onClick={() => {
                    setIsWord(false);
                    if (!audioMean) {
                      handleTextToSpeech({
                        text: translate.meaning,
                        isText: false,
                      });
                    } else {
                      playOrPauseAudio(
                        audioMean,
                        isPlayingMean,
                        setIsPlayingMean
                      );
                    }
                  }}
                  className={isPlayingMean ? "actioniconDone" : "actionicon"}
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
                    translate?.meaning &&
                      navigator.clipboard.writeText(translate?.meaning);
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
        </Paper>
      )}
    </>
  );
};

export default TranslateModal;
