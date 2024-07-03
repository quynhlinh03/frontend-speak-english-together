import { Image, Flex, Grid, Pagination, Text } from "@mantine/core";
import { AllVocabularyProps } from "./type";
import sleep from "../../assets/images/error.png";
import VocabularyItem from "./VocabularyItem";

const VocabularyList: React.FC<{
  allVocabulary: AllVocabularyProps;
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  totalPages: number;
  perPage: number;
  handleSuccess: () => void;
}> = ({
  allVocabulary,
  handlePageChange,
  currentPage,
  totalPages,
  perPage,
  handleSuccess,
}) => {
  return (
    <Flex
      py="3.5rem"
      w="100%"
      gap="2rem"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      {allVocabulary?.total == 0 && (
        <Flex
          p="2.5rem 0"
          gap="xl"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Image maw={80} src={sleep} alt="not found" />
          <Text>No items.</Text>
        </Flex>
      )}
      {allVocabulary?.data.map((item, index) => {
        return (
          <div style={{ width: "100%" }} key={index}>
            <VocabularyItem
              id={item.id}
              word={item.word}
              word_audio_url={item.word_audio_url}
              meaning={item.meaning}
              meaning_audio_url={item.meaning_audio_url}
              examples={item.examples}
              handleSuccess={handleSuccess}
              context={item.context}
              currentPage={currentPage}
            />
          </div>
        );
      })}
      <Grid w="100%" justify="space-between" align="center">
        <Grid.Col
          style={{ display: allVocabulary?.total == 0 ? "none" : "" }}
          span="auto"
          fz={14}
          fw={400}
        >
          {allVocabulary?.total &&
            (allVocabulary?.total == 1 ? (
              <Text fz={14} fw={400} color="#212529">
                Found 1 item.
              </Text>
            ) : (
              <Text fz={14} fw={400} color="#212529">
                {currentPage < totalPages
                  ? perPage
                  : allVocabulary?.total - perPage * (currentPage - 1)}{" "}
                items from {(currentPage - 1) * perPage + 1} -{" "}
                {currentPage < totalPages
                  ? currentPage * perPage
                  : allVocabulary?.total}{" "}
                out of {allVocabulary?.total} items
              </Text>
            ))}
        </Grid.Col>

        <Grid.Col span="content">
          {" "}
          <Pagination
            value={currentPage}
            total={totalPages}
            onChange={handlePageChange}
            position="center"
            styles={(theme) => ({
              control: {
                "&[data-active]": {
                  backgroundColor: theme.colors.navyBlur[0],
                  border: 0,
                },
                " &[data-active]:not([data-disabled]):hover": {
                  backgroundColor: theme.fn.darken(
                    theme.colors.navyBlur[0],
                    0.1
                  ),
                  border: 0,
                },
              },
            })}
          />
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default VocabularyList;
