import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Grid,
  Input,
  List,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { IconPointFilled, IconX } from "@tabler/icons-react";
import SelectCustom from "../UI/SelectCustom/SelectCustom";
import { convertDataGetName } from "../Vocabulary/VocabularyForm";
import { useEffect, useState } from "react";
import { handleGlobalException } from "../../utils/error";
import { useLive } from "../../hooks/useLive";
import { levelSpeakData } from "../LoginForm/type";
import { StyledTabs } from "../UI/StyledTabs/StyledTabs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSpeakAI } from "../../hooks/useSpeakAI";
import { AnalyzeDataProps, QuestionRandomProps } from "./type";
import { deleteModal } from "../../utils/deleteModal";

interface SubjectSpeakingProps {
  setQuestion: React.Dispatch<React.SetStateAction<string | undefined | null>>;
  question: string | null;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  analyzeData: AnalyzeDataProps | null | undefined;
  setAnalyzeData: React.Dispatch<
    React.SetStateAction<AnalyzeDataProps | null | undefined>
  >;
  setSubject: any;
  setIsShowAnalyze: React.Dispatch<React.SetStateAction<boolean>>;
}

function SubjectSpeaking({
  setQuestion,
  question,
  setActive,
  analyzeData,
  setAnalyzeData,
  setSubject,
  setIsShowAnalyze,
}: SubjectSpeakingProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      topic: "",
      level: "",
    },
  });
  const { handleGenerateQuestion, onSubmitHandleGenerateQuestion } =
    useSpeakAI();
  const [listTopic, setListTopic] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [enteredTopic, setEnteredTopic] = useState<string | null>(null);
  const [enteredSubject, setEnteredSubject] = useState<string | null>(null);
  const { fetchListTopic } = useLive();
  const [questionRandom, setQuestionRandom] =
    useState<QuestionRandomProps | null>();
  useEffect(() => {
    async function fetchTopicData() {
      const data = await fetchListTopic.refetch();
      if (data.isSuccess) {
        setListTopic(data.data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchTopicData();
  }, []);
  const onSubmit: SubmitHandler<{ topic: string; level: string }> = async (
    data
  ) => {
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };
    if (analyzeData) {
      deleteModal(
        "Confirm change subject",
        "If you change the subject, all recording and analyzed data will be lost. Do you want to do this?",
        "Confirm",
        () => {
          setIsShowAnalyze(false);
          setAnalyzeData(null);
          onSubmitHandleGenerateQuestion(
            data,
            (responseData) => {
              setQuestionRandom(responseData.data);
              setQuestion(responseData.data.question);
              setSubject({
                question: responseData.data.question,
                suggestions: responseData.data.suggestions,
                level: data.level,
                topic_name: data.topic,
              });
              setActive(1);
            },
            handleError
          );
        }
      );
    } else {
      onSubmitHandleGenerateQuestion(
        data,
        (responseData) => {
          setQuestionRandom(responseData.data);
          setQuestion(responseData.data.question);
          setSubject({
            question: responseData.data.question,
            suggestions: responseData.data.suggestions,
            level: data.level,
            topic_name: data.topic,
          });
          setActive(1);
        },
        handleError
      );
    }
  };
  return (
    <>
      <StyledTabs
        style={{
          width: "80%",
          margin: "-0.5rem auto auto",
          border: "0.0625rem dashed #ced4da",
          borderRadius: "1rem",
          padding: "2rem 5rem",
        }}
        defaultValue="random"
      >
        <Tabs.List
          style={{
            justifyContent: "center",
            alignItems: "center",
            color: "#868e96",
          }}
          className="tabCustom tabSubject"
        >
          <Tabs.Tab value="random">Random</Tabs.Tab>
          <Tabs.Tab value="enter">Enter</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel pt="1rem" value="random">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
              w="100%"
              gap="md"
              justify="flex-start"
              align="center"
              direction="column"
              wrap="wrap"
              className=" subject"
            >
              <Controller
                name="topic"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input.Wrapper
                    error={
                      errors.topic
                        ? errors.topic.type === "required"
                          ? "Please choose a topic"
                          : errors.topic.message
                        : false
                    }
                    required
                    w="100%"
                    className="avatar"
                    label="Topic"
                  >
                    <SelectCustom
                      props={{
                        data: convertDataGetName(listTopic),
                        value: selectedTopic || "",
                        placeholder: "Select a topic",
                        onChange: (selectedValue: string) => {
                          setSelectedTopic(selectedValue);
                          setEnteredTopic(null);
                          field.onChange(selectedValue);
                        },
                      }}
                    />
                    <Divider my="md" label="or" labelPosition="center" />
                    <TextInput
                      pb={6}
                      className="customTextInput"
                      placeholder="Enter new topic"
                      withAsterisk
                      radius="md"
                      onChange={(event) => {
                        setEnteredTopic(event.currentTarget.value);
                        setSelectedTopic(null);
                        field.onChange(event.currentTarget.value);
                      }}
                      value={enteredTopic || ""}
                    />
                  </Input.Wrapper>
                )}
              ></Controller>

              <Controller
                name="level"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <SelectCustom
                    props={{
                      style: {
                        radius: "lg",
                        width: "100%",
                      },
                      data: levelSpeakData,
                      label: "Level",
                      placeholder: "Select a level",
                      onChange: (selectedValue: string) => {
                        field.onChange(selectedValue);
                      },
                      error: errors.level
                        ? errors.level.type === "required"
                          ? "Please choose a level"
                          : errors.level.message
                        : false,
                    }}
                  />
                )}
              ></Controller>

              <Flex w="100%" justify="flex-end" align="center">
                <Button
                  loading={handleGenerateQuestion.isLoading}
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
                  type="submit"
                >
                  Random
                </Button>
              </Flex>
            </Flex>
          </form>
        </Tabs.Panel>
        <Tabs.Panel pt="1rem" value="enter">
          <Flex
            w="100%"
            gap="md"
            justify="flex-start"
            align="center"
            direction="column"
            wrap="wrap"
            className=" subject"
          >
            <Textarea
              w="100%"
              placeholder="Enter subject"
              className="customTextInput profile iconArea"
              label="Subject"
              radius="md"
              minRows={5}
              autosize
              withAsterisk
              value={enteredSubject || ""}
              onChange={(event) => {
                setEnteredSubject(event.currentTarget.value);
                setSubject({ question: event.currentTarget.value });
              }}
            />
            <Flex w="100%" justify="flex-end" align="center">
              <Button
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
                onClick={() => {
                  if (analyzeData) {
                    deleteModal(
                      "Confirm change subject",
                      "If you change the subject, all recording and analyzed data will be lost. Do you want to do this?",
                      "Confirm",
                      () => {
                        setIsShowAnalyze(false);
                        setAnalyzeData(null);
                        setQuestion(enteredSubject);
                        setActive(1);
                      }
                    );
                  } else {
                    setQuestion(enteredSubject);
                    setActive(1);
                  }
                }}
              >
                Enter
              </Button>
            </Flex>
          </Flex>
        </Tabs.Panel>
      </StyledTabs>
      {question && (
        <Grid
          m="auto"
          w="65%"
          p={0}
          pt="1rem"
          justify="center"
          align="flex-start"
        >
          <Grid.Col span="content">
            <Text pr="1rem" fz={14} fw={500}>
              Subject:
            </Text>
          </Grid.Col>
          <Grid.Col span="auto">
            {question === questionRandom?.question && (
              <>
                <Text pb="0.8rem" color="#212529" fz={14}>
                  {questionRandom?.question}
                </Text>
                <Text pb="0.8rem" color="#212529" fz={14}>
                  You should say
                </Text>
                <List mt={-5}>
                  {questionRandom &&
                    questionRandom?.suggestions?.map((item, index) => {
                      return (
                        <List.Item
                          py={5}
                          key={index}
                          icon={
                            <IconPointFilled className="color4" size="0.9rem" />
                          }
                        >
                          <Text py={2} color="#212529" fz={14}>
                            {item}
                          </Text>
                        </List.Item>
                      );
                    })}
                </List>
              </>
            )}
            {question === enteredSubject && (
              <Text pb="0.8rem" color="#212529" fz={14}>
                {enteredSubject}
              </Text>
            )}
          </Grid.Col>
          <Grid.Col pl="1rem" span="content">
            <Tooltip fz={12} label="Delete">
              <ActionIcon
                className="resetSubject"
                bg="#1f4172"
                size="2rem"
                radius="2rem"
                variant="filled"
                onClick={() => {
                  if (analyzeData) {
                    deleteModal(
                      "Confirm change subject",
                      "If you change the subject, all recording and analyzed data will be lost. Do you want to do this?",
                      "Confirm",
                      () => {
                        setAnalyzeData(null);
                        setQuestion(null);
                      }
                    );
                  } else {
                    setQuestion(null);
                  }
                }}
              >
                <IconX color="#fff" size="1rem" />
              </ActionIcon>
            </Tooltip>
          </Grid.Col>
        </Grid>
      )}
    </>
  );
}

export default SubjectSpeaking;
