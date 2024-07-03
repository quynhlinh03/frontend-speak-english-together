import { Flex, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useFollowUserList, useUser, useUserList } from "../hooks/useUser";
import React from "react";
import { handleGlobalException } from "../utils/error";
import { notificationShow } from "../components/Notification/Notification";
import BuddyList from "../components/Buddy/BuddyList";
import useUserProfile from "../hooks/useUserProfile";

function Buddy() {
  const [searchValue, setSearchValue] = useState("");
  const { userProfile } = useUserProfile();

  const filter = {
    page: 1,
    perPage: 10,
    search: searchValue,
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useUserList(filter);
  const { onSubmitHandleFollow, onSubmitHandleUnfollow } = useUser();

  useEffect(() => {
    refetch();
  }, [searchValue]);

  const [isReload, setIsReload] = useState(false);

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

  const handleFollow = async (data: { id: number }) => {
    await onSubmitHandleFollow(
      data.id,
      () => {
        refetch();
        setIsReload(!isReload);
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
        refetch();
        setIsReload(!isReload);
        notificationShow("success", "Success!", "Unfollowed successfully");
        data.close();
      },
      (error) => {
        handleGlobalException(error, () => {});
      }
    );
  };

  const { refetchFollowing } = useFollowUserList({
    userId: userProfile?.data.id,
    page: 1,
    perPage: 10,
  });

  useEffect(() => {
    if (userProfile?.data.id) {
      refetchFollowing();
    }
  }, [isReload, userProfile?.data.id]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleClear);
  }, []);

  return (
    <Flex
      gap={0}
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
      maw="75rem"
      m="auto"
    >
      <Text className="textDark" pl="2.25rem" fw={500} fz={16} pt={10}>
        All Buddies
      </Text>
      <Flex
        pb="xl"
        w="100%"
        maw="100%"
        gap="2rem"
        justify="flex-end"
        align="flex-end"
        direction="column"
        wrap="wrap"
      >
        <div
          className="search"
          style={{
            width: "18rem",
            padding: "0.75rem",
            marginRight: "2.25rem",
            border: "0.0625rem solid #ced4da",
          }}
        >
          <input
            style={{
              fontWeight: "400",
            }}
            ref={inputRef}
            value={searchValue}
            placeholder="Search buddies"
            spellCheck={false}
            onChange={handleChange}
          />
          <IconSearch color="#AAAAAA" size="1.2rem"></IconSearch>
        </div>
      </Flex>
      <BuddyList
        data={data}
        error={error}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        status={status}
        refetch={refetch}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
      />
    </Flex>
  );
}

export default Buddy;
