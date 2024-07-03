import { Image, Flex, Grid, Pagination, Text, Center } from "@mantine/core";
import sleep from "../../assets/images/error.png";
import SpeechesItem from "./SpeechesItem";
import { AllParagraphProps } from "./type";
import { convertDate } from "../../utils/common";

const SpeechesList: React.FC<{
  allSpeeches: AllParagraphProps;
  handlePageChange: (newPage: number) => void;
  currentPage: number;
  totalPages: number;
  perPage: number;
  handleSuccess: () => void;
}> = ({
  allSpeeches,
  handlePageChange,
  currentPage,
  totalPages,
  perPage,
  handleSuccess,
}) => {
  return (
    <Flex
      py="2rem"
      w="100%"
      gap="1rem"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <Grid w="100%" justify="space-between" align="center">
        <Grid.Col span={1}>
          <Text tt="uppercase" fw={600} fz={14} color="#7f8187" mx="auto">
            No.
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text tt="uppercase" fw={600} fz={14} color="#7f8187" mx="auto">
            Name
          </Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Text tt="uppercase" fw={600} fz={14} color="#7f8187">
            Question
          </Text>
        </Grid.Col>{" "}
        <Grid.Col span={3}>
          <Text tt="uppercase" fw={600} fz={14} color="#7f8187">
            Your speech
          </Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Text tt="uppercase" fw={600} fz={14} color="#7f8187" mx="auto">
            Audio
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Text tt="uppercase" fw={600} fz={14} color="#7f8187">
            Date
          </Text>
        </Grid.Col>
      </Grid>
      {allSpeeches?.total == 0 && (
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
      {allSpeeches?.data?.map((item, index) => {
        return (
          <div style={{ width: "100%" }} key={index}>
            <SpeechesItem
              name={item.name}
              index={index + 1 + (currentPage - 1) * perPage}
              id={item.id}
              question={item.question}
              topic={item.topic_name}
              level={item.level}
              your_speech={item.original_text}
              audio_url={item.audio_url}
              handleSuccess={handleSuccess}
              date={convertDate(item.created_at)}
              currentPage={currentPage}
            />
          </div>
        );
      })}
      <Grid pt="2rem" w="100%" justify="space-between" align="center">
        <Grid.Col
          style={{ display: allSpeeches?.total == 0 ? "none" : "" }}
          span="auto"
          fz={14}
          fw={400}
        >
          {allSpeeches?.total &&
            (allSpeeches?.total == 1 ? (
              <Text fz={14} fw={400} color="#212529">
                Found 1 item.
              </Text>
            ) : (
              <Text fz={14} fw={400} color="#212529">
                {currentPage < totalPages
                  ? perPage
                  : allSpeeches?.total - perPage * (currentPage - 1)}{" "}
                items from {(currentPage - 1) * perPage + 1} -{" "}
                {currentPage < totalPages
                  ? currentPage * perPage
                  : allSpeeches?.total}{" "}
                out of {allSpeeches?.total} items
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

export default SpeechesList;
