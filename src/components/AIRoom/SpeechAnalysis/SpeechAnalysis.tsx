import { Flex, SimpleGrid, Text } from "@mantine/core";
import AnalysisItem from "./AnalysisItem";
import { AnalyzeDataProps } from "../type";
import { Change, diffWords } from "diff";
import { useEffect, useState } from "react";
// import { IconBulbFilled, IconStarFilled } from "@tabler/icons-react";

interface SpeechAnalysisProps {
  yourText: string;
  analyzeData: AnalyzeDataProps;
  setUpgradedAudio: React.Dispatch<React.SetStateAction<string | null>>;
  upgradedAudio: string | null;
  originalAudio: string | undefined;
}

function SpeechAnalysis({
  yourText,
  analyzeData,
  upgradedAudio,
  setUpgradedAudio,
  originalAudio,
}: SpeechAnalysisProps) {
  const [differences, setDifferences] = useState<Change[]>();
  useEffect(() => {
    if (yourText && analyzeData.updated_text) {
      const differences = diffWords(yourText, analyzeData.updated_text, {
        ignoreCase: true,
      });
      setDifferences(differences);
    }
  }, [yourText, analyzeData.updated_text]);
  return (
    <Flex
      px="1rem"
      w="100%"
      gap="md"
      justify="flex-start"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <SimpleGrid w="100%" cols={2} spacing="lg" verticalSpacing="lg">
        <AnalysisItem
          title="Your speech"
          text={yourText}
          element={
            <div>
              {differences?.map((part, index) =>
                part.removed ? (
                  <span key={index} className="highlight removed">
                    {part.value}
                  </span>
                ) : part.added ? null : (
                  part.value
                )
              )}
            </div>
          }
          originalAudio={originalAudio}
        />
        <AnalysisItem
          upgradedAudio={upgradedAudio}
          setUpgradedAudio={setUpgradedAudio}
          title="Upgraded speech"
          text={analyzeData?.updated_text}
          element={
            <div>
              {differences?.map((part, index) =>
                part.added ? (
                  <span key={index} className="highlight added">
                    {part.value}
                  </span>
                ) : part.removed ? null : (
                  part.value
                )
              )}
            </div>
          }
          is_audio
        />
        <div></div>
        <AnalysisItem
          title="Translation"
          text={analyzeData?.translated_updated_text}
        />
      </SimpleGrid>
      <AnalysisItem
        // icon={<IconStarFilled color="#fc6736" size={rem(14)} />}
        title="Comment"
        text={analyzeData?.overall_comment}
        underline
      />
      {(analyzeData?.relevant_to_question == "Yes" ||
        analyzeData?.relevant_to_question == "No") && (
        <Flex
          w="100%"
          gap={4}
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Text td="underline" pr={6} color="#1f4172" fz={14} fw={500}>
            Relevant to the question
          </Text>
          <Text>{analyzeData?.relevant_to_question}</Text>
        </Flex>
      )}
      <AnalysisItem
        // icon={<IconBulbFilled color="#fc6736" size={rem(14)} />}
        title="Suggestions"
        arr={analyzeData?.suggestions}
        underline
      />
    </Flex>
  );
}

export default SpeechAnalysis;
