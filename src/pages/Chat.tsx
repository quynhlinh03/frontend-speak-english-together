import {
  CometChat,
  TextMessage,
  MediaMessage,
  CustomMessage,
} from "@cometchat/chat-sdk-javascript";
import {
  ActionIcon,
  Center,
  Flex,
  Grid,
  ScrollArea,
  Tabs,
  Text,
  Image,
} from "@mantine/core";
import { IconDots, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import ChatItem from "../components/Chat/ChatItem";
import { convertTimestamp } from "../utils/common";
import { useNavigate, useParams } from "react-router-dom";
import ChatContentBox from "../components/Chat/ChatContentBox";
import useAuth from "../hooks/useAuth";
import no_conversation from "../assets/images/chat.png";

export default function Chat() {
  const navigate = useNavigate();
  const { conversationWith } = useParams();
  const [conversationList, setConversationList] = useState<any>();
  const [userList, setUserList] = useState<Array<any> | null>();
  const [combinedList, setCombinedList] = useState<Array<any> | null>();
  const [combinedItemList, setCombinedItemList] = useState<Array<any> | null>();
  const { userProfile } = useAuth();

  const [isReload, setIsReload] = useState(false);
  const [searchValue, setSearchValue] = useState();

  useEffect(() => {
    const fetchConversations = async () => {
      const limit = 30;
      const conversationsRequest = new CometChat.ConversationsRequestBuilder()
        .setLimit(limit)
        .build();
      try {
        const conversationList = await conversationsRequest.fetchNext();
        console.log("Conversations list received:", conversationList);
        setConversationList(conversationList);
      } catch (error) {
        console.log("Conversations list fetching failed with error:", error);
      }
    };
    fetchConversations();
  }, [isReload]);

  useEffect(() => {
    if (searchValue) {
      const limit = 30;
      const searchKeyword = searchValue;
      const searchIn = ["uid", "name"];

      const usersRequest = new CometChat.UsersRequestBuilder()
        .setLimit(limit)
        .setSearchKeyword(searchKeyword)
        .searchIn(searchIn)
        .build();

      usersRequest.fetchNext().then(
        (userList) => {
          console.log("Users list fetched:", userList);
          setUserList(userList);
        },
        (error) => {
          console.log("Users list fetching failed with error:", error);
        }
      );
    }
  }, [searchValue]);

  useEffect(() => {
    if (userProfile?.comet_chat_uid) {
      const listenerID = userProfile?.comet_chat_uid;
      CometChat.addMessageListener(
        listenerID,
        new CometChat.MessageListener({
          onTextMessageReceived: (textMessage: TextMessage) => {
            console.log("Text message received successfully", textMessage);
            setIsReload((prev) => !prev);
          },
          onMediaMessageReceived: (mediaMessage: MediaMessage) => {
            console.log("Media message received successfully", mediaMessage);
          },
          onCustomMessageReceived: (customMessage: CustomMessage) => {
            console.log("Custom message received successfully", customMessage);
          },
        })
      );

      return () => {
        CometChat.removeMessageListener(listenerID);
      };
    }
  }, [userProfile?.comet_chat_uid]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };

  useEffect(() => {
    if (userList && userList?.length > 0) {
      setCombinedList([...(userList || [])]);
      setCombinedItemList([...(userList || [])]);
    }
  }, [userList]);
  useEffect(() => {
    if (conversationList) {
      setCombinedList([...(conversationList || [])]);
    }
  }, [conversationList]);

  useEffect(() => {
    if (searchValue) {
      setCombinedItemList([...(userList || [])]);
    }
  }, [userList]);
  useEffect(() => {
    if (!searchValue) {
      setCombinedItemList([...(conversationList || [])]);
    }
  }, [conversationList, searchValue]);

  useEffect(() => {
    if (combinedList && conversationWith && combinedItemList) {
      const conversationExists = combinedList?.some(
        (item) =>
          item.conversationWith?.uid === conversationWith ||
          item?.uid === conversationWith
      );

      if (!conversationExists) {
        CometChat.getUser(conversationWith).then(
          (user) => {
            console.log("User details fetched for user:", user);
            setCombinedList([user, ...combinedList]);
            setCombinedItemList([user, ...combinedItemList]);
          },
          (error) => {
            console.log("User details fetching failed with error:", error);
          }
        );
      }
    }
  }, [combinedList, combinedItemList, conversationWith]);

  return (
    <Tabs
      className="chatCustom"
      value={conversationWith}
      onTabChange={(value) => navigate(`/chat/${value}`)}
      orientation="vertical"
      h="100%"
    >
      <Grid
        w="100%"
        h="100%"
        justify="center"
        align="flex-start"
        bg="#fefaf6"
        style={{ borderRadius: "2rem", padding: "1rem" }}
      >
        <Grid.Col
          h="100%"
          style={{
            borderRadius: "2rem",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
          p="1rem"
          bg="#fff"
          span="content"
        >
          <Flex
            gap="xl"
            w="100%"
            align="center"
            justify="center"
            direction="column"
          >
            <Grid w="100%" align="center" justify="space-between">
              <Grid.Col span="content">
                <Text fz={16} fw={600}>
                  Chats
                </Text>
              </Grid.Col>
              <Grid.Col span="content">
                {/* <ActionIcon>
                  <IconDots size="1.1rem" />
                </ActionIcon> */}
              </Grid.Col>
            </Grid>
            <div
              className="search"
              style={{
                width: "17rem",
                padding: "0.6rem",
                margin: "auto",
                border: "0.0625rem solid #ced4da",
              }}
            >
              <input
                style={{
                  fontWeight: "400",
                }}
                ref={inputRef}
                value={searchValue}
                placeholder="Search name"
                spellCheck={false}
                onChange={handleChange}
              />
              <IconSearch color="#AAAAAA" size="1.2rem"></IconSearch>
            </div>
            {combinedList && combinedList?.length != 0 && (
              <ScrollArea.Autosize mah={800} type="never">
                <Tabs.List w="100%">
                  {combinedItemList?.map((item, index) => {
                    return (
                      <Tabs.Tab
                        w="100%"
                        key={index}
                        value={
                          item?.uid ||
                          item.conversationWith?.uid ||
                          item.conversationWith?.guid
                        }
                      >
                        <ChatItem
                          avatar_url={
                            item?.avatar || item?.conversationWith?.avatar
                          }
                          name={item?.name || item?.conversationWith?.name}
                          lastMessage={item.lastMessage?.data?.text}
                          isYou={
                            item?.lastMessage?.data?.entities?.sender?.entity
                              ?.uid == userProfile?.comet_chat_uid
                          }
                          time={
                            item.lastMessage?.sentAt &&
                            convertTimestamp(item.lastMessage?.sentAt)
                          }
                          unread={item.unreadMessageCount}
                          status={
                            item?.status || item?.conversationWith?.status
                          }
                        />
                      </Tabs.Tab>
                    );
                  })}
                </Tabs.List>
              </ScrollArea.Autosize>
            )}
            {!(combinedItemList && combinedItemList?.length != 0) && (
              <Flex
                p="xs"
                align="center"
                justify="center"
                direction="column"
                gap="xl"
                w="19.1rem"
              >
                <Image maw={40} src={no_conversation} />
                <Text fz={14} fw={400} color="#868e96">
                  No conversation
                </Text>
              </Flex>
            )}
          </Flex>
        </Grid.Col>
        <Grid.Col p="0 1rem" h="100%" span="auto">
          {combinedList?.map((item, index) => (
            <Tabs.Panel
              h="100%"
              key={index}
              value={item.conversationWith?.uid || item?.uid}
            >
              <ChatContentBox
                UIDme={userProfile?.comet_chat_uid}
                isReload={isReload}
                conversationWith={item.conversationWith?.uid || item?.uid}
                setIsReload={setIsReload}
                unread={item.unreadMessageCount}
                isConversationWith={
                  item.conversationWith?.uid == conversationWith ||
                  item?.uid == conversationWith
                }
              />
            </Tabs.Panel>
          ))}
          {!conversationWith && (
            <Flex
              h="100%"
              align="center"
              justify="center"
              direction="column"
              gap="xl"
              pb="10rem"
            >
              <Image maw={50} src={no_conversation} />
              <Text fz={15} fw={400} color="#868e96">
                No conversation selected
              </Text>
            </Flex>
          )}
        </Grid.Col>
      </Grid>
    </Tabs>
  );
}
