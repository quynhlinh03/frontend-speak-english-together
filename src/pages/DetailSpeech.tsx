import {
  Flex,
  Text,
  Breadcrumbs,
  Anchor,
  List,
  SimpleGrid,
  Paper,
  Button,
  Grid,
  Modal,
  ActionIcon,
  Badge,
} from "@mantine/core";
import {
  IconFolder,
  IconPointFilled,
  IconCalendar,
  IconStack,
  IconBrandPagekit,
  IconPinnedFilled,
  IconBulbFilled,
  IconAnalyzeFilled,
  IconPencilMinus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { handleGlobalException } from "../utils/error";
import { useParagraphDetail } from "../hooks/useParagraph";
import { ParagraphDetail } from "../components/Speeches/type";
import { useSpeech } from "../hooks/useSpeech";
import { convertDate } from "../utils/common";
import NameSpeechForm from "../components/ModalItem/NameSpeechForm";
import { useDisclosure } from "@mantine/hooks";
import { Change, diffWords } from "diff";

function DetailSpeech() {
  const params = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [reload, setReload] = useState<boolean>(false);
  const [detailSpeech, setDetailSpeech] = useState<ParagraphDetail>();
  const { fetchParagraphDetail } = useParagraphDetail(params.id);
  const { onSubmitHandleToSpeech } = useSpeech();
  const [updatedAudio, setUpdatedAudio] = useState<string>();
  const [differences, setDifferences] = useState<Change[]>();

  useEffect(() => {
    if (detailSpeech?.original_text && detailSpeech?.updated_text) {
      const differences = diffWords(
        detailSpeech?.original_text,
        detailSpeech?.updated_text,
        {
          ignoreCase: true,
        }
      );
      setDifferences(differences);
    }
  }, [detailSpeech?.original_text, detailSpeech?.updated_text]);

  useEffect(() => {
    async function fetchDetailSpeech() {
      const data = await fetchParagraphDetail.refetch();
      if (data.isSuccess) {
        const result = data.data.data;
        setDetailSpeech(result);
        onSubmitHandleToSpeech(
          { text: result.updated_text },
          (res) => {
            setUpdatedAudio(res.data);
          },
          (error) => {
            handleGlobalException(error, () => {});
          }
        );
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchDetailSpeech();
  }, [params.id, reload]);
  const items = [
    {
      icon: <IconFolder color="#212529" size="1rem" />,
      title: "Saved speeches",
      href: "/ai-room/saved",
    },
    {
      icon: <IconFolder color="#212529" size="1rem" />,
      title: `${detailSpeech?.name}`,
      href: "#",
    },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      <Flex
        gap="xs"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        {item.icon}
        <Text color="#212529" fz={13} fw={400}>
          {" "}
          {item.title}
        </Text>
      </Flex>
    </Anchor>
  ));

  return (
    <Flex
      className="savedSpeeches"
      w="100%"
      gap="xl"
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
      maw="75rem"
      m="auto"
      px="2.25rem"
    >
      <Breadcrumbs separator="→" pt={10}>
        {items}
      </Breadcrumbs>
      <Grid w="100%" py="xs" justify="space-between" align="center">
        <Grid.Col span="content">
          <Flex gap="xs" justify="center" align="center">
            <Text fz={18} fw={500}>
              {detailSpeech?.name}
            </Text>
            <ActionIcon onClick={open}>
              <IconPencilMinus size="1rem" />
            </ActionIcon>
          </Flex>
          <Modal
            title="Edit name"
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
            <NameSpeechForm
              name={detailSpeech?.name}
              id={detailSpeech?.id}
              isEdit
              handleAddSuccess={() => {
                close();
                setReload((prev) => !prev);
              }}
            />
          </Modal>
        </Grid.Col>
        <Grid.Col span="content">
          <Button
            styles={(theme) => ({
              root: {
                pointerEvents: "none",
                border: " 0.0625rem solid #dee2e6",
                borderRadius: "0.7rem",
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
              <IconCalendar color="#fc6736" stroke={1.8} size="1.12rem" />
              <Text color="#fc6736" fz={13} fw={450}>
                {detailSpeech?.created_at &&
                  convertDate(detailSpeech?.created_at)}
              </Text>
            </Flex>
          </Button>
        </Grid.Col>
      </Grid>

      <Paper withBorder radius="lg" m={0} w="100%" p="1.5rem">
        <Flex
          w="100%"
          gap="md"
          justify="center"
          align="flex-start"
          direction="column"
          wrap="wrap"
        >
          <Grid w="100%" justify="space-between" align="center">
            <Grid.Col span="content">
              <Text fz={16} color="#fa5252" fw={550}>
                Subject
              </Text>
            </Grid.Col>
            <Grid.Col span="content">
              {detailSpeech?.topic_name && detailSpeech?.level && (
                <Flex gap="md">
                  <Button
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
                      <IconStack color="#f582a7" stroke={1.8} size="1.12rem" />
                      <Text color="#f582a7" fz={13} fw={450}>
                        {detailSpeech?.level == "EASY"
                          ? "Easy"
                          : detailSpeech?.level == "MEDIUM"
                          ? "Medium"
                          : "Hard"}
                      </Text>
                    </Flex>
                  </Button>
                  <Button
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
                      <IconBrandPagekit
                        color="#1f4172"
                        stroke={1.8}
                        size="1.12rem"
                      />
                      <Text color="#1f4172" fz={13} fw={450}>
                        {detailSpeech?.topic_name}
                      </Text>
                    </Flex>
                  </Button>
                </Flex>
              )}
            </Grid.Col>
          </Grid>
          {detailSpeech?.question ? (
            <Text>{detailSpeech?.question}</Text>
          ) : (
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

          {detailSpeech?.suggestion_answers &&
            detailSpeech?.suggestion_answers.length > 0 && (
              <>
                <Text>You should say</Text>
                <List mt={-5}>
                  <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
                    {detailSpeech?.suggestion_answers?.map((item, index) => {
                      return (
                        <List.Item
                          key={index}
                          icon={<IconPointFilled size="0.9rem" />}
                        >
                          <Text fz={14}>{item}</Text>
                        </List.Item>
                      );
                    })}
                  </SimpleGrid>
                </List>
              </>
            )}
        </Flex>
      </Paper>
      <Paper withBorder radius="lg" m={0} w="100%" p="1.5rem">
        <Flex
          w="100%"
          gap="md"
          justify="center"
          align="flex-start"
          direction="column"
          wrap="wrap"
        >
          <Text fz={16} color="#fa5252" fw={550}>
            Result
          </Text>
          <SimpleGrid w="100%" cols={2} spacing="lg" verticalSpacing="lg">
            <Flex
              gap="xs"
              justify="flex-start"
              align="flex-start"
              direction="column"
            >
              <Text pr={6} color="#1f4172" fw={500}>
                Your speech
              </Text>
              <audio
                style={{ margin: "0 auto" }}
                controls
                src={detailSpeech?.audio_url}
              />
              <Text>
                {" "}
                {differences?.map((part, index) =>
                  part.removed ? (
                    <span key={index} className="highlight removed">
                      {part.value}
                    </span>
                  ) : part.added ? null : (
                    part.value
                  )
                )}
              </Text>
            </Flex>
            <Flex
              gap="xs"
              justify="flex-start"
              align="flex-start"
              direction="column"
            >
              <Text pr={6} color="#1f4172" fz={14} fw={500}>
                Upgraded speech
              </Text>
              <audio style={{ margin: "0 auto" }} controls src={updatedAudio} />
              <Text>
                {" "}
                {differences?.map((part, index) =>
                  part.added ? (
                    <span key={index} className="highlight added">
                      {part.value}
                    </span>
                  ) : part.removed ? null : (
                    part.value
                  )
                )}
              </Text>
            </Flex>
            <div></div>
            <Flex
              gap="xs"
              justify="flex-start"
              align="flex-start"
              direction="column"
            >
              <Text pr={6} color="#1f4172" fz={14} fw={500}>
                Translation
              </Text>
              <Text>{detailSpeech?.translated_updated_text}</Text>
            </Flex>
          </SimpleGrid>
          <Flex
            gap="xs"
            justify="flex-start"
            align="flex-start"
            direction="column"
          >
            <Flex gap="xs" justify="flex-start" align="center" direction="row">
              <IconPinnedFilled color="#fc6736" size="1rem" />
              <Text pr={6} color="#1f4172" fz={14} fw={500}>
                Comment
              </Text>
            </Flex>
            <Text>{detailSpeech?.overall_comment}</Text>
          </Flex>

          {(detailSpeech?.relevance_to_question == "Yes" ||
            detailSpeech?.relevance_to_question == "No") && (
            <Flex
              w="100%"
              gap={4}
              justify="flex-start"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Flex
                gap="xs"
                justify="flex-start"
                align="center"
                direction="row"
              >
                <IconAnalyzeFilled color="#fc6736" size="1rem" />
                <Text pr={6} color="#1f4172" fw={500}>
                  Relevant to the question
                </Text>
              </Flex>
              <Text>{detailSpeech?.relevance_to_question}</Text>
            </Flex>
          )}
          <Flex
            gap="xs"
            justify="flex-start"
            align="flex-start"
            direction="column"
          >
            <Flex gap="xs" justify="flex-start" align="center" direction="row">
              <IconBulbFilled color="#fc6736" size="1rem" />
              <Text pr={6} color="#1f4172" fz={14} fw={500}>
                Suggestions
              </Text>
            </Flex>
            <List mt={-5}>
              {detailSpeech?.suggestion_improvements.map((item, index) => {
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
          </Flex>
        </Flex>
      </Paper>
    </Flex>
  );
}

export default DetailSpeech;
