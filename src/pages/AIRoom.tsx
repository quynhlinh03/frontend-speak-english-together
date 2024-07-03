import {
  ActionIcon,
  Button,
  Flex,
  Modal,
  SimpleGrid,
  Stepper,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCheck,
  IconPointFilled,
  IconFolderPlus,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import AccordionStep from "../components/UI/AccordionStep/AccordionStep";
import SubjectSpeaking from "../components/AIRoom/SubjectSpeaking";
import VoiceRecord from "../components/AIRoom/VoiceRecord";
import SpeechAnalysis from "../components/AIRoom/SpeechAnalysis/SpeechAnalysis";
import { useSpeakAI } from "../hooks/useSpeakAI";
import { handleGlobalException } from "../utils/error";
import { AnalyzeDataProps } from "../components/AIRoom/type";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import NameSpeechForm from "../components/ModalItem/NameSpeechForm";

function AIRoom() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  const [active, setActive] = useState(0);
  const [yourText, setYourText] = useState<string | null>();
  const [subject, setSubject] = useState<{
    question?: string;
    suggestions?: [string];
    level?: string;
    topic_name?: string;
  } | null>();
  const [isAnalyze, setIsAnalyze] = useState<boolean>(false);
  const [question, setQuestion] = useState<string | null>();
  const [upgradedAudio, setUpgradedAudio] = useState<string>();
  const [originalAudio, setOriginalAudio] = useState<string>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isShowAnalyze, setIsShowAnalyze] = useState(false);
  const [analyzeData, setAnalyzeData] = useState<AnalyzeDataProps | null>();
  const { handleAnalyzeText, onSubmitHandleAnalyzeText } = useSpeakAI();

  useEffect(() => {
    if (isAnalyze && yourText) {
      setAnalyzeData(null);
      onSubmitAnalyzeSpeech({ text: yourText, question: question || "" });
    }
  }, [isAnalyze]);

  function onSubmitAnalyzeSpeech(data: { text: string; question: string }) {
    const handleError = (error) => {
      handleGlobalException(error, () => {});
      setIsAnalyze(false);
    };
    onSubmitHandleAnalyzeText(
      data,
      (responseData) => {
        setAnalyzeData(responseData.data);
        setIsSaved(false);
        setActive(4);
        setIsAnalyze(false);
      },
      handleError
    );
  }

  return (
    <Flex
      w="100%"
      gap="xl"
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
      maw="75rem"
      m="auto"
    >
      <Text className="textDark" px="2.25rem" fw={500} fz={16} pt={10}>
        SpeakAI
      </Text>
      <Flex
        w="100%"
        justify="flex-end"
        align="flex-end"
        direction="column"
        wrap="wrap"
      >
        <Button
          styles={(theme) => ({
            root: {
              border: " 0.0625rem solid #dee2e6",
              borderRadius: "0.7rem",
              backgroundColor: "rgba(255, 239, 224, 0.1)",
              ...theme.fn.hover({
                backgroundColor: "rgba(255, 239, 224, 0.1)",
              }),
            },
          })}
          variant="default"
          onClick={() => {
            navigate(`/ai-room/saved`);
          }}
        >
          <Flex
            justify="flex-center"
            align="flex-center"
            direction="row"
            wrap="wrap"
            gap="xs"
          >
            <IconDeviceFloppy color="#fc6736" stroke={1.8} size="1.12rem" />
            <Text color="#fc6736" fz={13} fw={450}>
              Saved
            </Text>
          </Flex>
        </Button>
      </Flex>
      <Flex
        pt={20}
        px="4rem"
        gap="xl"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
        m="auto"
      >
        <Stepper
          className="stepperCustom"
          size="xs"
          w="54rem"
          active={active}
          onStepClick={setActive}
          breakpoint="xl"
          completedIcon={<IconCheck stroke={2.5} size="1.4rem" />}
        >
          <Stepper.Step
            icon={<IconPointFilled stroke={5} size="4rem" />}
          ></Stepper.Step>
          <Stepper.Step
            icon={<IconPointFilled stroke={5} size="4rem" />}
          ></Stepper.Step>
          <Stepper.Step
            icon={<IconPointFilled stroke={5} size="4rem" />}
          ></Stepper.Step>
          <Stepper.Step
            icon={<IconPointFilled stroke={5} size="4rem" />}
          ></Stepper.Step>
          <Stepper.Completed>Hi</Stepper.Completed>
        </Stepper>
        <SimpleGrid cols={4} spacing={96} verticalSpacing={5}>
          <Text w="184px" fz={12} fw={400} color="#868e96">
            STEP 1
          </Text>
          <Text w="184px" fz={12} fw={400} color="#868e96">
            STEP 2
          </Text>
          <Text w="184px" fz={12} fw={400} color="#868e96">
            STEP 3
          </Text>
          <Text w="184px" fz={12} fw={400} color="#868e96">
            STEP 4
          </Text>
          <Text w="184px" fz={14} fw={400} color="#212529">
            Random or enter a subject
          </Text>
          <Text w="184px" fz={14} fw={400} color="#212529">
            Think about what you'll say
          </Text>
          <Text w="184px" fz={14} fw={400} color="#212529">
            Record your speech
          </Text>
          <Text w="184px" fz={14} fw={400} color="#212529">
            Get immediate feedback
          </Text>
        </SimpleGrid>
      </Flex>
      <Flex
        p="4rem"
        gap="xl"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        m="auto"
        w="90%"
      >
        <AccordionStep
          title="Random or enter a subject (optional)"
          component={
            <SubjectSpeaking
              setActive={setActive}
              setQuestion={setQuestion}
              question={question}
              analyzeData={analyzeData}
              setAnalyzeData={setAnalyzeData}
              setSubject={setSubject}
              setIsShowAnalyze={setIsShowAnalyze}
            />
          }
        />
        <AccordionStep
          title="Record your speech"
          component={
            <VoiceRecord
              setIsAnalyze={setIsAnalyze}
              setYourText={setYourText}
              yourText={yourText}
              setActive={setActive}
              handleAnalyzeText={handleAnalyzeText}
              setOriginalAudio={setOriginalAudio}
              analyzeData={analyzeData}
              setAnalyzeData={setAnalyzeData}
              isShowAnalyze={isShowAnalyze}
              setIsShowAnalyze={setIsShowAnalyze}
            />
          }
        />
        {analyzeData && (
          <>
            <AccordionStep
              title="Analyze the speech"
              component={
                <SpeechAnalysis
                  isAnalyze={isAnalyze}
                  yourText={yourText}
                  analyzeData={analyzeData}
                  upgradedAudio={upgradedAudio}
                  setUpgradedAudio={setUpgradedAudio}
                  originalAudio={originalAudio}
                />
              }
            />
            {!isSaved && (
              <Tooltip fz={12} label="Save speech">
                <ActionIcon
                  style={{
                    backgroundColor: "#fff",
                    position: "fixed",
                    top: "45%",
                    left: "77%",
                    boxShadow:
                      "0 4px 10px rgb(0 0 0 / 12%), 0 0 1px rgb(0 0 0 / 5%) inset",
                    ...theme.fn.hover({
                      backgroundColor: theme.fn.darken("#fff", 0.1),
                    }),
                  }}
                  size="56px"
                  radius="xl"
                  variant="filled"
                  onClick={open}
                >
                  <IconFolderPlus color="#1F4172" size="1.3rem" />
                </ActionIcon>
              </Tooltip>
            )}
            <Modal
              title="Enter name"
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
                original_text={yourText}
                question={subject?.question}
                suggestion_answers={subject?.suggestions}
                audio_url={originalAudio}
                updated_text={analyzeData.updated_text}
                translated_updated_text={analyzeData.translated_updated_text}
                overall_comment={analyzeData.overall_comment}
                relevance_to_question={analyzeData.relevant_to_question}
                suggestion_improvements={analyzeData.suggestions}
                level={subject?.level}
                topic_name={subject?.topic_name}
                handleAddSuccess={() => {
                  close();
                  setIsSaved(true);
                }}
              />
            </Modal>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default AIRoom;
