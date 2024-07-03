import { useEffect, useState } from "react";
import { useRoomList } from "../../hooks/useLive";
import LiveItem from "./LiveItem";
import { Text, Center, Flex, SimpleGrid, Image } from "@mantine/core";
import { IconChevronsDown } from "@tabler/icons-react";
import React from "react";
import sleep from "../../assets/images/sleep.png";
import { useSearchParams } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
interface LiveListProps {
  topicId?: number | null;
}

function LiveList({ topicId }: LiveListProps) {
  const [queryParameters] = useSearchParams();
  const filter = {
    page: 1,
    perPage: 6,
    search: queryParameters.get("keyword") || "",
    topicId: topicId || null,
  };
  const [isLoad, setIsLoad] = useState(false);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useRoomList(filter);

  useEffect(() => {
    refetch();
  }, [topicId, queryParameters.get("keyword"), isLoad]);

  useEffect(() => {
    const roomMembersCollection = collection(db, "rooms");
    const unsubscribe = onSnapshot(roomMembersCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setIsLoad((prev) => !prev);
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
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
                  pt={40}
                  gap="xl"
                  justify="center"
                  align="center"
                  direction="column"
                  wrap="wrap"
                >
                  <Image maw={80} src={sleep} alt="not found" />
                  <Text>No live streams found, check again later</Text>
                </Flex>
              ) : (
                <>
                  <SimpleGrid cols={2} spacing="lg" verticalSpacing="lg">
                    {group.data.data.map((item) => (
                      <div key={item.id}>
                        <LiveItem
                          name={item.name}
                          is_private={item.is_private}
                          topic={item.topic}
                          level={item.level}
                          description={item.description}
                          max_member_amount={item.max_member_amount}
                          current_member_amount={item.current_member_amount}
                          room_members={item.room_members}
                          id={item.id}
                          video_sdk_room_id={item.video_sdk_room_id}
                        ></LiveItem>
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
    </>
  );
}

export default LiveList;
