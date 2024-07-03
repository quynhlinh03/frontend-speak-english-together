import {
  Grid,
  Paper,
  Flex,
  Text,
  Button,
  Modal,
  Avatar,
} from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export interface BuddiesItemProps {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string;
  level: string;
  nationality: string;
  description: string;
  is_following?: boolean;
  handleFollow: (id: number) => void;
  handleUnfollow: (id: number, close: () => {}) => void;
}

export interface UnfollowModalProps {
  id: number;
  full_name: string;
  avatar_url: string | null;
  handleUnfollow: () => void;
  closeModal: () => void;
}

export const UnfollowModal: React.FC<UnfollowModalProps> = ({
  id,
  avatar_url,
  full_name,
  handleUnfollow,
  closeModal,
}) => {
  return (
    <Flex
      gap="lg"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <Avatar radius={100} w={65} h={65} src={avatar_url} alt="user ava" />
      <Flex
        p={5}
        gap={2}
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Text>Unfollow</Text>
        <Text fw={500}>{full_name}</Text>
        <Text>?</Text>
      </Flex>
      <Button
        color="#F582A7"
        styles={(theme) => ({
          root: {
            fontWeight: 400,
            color: theme.colors.pinkDark[0],
            ...theme.fn.hover({
              color: theme.fn.darken(theme.colors.pinkDark[0], 0.1),
              backgroundColor: theme.white,
            }),
          },
        })}
        fullWidth
        variant="subtle"
        onClick={(event) => {
          event.stopPropagation();
          handleUnfollow();
        }}
      >
        Unfollow
      </Button>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          closeModal();
        }}
        styles={(theme) => ({
          root: {
            fontWeight: 400,
            color: theme.black,
            ...theme.fn.hover({
              color: theme.fn.darken(theme.black, 0.1),
              backgroundColor: theme.white,
            }),
          },
        })}
        fullWidth
        variant="subtle"
      >
        Cancel
      </Button>
    </Flex>
  );
};

const BuddyItem: React.FC<BuddiesItemProps> = ({
  id,
  email,
  full_name,
  avatar_url,
  level,
  nationality,
  description,
  is_following,
  handleFollow,
  handleUnfollow,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  return (
    <Paper
      style={{ cursor: "pointer" }}
      className="liveItemCustom"
      shadow="lg"
      radius="lg"
      p="md"
      m="md"
      onClick={() => {
        navigate(`/personal/${id}/profile`);
      }}
    >
      <Grid justify="space-between" align="center">
        <Grid.Col span="content">
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              <Avatar
                radius={20}
                w={65}
                h={65}
                src={avatar_url}
                alt="user ava"
              />
            </Grid.Col>
            <Grid.Col span="content">
              <Flex
                gap={6}
                justify="start"
                align="start"
                direction="column"
                wrap="wrap"
              >
                <Text fw={500} fz={14}>
                  {full_name}
                </Text>
                <Flex
                  gap="md"
                  justify="center"
                  align="center"
                  direction="row"
                  wrap="wrap"
                >
                  <Flex
                    gap={0}
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                  >
                    {/* <Image
                      radius="100%"
                      width={14}
                      height={14}
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_North_Vietnam_%281955%E2%80%931976%29.svg/230px-Flag_of_North_Vietnam_%281955%E2%80%931976%29.svg.png"
                      alt="vietnam"
                    /> */}
                    <IconPointFilled color="#5A72A0" size="1.5rem" />
                    <Text transform="capitalize" fw={400} fz={13}>
                      {nationality}
                    </Text>
                  </Flex>
                  <Flex
                    gap={0}
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                  >
                    <IconPointFilled
                      color={
                        level === "BEGINNER"
                          ? "#F1B4BB"
                          : level === "INTERMEDIATE"
                          ? "#9CAFAA"
                          : "#EFBC9B"
                      }
                      size="1.5rem"
                    />
                    <Text fw={400} fz={13}>
                      {level === "BEGINNER"
                        ? "Beginner"
                        : level === "INTERMEDIATE"
                        ? "Intermediate"
                        : "Advanced"}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span="content">
          {!(id == userProfile?.id) && (
            <Button
              fz={13}
              fw={500}
              p="0 1rem"
              onClick={
                is_following
                  ? (event) => {
                      event.stopPropagation();
                      open();
                    }
                  : (event) => {
                      event.stopPropagation();
                      handleFollow({ id: id });
                    }
              }
              styles={(theme) =>
                is_following
                  ? {
                      root: {
                        backgroundColor: theme.colors.pinkDarkLight[0],
                        color: theme.colors.pinkDark[0],
                        ...theme.fn.hover({
                          backgroundColor: theme.fn.darken(
                            theme.colors.pinkDarkLight[0],
                            0.1
                          ),
                        }),
                      },
                    }
                  : {
                      root: {
                        backgroundColor: theme.colors.navyBlurLight[0],
                        color: theme.colors.navyBlur[0],
                        ...theme.fn.hover({
                          backgroundColor: theme.fn.darken(
                            theme.colors.navyBlurLight[0],
                            0.1
                          ),
                        }),
                      },
                    }
              }
              variant="light"
              radius={20}
            >
              {is_following ? "Following" : "Follow"}
            </Button>
          )}
        </Grid.Col>
        <Modal
          opened={opened}
          onClose={(event) => {
            close();
            event.stopPropagation();
          }}
          size={450}
          centered
          radius={20}
          m={20}
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
        >
          <UnfollowModal
            id={id}
            avatar_url={avatar_url}
            full_name={full_name}
            handleUnfollow={() => {
              handleUnfollow({ id: id, close });
            }}
            closeModal={() => {
              close();
            }}
          />
        </Modal>
      </Grid>
    </Paper>
  );
};

export default BuddyItem;
