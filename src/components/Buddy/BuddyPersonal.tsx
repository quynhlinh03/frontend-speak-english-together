import {
  Container,
  Flex,
  Paper,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { StyledTabs } from "../../components/UI/StyledTabs/StyledTabs";
import BuddyList from "./BuddyList";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
interface BuddyPersonalProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  dataFollower: InfiniteData<AxiosResponse<any, any>> | undefined;
  errorFollower: unknown;
  fetchNextPageFollower: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<AxiosResponse<any, any>, unknown>>;
  hasNextPageFollower: boolean | undefined;
  isFetchingNextPageFollower: boolean;
  statusFollower: "error" | "loading" | "success";
  refetchFollower: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<InfiniteData<AxiosResponse<any, any>>, unknown>
  >;
  handleFollow: (data: { id: number }) => Promise<void>;
  handleUnfollow: (data: { id: number; close: any }) => Promise<void>;
  dataFollowing: InfiniteData<AxiosResponse<any, any>> | undefined;
  errorFollowing: unknown;
  fetchNextPageFollowing: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<AxiosResponse<any, any>, unknown>>;
  hasNextPageFollowing: boolean | undefined;
  isFetchingNextPageFollowing: boolean;
  statusFollowing: "error" | "loading" | "success";
  refetchFollowing: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<InfiniteData<AxiosResponse<any, any>>, unknown>
  >;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}
function BuddyPersonal({
  handleChange,
  searchValue,
  inputRef,
  dataFollower,
  errorFollower,
  fetchNextPageFollower,
  hasNextPageFollower,
  isFetchingNextPageFollower,
  statusFollower,
  refetchFollower,
  handleFollow,
  handleUnfollow,
  dataFollowing,
  errorFollowing,
  fetchNextPageFollowing,
  hasNextPageFollowing,
  isFetchingNextPageFollowing,
  statusFollowing,
  refetchFollowing,
  activeTab,
  setActiveTab,
}: BuddyPersonalProps) {
  const theme = useMantineTheme();

  return (
    <Container py={20} maw="100%" className="personal-ctn">
      <>
        <Flex
          gap="4px"
          justify="start"
          align="start"
          direction="column"
          wrap="wrap"
          pb="lg"
        >
          <Text
            fw="550"
            color={theme.colors.navyBlur[0]}
            fz="16px"
            align="start"
          >
            Buddy
          </Text>
          <Text color="#868e96" fz={14} fw={400}>
            Followers and following list.
          </Text>
        </Flex>

        <Paper className="paperColor" withBorder p="md">
          <Container size={1200} pt={10} pb={15}>
            <StyledTabs value={activeTab} onTabChange={setActiveTab}>
              <Tabs.List className="tabCustom">
                <Tabs.Tab value="followers">Followers</Tabs.Tab>
                <Tabs.Tab value="following">Following</Tabs.Tab>
              </Tabs.List>

              <Flex pb="1rem" gap="lg" justify="flex-end" align="center">
                <div
                  className="search"
                  style={{
                    width: "16rem",
                    padding: "0.7rem",
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
                  <IconSearch color="#AAAAAA" size="1rem"></IconSearch>
                </div>
              </Flex>
              <Tabs.Panel value="followers">
                <Text fz={14} fw={500} pb="1.5rem" pt={10}>
                  Followers
                </Text>
                <BuddyList
                  data={dataFollower}
                  error={errorFollower}
                  fetchNextPage={fetchNextPageFollower}
                  hasNextPage={hasNextPageFollower}
                  isFetchingNextPage={isFetchingNextPageFollower}
                  status={statusFollower}
                  refetch={refetchFollower}
                  handleFollow={handleFollow}
                  handleUnfollow={handleUnfollow}
                />
              </Tabs.Panel>
              <Tabs.Panel value="following">
                <Text fz={14} fw={500} pb="1.5rem" pt={10}>
                  Following
                </Text>
                <BuddyList
                  data={dataFollowing}
                  error={errorFollowing}
                  fetchNextPage={fetchNextPageFollowing}
                  hasNextPage={hasNextPageFollowing}
                  isFetchingNextPage={isFetchingNextPageFollowing}
                  status={statusFollowing}
                  refetch={refetchFollowing}
                  handleFollow={handleFollow}
                  handleUnfollow={handleUnfollow}
                />
              </Tabs.Panel>
            </StyledTabs>
          </Container>
        </Paper>
      </>
    </Container>
  );
}

export default BuddyPersonal;
