import { Flex, Text } from "@mantine/core";
import TranslateTool from "../components/Translate/TranslateTool";

function Translate() {
  return (
    <Flex
      w="100%"
      gap={0}
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
      maw="75rem"
      m="auto"
    >
      <Text className="textDark" pl="2.25rem" fw={500} fz={16} pt={10}>
        SPET Translate
      </Text>
      <TranslateTool />
    </Flex>
  );
}

export default Translate;
