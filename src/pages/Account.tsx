import {
  Avatar,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Modal,
  Tabs,
  Text,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../components/Profile/Profile";
import useUserProfile from "../hooks/useUserProfile";
import Password from "../components/ChangePassword/ChangePassword";
import { useUser, useUserDetail, useFollowUserList } from "../hooks/useUser";
import { useEffect, useRef, useState } from "react";
import { handleGlobalException } from "../utils/error";
import { DetailUser } from "../components/Buddy/type";
import BuddyPersonal from "../components/Buddy/BuddyPersonal";
import { UnfollowModal } from "../components/Buddy/BuddyItem";
import { useDisclosure } from "@mantine/hooks";
import { notificationShow } from "../components/Notification";

function Account() {
  const navigate = useNavigate();
  const { id, tabValue } = useParams();
  const { userProfile } = useUserProfile();
  const isMe = id == userProfile?.data.id;
  const { fetchDetailUser } = useUserDetail(id);
  const [user, setUser] = useState<DetailUser>();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const [isReload, setIsReload] = useState(false);
  const { onSubmitHandleFollow, onSubmitHandleUnfollow } = useUser();
  const filter = {
    userId: id,
    page: 1,
    perPage: 10,
    search: searchValue,
  };
  const {
    dataFollowing,
    errorFollowing,
    fetchNextPageFollowing,
    hasNextPageFollowing,
    isFetchingNextPageFollowing,
    statusFollowing,
    refetchFollowing,
    dataFollower,
    errorFollower,
    fetchNextPageFollower,
    hasNextPageFollower,
    isFetchingNextPageFollower,
    statusFollower,
    refetchFollower,
  } = useFollowUserList(filter);

  const [activeTab, setActiveTab] = useState<string | null>("followers");

  useEffect(() => {
    refetchFollowing();
    refetchFollower();
  }, [searchValue, activeTab, isReload, id]);

  useEffect(() => {
    setSearchValue("");
  }, [activeTab]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClear = () => {
    setSearchValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };
  useEffect(() => {
    async function fetchUser() {
      const data = await fetchDetailUser.refetch();
      if (data.isSuccess) {
        setUser(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchUser();
  }, [id, isReload]);
  const handleFollow = async (data: { id: number }) => {
    await onSubmitHandleFollow(
      data.id,
      () => {
        setIsReload(!isReload);
        refetchFollowing();
        refetchFollower();
        notificationShow("success", "Success!", "Followed successfully");
      },
      (error) => {
        handleGlobalException(error, () => {});
      }
    );
  };

  const handleUnfollow = async (data: { id: number; close: any }) => {
    await onSubmitHandleUnfollow(
      data.id,
      () => {
        refetchFollowing();
        refetchFollower();
        setIsReload(!isReload);
        notificationShow("success", "Success!", "Unfollowed successfully");
        close();
        data.close();
      },
      (error) => {
        handleGlobalException(error, () => {});
      }
    );
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleClear);
  }, []);

  return (
    <Container size={1200} pt={10} pb={15}>
      <Container size={1200} pt={10} pb={60}>
        <Grid justify="space-between" align="flex-end">
          <Grid.Col span="content">
            <Grid>
              <Grid.Col mr={10} className="avatarProfile" span="content">
                <Avatar
                  size={150}
                  radius="100%"
                  src={user?.avatar_url}
                  alt="avatar"
                />
              </Grid.Col>
              <Grid.Col h="auto" span="auto">
                <Flex
                  h="100%"
                  gap={6}
                  justify="end"
                  align="flex-start"
                  direction="column"
                  wrap="wrap"
                >
                  <Text color="#212529" fw={550} fz="22px">
                    {user?.full_name}
                  </Text>
                  <Text fz={14} color="#868e96">
                    {user?.email}
                  </Text>
                  {user?.description && (
                    <Text fz={14} color="#868e96">
                      "{user?.description}"
                    </Text>
                  )}
                  {/* <Flex
                gap="xs"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Flex
                  gap="2px"
                  justify="center"
                  align="center"
                  direction="row"
                  wrap="wrap"
                >
                  <IconMapPin color="#868e96" size="0.8rem" />
                  <Text fz={14} color="#868e96">
                    {userProfile?.data.nationality}
                  </Text>
                </Flex>
                <Divider color="#868e96" size="xs" orientation="vertical" />
                <Text fz={14} color="#868e96">
                  {userProfile?.data.level}
                </Text>
              </Flex> */}
                  {/* <Avatar.Group spacing="xs">
                    <Avatar
                      size={30}
                      src="https://cdn.pixabay.com/photo/2023/10/06/06/54/fantasy-8297567_1280.png"
                      radius="xl"
                    />
                    <Avatar
                      size={30}
                      src="https://cdn.pixabay.com/photo/2024/01/09/22/11/avocado-8498520_1280.jpg"
                      radius="xl"
                    />
                    <Avatar
                      size={30}
                      src="https://cdn.pixabay.com/photo/2022/10/01/21/25/woman-7492273_1280.jpg"
                      radius="xl"
                    />
                    <Avatar
                      size={30}
                      src="https://cdn.pixabay.com/photo/2023/06/14/06/22/cat-8062388_1280.jpg"
                      radius="xl"
                    />

                    <Avatar size={30} radius="xl">
                      <Text fz="13px" fw={450}>
                        +{user?.count_followers}
                      </Text>
                    </Avatar>
                  </Avatar.Group> */}
                </Flex>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col h="auto" span="content">
            {" "}
            <Flex
              gap="xl"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              <Flex
                gap="lg"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Button
                  fz={13}
                  fw={500}
                  onClick={() => {
                    navigate(`/chat/${user?.comet_chat_uid}`);
                  }}
                  styles={(theme) =>
                    !user?.is_following
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
                  Message
                </Button>
                {!isMe && (
                  <Button
                    fz={13}
                    fw={500}
                    onClick={
                      user?.is_following
                        ? () => {
                            open();
                          }
                        : () => {
                            handleFollow({ id: user?.id });
                          }
                    }
                    styles={(theme) =>
                      user?.is_following
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
                    {user?.is_following ? "Following" : "Follow"}
                  </Button>
                )}
              </Flex>
              <Flex
                gap="lg"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Flex
                  gap={8}
                  justify="flex-start"
                  align="center"
                  direction="column"
                  wrap="wrap"
                >
                  <Text color="#212529" fw={400} fz={13}>
                    Followers
                  </Text>
                  <Text color="#212529" fw={600} fz={18}>
                    {user?.count_followers}
                  </Text>
                </Flex>
                <Divider orientation="vertical" />
                <Flex
                  gap={8}
                  justify="flex-start"
                  align="center"
                  direction="column"
                  wrap="wrap"
                >
                  <Text color="#212529" fw={400} fz={13}>
                    Following
                  </Text>
                  <Text color="#212529" fw={600} fz={18}>
                    {user?.count_following}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
      <Tabs
        className="accountTab"
        defaultValue="buddy"
        value={tabValue}
        onTabChange={(value) => navigate(`/personal/${id}/${value}`)}
      >
        <Tabs.List className="tabCustom">
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="buddy">Buddy</Tabs.Tab>
          {isMe && (
            <>
              <Tabs.Tab value="change_password">Change password</Tabs.Tab>
            </>
          )}
        </Tabs.List>
        <Tabs.Panel value="profile">
          {user && (
            <Profile
              fetchDataProfile={() => {
                setIsReload(!isReload);
              }}
              isMe={isMe}
              user={user}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="buddy">
          <BuddyPersonal
            handleChange={handleChange}
            searchValue={searchValue}
            inputRef={inputRef}
            dataFollower={dataFollower}
            errorFollower={errorFollower}
            fetchNextPageFollower={fetchNextPageFollower}
            hasNextPageFollower={hasNextPageFollower}
            isFetchingNextPageFollower={isFetchingNextPageFollower}
            statusFollower={statusFollower}
            refetchFollower={refetchFollower}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            dataFollowing={dataFollowing}
            errorFollowing={errorFollowing}
            fetchNextPageFollowing={fetchNextPageFollowing}
            hasNextPageFollowing={hasNextPageFollowing}
            isFetchingNextPageFollowing={isFetchingNextPageFollowing}
            statusFollowing={statusFollowing}
            refetchFollowing={refetchFollowing}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          ></BuddyPersonal>
        </Tabs.Panel>
        {isMe && (
          <>
            <Tabs.Panel value="change_password">
              <Password />
            </Tabs.Panel>
          </>
        )}
      </Tabs>
      <Modal
        opened={opened}
        onClose={close}
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
          id={user?.id}
          avatar_url={user?.avatar_url}
          full_name={user?.full_name}
          handleUnfollow={() => {
            handleUnfollow({ id: user?.id });
          }}
          closeModal={() => {
            close();
          }}
        />
      </Modal>
    </Container>
  );
}

export default Account;
