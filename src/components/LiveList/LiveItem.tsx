import {
  ActionIcon,
  Badge,
  Divider,
  Flex,
  Grid,
  Paper,
  Text,
  Image,
  Button,
  Avatar,
  Modal,
} from "@mantine/core";
import {
  IconLockSquareRounded,
  IconClock,
  IconUserFilled,
  IconMoodPlus,
  IconNotebook,
  IconBrandOpenSource,
} from "@tabler/icons-react";
import { RoomItem } from "./type";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLive } from "../../hooks/useLive";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import PasswordForm from "../ModalItem/PasswordForm";
import { useEffect, useState } from "react";
import TopicContent from "../ModalItem/TopicContent";

const LiveItem: React.FC<RoomItem> = ({
  name,
  is_private,
  topic,
  level,
  description,
  max_member_amount,
  current_member_amount,
  room_members,
  id,
  video_sdk_room_id,
}) => {
  const { onSubmitJoinRoom } = useLive();
  const token = localStorage.getItem("accessToken");

  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      id: id,
      videoSDKToken: token,
      password: "",
    },
  });
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedContent, { open: openContent, close: closeContent }] =
    useDisclosure(false);
  const [passValue, setPassValue] = useState("");
  const [changeIsCall, setchangeIsCall] = useState(false);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    if (isClick) {
      setTimeout(() => {
        setIsClick(false);
      }, 10000);
    }
  }, [isClick]);

  const onSubmit: SubmitHandler<{ id: number }> = async (data) => {
    if (!isClick) {
      setIsClick(true);
      let isCall;
      if (is_private) {
        isCall = false;
        open();
        if (changeIsCall) {
          isCall = true;
        }
      } else {
        isCall = true;
      }
      if (isCall) {
        try {
          const handleSuccess = (message: string) => {
            notificationShow("success", "Success!", message);
          };
          const handleError = (error) => {
            handleGlobalException(error, () => {});
          };

          onSubmitJoinRoom(
            data,
            () => {
              handleSuccess("Room joined successfully!");
              navigate(`/screen/${video_sdk_room_id}/${id}`, {
                state: { isValidJoining: true },
              });
            },
            handleError
          );
        } catch (error) {
          handleGlobalException(error, () => {});
        }
      }
    }
  };
  useEffect(() => {
    if (passValue) {
      setValue("password", passValue);
      setchangeIsCall(true);
    }
  }, [passValue]);
  useEffect(() => {
    if (changeIsCall) {
      handleSubmit(onSubmit)();
    }
  }, [changeIsCall]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper className="liveItemCustom" shadow="lg" radius="lg" p="lg" m="lg">
        <Flex gap="lg" direction="column">
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              {is_private ? (
                <Badge p="10px" className="private">
                  <Flex
                    gap="sm"
                    justify="center"
                    align="center"
                    direction="row"
                  >
                    <IconLockSquareRounded size="1.125rem" />
                    <Text>Private</Text>
                  </Flex>
                </Badge>
              ) : (
                <Badge p="10px">
                  <Flex
                    gap="sm"
                    justify="center"
                    align="center"
                    direction="row"
                  >
                    <IconBrandOpenSource size="1.125rem" />
                    <Text>Public</Text>
                  </Flex>
                </Badge>
              )}
            </Grid.Col>
            <Grid.Col span="content">
              {/* <Badge p="10px" variant="outline">
                <Flex gap="sm" justify="center" align="center" direction="row">
                  <IconClock size="1.125rem" />
                  <Text>21:00 - 22:00</Text>
                </Flex>
              </Badge> */}
            </Grid.Col>
          </Grid>
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              <Flex
                gap="sm"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Image
                  width={21}
                  height={21}
                  mx="auto"
                  radius="100%"
                  src={topic.image}
                  alt="Random image"
                />
                <Text>{topic.name}</Text>
                <Divider size="sm" orientation="vertical" />
                <Text tt="full-width">
                  {level === "BEGINNER"
                    ? "Beginner"
                    : level === "INTERMEDIATE"
                    ? "Intermediate"
                    : "Advanced"}
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span="content">
              {topic.content && (
                <ActionIcon
                  onClick={openContent}
                  color="indigo"
                  radius="xl"
                  variant="light"
                >
                  <IconNotebook size="1.125rem" />
                </ActionIcon>
              )}
            </Grid.Col>
          </Grid>
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              <Text lineClamp={1} maw={490}>
                {name}
              </Text>
            </Grid.Col>
          </Grid>
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              <Flex
                gap="sm"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                {room_members &&
                  room_members
                    .filter((member) => member.is_host)
                    .map((item, index) => {
                      return (
                        <div key={index}>
                          <Avatar
                            radius="xl"
                            src={item.avatar_url}
                            alt="avatar"
                            size={50}
                          />
                        </div>
                      );
                    })}
                {room_members &&
                  room_members
                    .filter((member) => !member.is_host)
                    .map((item, index) => {
                      return (
                        <div key={index}>
                          <Avatar
                            radius="xl"
                            src={item.avatar_url}
                            alt="avatar"
                            size={30}
                          />
                        </div>
                      );
                    })}
              </Flex>
            </Grid.Col>
          </Grid>
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              <Flex
                gap="xs"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <IconUserFilled size="1.125rem" />
                <Text fz={12}>
                  {String(current_member_amount).padStart(2, "0")} /{" "}
                  {String(max_member_amount).padStart(2, "0")}
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span="content">
              <Button
                styles={(theme) => ({
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
                })}
                leftIcon={<IconMoodPlus size="1.125rem" />}
                variant="light"
                type="submit"
              >
                Join now
              </Button>
            </Grid.Col>
          </Grid>
        </Flex>
        <Modal
          title="Enter password"
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
          <PasswordForm setPassValue={setPassValue} />
        </Modal>
        <Modal
          title="Preview Topic Content"
          opened={openedContent}
          onClose={closeContent}
          size={700}
          centered
          m={20}
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
        >
          <TopicContent
            topic={topic.name}
            topic_url={topic.image}
            content={topic.content}
          ></TopicContent>
        </Modal>
      </Paper>
    </form>
  );
};

export default LiveItem;
