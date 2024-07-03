import { Button, Center, Flex, Modal, Text } from "@mantine/core";
import logout from "../../assets/images/logout.png";

interface ConfirmLogoutModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  onConfirm,
  onClose,
}) => {
  return (
    <Modal centered opened={true} onClose={onClose} radius="md">
      <Flex
        gap="xl"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <img width="150px" src={logout}></img>
        <div style={{ fontWeight: "bold" }}>Log out</div>
        <Text size="sm" px={20} align="center">
          "Are you sure you want to log out?"
        </Text>
        <Center>
          <Flex gap="md" pb={20}>
            <Button
              w={110}
              radius={50}
              variant="outline"
              onClick={onConfirm}
              styles={(theme) => ({
                root: {
                  border: theme.colors.pinkPastel[0],
                  color: theme.colors.pinkPastel[0],
                  ...theme.fn.hover({
                    color: theme.fn.darken(theme.colors.pinkPastel[0], 0.1),
                  }),
                },
              })}
            >
              Log out
            </Button>
            <Button
              w={110}
              radius={50}
              onClick={onClose}
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
            >
              Cancel
            </Button>
          </Flex>
        </Center>
      </Flex>
    </Modal>
  );
};

export default ConfirmLogoutModal;
