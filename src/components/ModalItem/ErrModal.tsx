import { Button, Flex, Text } from "@mantine/core";

const ErrModal: React.FC<{
  closeModal: () => void;
  content: string;
}> = ({ content, closeModal }) => {
  return (
    <Flex direction="column" gap="xl">
      <Text>{content}</Text>
      <Button
        className="customButton"
        onClick={closeModal}
        styles={(theme) => ({
          root: {
            backgroundColor: theme.colors.pinkPastel[0],
            ...theme.fn.hover({
              backgroundColor: theme.fn.darken(theme.colors.pinkPastel[0], 0.1),
            }),
          },
        })}
      >
        {" "}
        OK
      </Button>
    </Flex>
  );
};

export default ErrModal;
