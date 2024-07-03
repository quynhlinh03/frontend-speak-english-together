import React, { useEffect, useState, useRef } from "react";
import { IconSend, IconInfoCircle } from "@tabler/icons-react";
import {
  Avatar,
  Button,
  Flex,
  Grid,
  Group,
  Paper,
  Textarea,
  UnstyledButton,
  Text,
  Indicator,
  ScrollArea,
  Box,
} from "@mantine/core";
import { CometChat, TextMessage } from "@cometchat/chat-sdk-javascript";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { convertTimestamp, formatTimestamp } from "../../utils/common";

const ChatBox: React.FC<{
  conversationWith: string;
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
  UIDme: string;
  isConversationWith: boolean;
  unread: number;
}> = ({
  conversationWith,
  isReload,
  setIsReload,
  UIDme,
  isConversationWith,
  unread,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      uid: conversationWith,
      messageText: "",
    },
  });

  const inputBoxRef = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [detailUser, setDetailUser] = useState<any>();
  const [conversationDetail, setConversationDetail] = useState<any>();

  const [messageText, setMessageText] = useState("");
  const messageTextIsEmpty = messageText.trim().length === 0;
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () =>
      viewport?.current?.scrollTo({
        top: viewport?.current?.scrollHeight,
        behavior: "smooth",
      });
    scrollToBottom();
  }, [conversationDetail, isReload]);

  const onSubmit: SubmitHandler<{
    uid: string;
    messageText: string;
  }> = (data) => {
    if (conversationWith) {
      let receiverID: string = data.uid,
        messageText: string = data.messageText,
        receiverType: string = CometChat.RECEIVER_TYPE.USER,
        textMessage: CometChat.TextMessage = new CometChat.TextMessage(
          receiverID,
          messageText,
          receiverType
        );

      CometChat.sendMessage(textMessage).then(
        (message: CometChat.TextMessage) => {
          setIsReload((prev) => !prev);
        },
        (error: CometChat.CometChatException) => {
          console.log("Message sending failed with error:", error);
        }
      );

      setMessageText(""); // Clear the message text after sending
      setValue("messageText", ""); // Clear the form input value
      if (inputBoxRef.current) {
        inputBoxRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.charCode === 13 && !messageTextIsEmpty) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    if (conversationWith) {
      CometChat.getUser(conversationWith).then(
        (user) => {
          // console.log("User details fetched for user:", user);
          setDetailUser(user);
        },
        (error) => {
          console.log("User details fetching failed with error:", error);
        }
      );
      const fetchConversationDetail = async () => {
        let UID: string = conversationWith,
          messageId: number = 1,
          limit: number = 30,
          messagesRequest: CometChat.MessagesRequest =
            new CometChat.MessagesRequestBuilder()
              .setUID(UID)
              .setMessageId(messageId)
              .setLimit(limit)
              .build();
        try {
          const conversationDetail = await messagesRequest.fetchNext();
          setConversationDetail(conversationDetail);
        } catch (error) {
          console.log(
            "Conversations detail fetching failed with error:",
            error
          );
        }
      };
      fetchConversationDetail();
    }
    setValue("uid", conversationWith);
  }, [conversationWith, isReload]);

  useEffect(() => {
    if (
      unread &&
      isConversationWith &&
      conversationWith &&
      UIDme &&
      conversationDetail
    ) {
      let messageId;
      for (let i = conversationDetail.length - 1; i >= 0; i--) {
        if (conversationDetail[i].receiverId == conversationWith) {
          messageId = conversationDetail[i].id;
          break;
        }
      }
      if (messageId) {
        var receiverId: string = conversationWith;
        var receiverType: string = "user";
        var senderId: string = UIDme;
        CometChat.markAsRead(
          messageId,
          receiverId,
          receiverType,
          senderId
        ).then(
          () => {
            // console.log("mark as read success.");
            setIsReload((prev) => !prev);
          },
          (error: CometChat.CometChatException) => {
            console.log(
              "An error occurred when marking the message as read.",
              error
            );
          }
        );
      }
    }
  }, [conversationWith, conversationDetail, isConversationWith, unread]);

  return (
    <Flex w="100%" h="100%" direction="column" align="center" justify="center">
      <Paper bg="none" w="100%">
        <Grid p="0.5rem 0" justify="space-between" align="center">
          <Grid.Col span="auto">
            <UnstyledButton>
              <Group>
                {detailUser?.status == "online" ? (
                  <Indicator
                    inline
                    size={16}
                    offset={7}
                    position="bottom-end"
                    color="green"
                    withBorder
                  >
                    <Avatar
                      radius="100%"
                      size={50}
                      color="blue"
                      src={detailUser?.avatar}
                    ></Avatar>
                  </Indicator>
                ) : (
                  <Avatar
                    radius="100%"
                    size={40}
                    color="blue"
                    src={detailUser?.avatar}
                  ></Avatar>
                )}

                <div>
                  <Text fz={15}>{detailUser?.name}</Text>
                  {detailUser?.status == "online" && (
                    <Text size="xs" color="dimmed">
                      Active now
                    </Text>
                  )}
                  {detailUser?.status == "offline" && detailUser?.lastActiveAt && (
                    <Text size="xs" color="dimmed">
                      Active {convertTimestamp(detailUser?.lastActiveAt)} ago
                    </Text>
                  )}
                </div>
              </Group>
            </UnstyledButton>
          </Grid.Col>
          <Grid.Col span="content">
            {/* <IconInfoCircle size="1.1rem" /> */}
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper p="0.5rem 0" bg="none" w="100%" h="100%">
        <ScrollArea viewportRef={viewport} w="100%" h="40rem" type="never">
          {conversationDetail?.map((item, index) => (
            <Flex
              py={10}
              key={index}
              gap="sm"
              justify={item.receiverId == UIDme ? "flex-start" : "flex-start"}
              align="center"
              direction={item.receiverId == UIDme ? "row" : "row-reverse"}
              wrap="wrap"
            >
              {item.receiverId == UIDme && (
                <Avatar radius="50%" src={item.sender.avatar}></Avatar>
              )}
              <Flex
                gap={3}
                justify={item.receiverId == UIDme ? "start" : "end"}
                align={item.receiverId == UIDme ? "start" : "end"}
                direction="column"
                wrap="wrap"
              >
                <Box
                  sx={(theme) => ({
                    backgroundColor:
                      item.receiverId == UIDme
                        ? "rgba(31, 65, 114, 0.05)"
                        : "#1f4172",
                    color: item.receiverId == UIDme ? "#000" : "#fff",
                    textAlign: item.receiverId == UIDme ? "start" : "end",
                    padding: theme.spacing.xs,
                    borderTopLeftRadius: theme.radius.lg,
                    borderTopRightRadius: theme.radius.lg,
                    borderBottomRightRadius:
                      item.receiverId != UIDme ? 0 : theme.radius.lg,
                    borderBottomLeftRadius:
                      item.receiverId != UIDme ? theme.radius.lg : 0,
                    cursor: "pointer",
                  })}
                  maw={450}
                >
                  <Flex
                    gap={3}
                    justify={item.receiverId == UIDme ? "start" : "end"}
                    align={item.receiverId == UIDme ? "start" : "end"}
                    direction="column"
                    wrap="wrap"
                  >
                    <Text>{item.data.text}</Text>
                    <Text
                      fz={10}
                      fw={350}
                      color={item.receiverId == UIDme ? "#000" : "#fff"}
                    >
                      {formatTimestamp(item.sentAt)}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          ))}
          {(!conversationDetail || conversationDetail?.length == 0) && (
            <Flex
              p="xl"
              align="center"
              justify="center"
              direction="column"
              gap="xs"
            >
              <Avatar
                radius="100%"
                size={40}
                color="blue"
                src={detailUser?.avatar}
              ></Avatar>
              <Text fz={14}>{detailUser?.name}</Text>
              <Text fz={14} fw={400} color="#868e96">
                No messages yet
              </Text>
            </Flex>
          )}
        </ScrollArea>
        <div ref={messageEndRef}></div>
      </Paper>
      <Flex w="100%" align="flex-end" justify="center">
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
          <Paper
            w="100%"
            style={{
              borderRadius: "2rem",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            }}
          >
            <Grid
              h="100%"
              w="100%"
              m={0}
              p="0.5rem 1rem"
              justify="center"
              align="center"
              style={{
                borderRadius: "2rem",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              }}
            >
              <Grid.Col span="auto">
                <Controller
                  name="messageText"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Textarea
                      autosize
                      {...field}
                      minRows={1}
                      maxRows={3}
                      ref={inputBoxRef}
                      onChange={(event) => {
                        setMessageText(event.currentTarget.value);
                        field.onChange(event);
                      }}
                      value={messageText}
                      placeholder="Type a message here"
                      onKeyPress={handleKeyPress}
                      variant="unstyled"
                    />
                  )}
                ></Controller>
              </Grid.Col>
              <Grid.Col span="content">
                <Button
                  variant="outline"
                  radius="100%"
                  type="submit"
                  bg="none"
                  style={
                    messageTextIsEmpty
                      ? { pointerEvents: "none", border: "none" }
                      : { border: "none" }
                  }
                >
                  <IconSend
                    color={messageTextIsEmpty ? "#555" : "#1f4172"}
                    size="1.1rem"
                  />
                </Button>
              </Grid.Col>
            </Grid>
          </Paper>
        </form>
      </Flex>
    </Flex>
  );
};

export default ChatBox;
