import {
  Aside,
  Center,
  Container,
  Flex,
  Text,
  Image,
  ScrollArea,
} from "@mantine/core";
import MainLink from "./AsideLink";
import { Avatar } from "@mantine/core";
import useUserProfile from "../../hooks/useUserProfile";
import { useFollowUserList } from "../../hooks/useUser";
import { IconChevronsDown } from "@tabler/icons-react";
import sleep from "../../assets/images/error.png";
import React, { useEffect } from "react";

export default function DashboardNavbar() {
  const { userProfile, fetchUserProfile } = useUserProfile();
  const filter = {
    userId: userProfile?.data.id,
    page: 1,
    perPage: 10,
  };
  const {
    dataFollowing,
    errorFollowing,
    fetchNextPageFollowing,
    hasNextPageFollowing,
    isFetchingNextPageFollowing,
    statusFollowing,
    refetchFollowing,
  } = useFollowUserList(filter);

  useEffect(() => {
    if (userProfile?.data.id && filter.userId) {
      refetchFollowing();
    } else {
      fetchUserProfile();
    }
  }, [userProfile?.data.id]);

  return (
    <Aside
      p="sm"
      hiddenBreakpoint="sm"
      width={{ sm: 220, lg: 250 }}
      className="Aside"
    >
      <Text mt="0.3rem" mb="-0.6rem" fz={16} fw={400}>
        Contacts
      </Text>
      <Aside.Section grow mt="md">
        <ScrollArea w="100%" h={800} type="never">
          <Container p={0} w="100%" maw="100%">
            {statusFollowing === "loading" ? (
              <Text fz={13} px={15} py={10}>
                Loading ...
              </Text>
            ) : statusFollowing === "error" ? (
              <Text fz={13} px={15} py={10}>
                Error: {errorFollowing.message}
              </Text>
            ) : (
              <>
                {dataFollowing?.pages.map((group, i) => (
                  <React.Fragment key={i}>
                    {!group.data.data.length ? (
                      <Flex
                        p="2.5rem 0"
                        gap="xl"
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                      >
                        <Image maw={80} src={sleep} alt="not found" />
                        <Text>No users found.</Text>
                      </Flex>
                    ) : (
                      <>
                        {group.data.data
                          .map((item) => ({
                            icon: (
                              <Avatar
                                radius="xl"
                                src={item.avatar_url}
                                alt="avatar"
                              />
                            ),
                            label: item.full_name,
                            uid: item.comet_chat_uid,
                          }))
                          .map((link) => (
                            <MainLink {...link} key={link.label} />
                          ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
                <div style={{ cursor: "pointer", color: "#F582A7" }}>
                  <Center pt={10} onClick={() => fetchNextPageFollowing()}>
                    {isFetchingNextPageFollowing ? (
                      "Loading ..."
                    ) : hasNextPageFollowing ? (
                      <Flex
                        pb="xs"
                        gap="xs"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap"
                      >
                        <IconChevronsDown size={12} />
                        Read more
                      </Flex>
                    ) : (
                      ""
                    )}
                  </Center>
                </div>
              </>
            )}
          </Container>
        </ScrollArea>
      </Aside.Section>
    </Aside>
  );
}
