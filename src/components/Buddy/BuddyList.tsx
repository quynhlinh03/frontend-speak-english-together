import {
  Center,
  Container,
  Flex,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { IconChevronsDown } from "@tabler/icons-react";
import sleep from "../../assets/images/error.png";
import React from "react";
import BuddyItem from "../../components/Buddy/BuddyItem";
import { BuddyListProps } from "./type";

function BuddyList({
  data,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  status,
  refetch,
  handleFollow,
  handleUnfollow,
}: BuddyListProps) {
  return (
    <Container w="100%" maw="100%">
      {status === "loading" ? (
        <Text fz={13} px={15} py={10}>
          Loading ...
        </Text>
      ) : status === "error" ? (
        <Text fz={13} px={15} py={10}>
          Error: {error.message}
        </Text>
      ) : (
        <>
          {data?.pages.map((group, i) => (
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
                  <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
                    {group.data.data.map((item) => (
                      <div key={item.id}>
                        <BuddyItem
                          id={item.id}
                          avatar_url={item.avatar_url}
                          full_name={item.full_name}
                          level={item.level}
                          nationality={item.nationality}
                          description={item.description}
                          email={item.email}
                          is_following={item.is_following}
                          handleFollow={handleFollow}
                          handleUnfollow={handleUnfollow}
                        ></BuddyItem>
                      </div>
                    ))}
                  </SimpleGrid>
                </>
              )}
            </React.Fragment>
          ))}
          <div style={{ cursor: "pointer", color: "#F582A7" }}>
            <Center pt={30} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? (
                "Loading ..."
              ) : hasNextPage ? (
                <Flex
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
  );
}

export default BuddyList;
