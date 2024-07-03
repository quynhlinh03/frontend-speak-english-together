import {
  Center,
  Flex,
  Modal,
  SimpleGrid,
  Tabs,
  Text,
  Image,
  useMantineTheme,
  Button,
} from "@mantine/core";
import {
  IconCirclePlus,
  IconChevronsDown,
  IconSearch,
  IconCards,
} from "@tabler/icons-react";
import sleep from "../assets/images/error.png";
import { useDisclosure } from "@mantine/hooks";
import CollectionForm from "../components/Collections/CollectionForm";
import { useNavigate, useParams } from "react-router-dom";
import { useListVocabulary } from "../hooks/useVocabulary";
import { useEffect, useRef, useState } from "react";
import { handleGlobalException } from "../utils/error";
import { AllVocabularyProps } from "../components/Vocabulary/type";
import VocabularyList from "../components/Vocabulary/VocabularyList";
import { useCollectionList } from "../hooks/useCollection";
import React from "react";
import VocabularyForm from "../components/Vocabulary/VocabularyForm";
import CollectionItem from "../components/Collections/CollectionItem";

function Handbook() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { tabValue } = useParams();

  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedAddVocabulary,
    { open: openAddVocabulary, close: closeAddVocabulary },
  ] = useDisclosure(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [reload, setReload] = useState(false);

  const search = { page: currentPage, perPage: 5, search: searchValue };
  const { fetchAllVocabulary } = useListVocabulary(search);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClear = () => {
    setSearchValue("");
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleClear);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };
  const [allVocabulary, setAllVocabulary] = useState<AllVocabularyProps>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [perPage, setPerPage] = useState(5);
  const filter = {
    page: 1,
    perPage: perPage,
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useCollectionList(filter);
  useEffect(() => {
    if (data) {
      setPerPage(6);
    }
  }, [data]);

  useEffect(() => {
    async function fetchAllVocabularyData() {
      const data = await fetchAllVocabulary.refetch();

      if (data.isSuccess) {
        setAllVocabulary(data.data.data);
        let total = data.data.data.total;
        setTotalPages(
          total % search.perPage == 0
            ? Math.floor(total / search.perPage)
            : Math.floor(total / search.perPage) + 1
        );
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchAllVocabularyData();
  }, [searchValue, reload, currentPage]);

  useEffect(() => {
    refetch();
  }, [reload]);

  return (
    <Flex
      pt={10}
      px="2.25rem"
      w="100%"
      gap="5px"
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
      maw="75rem"
      m="auto"
    >
      <Text className="textDark" fw={500} fz={16}>
        Handbook
      </Text>
      <Tabs
        pt={20}
        w="100%"
        className="accountTab"
        defaultValue="all"
        value={tabValue}
        onTabChange={(value) => navigate(`/handbook/${value}`)}
      >
        <Tabs.List className="tabCustom">
          <Tabs.Tab value="all">Saved vocabulary</Tabs.Tab>
          <Tabs.Tab value="collections">Collections</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel px="16px" value="all">
          {" "}
          <Flex
            gap="4px"
            justify="start"
            align="start"
            direction="column"
            wrap="wrap"
            pb="lg"
            pt="2rem"
          >
            <Text
              fw="500"
              color={theme.colors.navyBlur[0]}
              fz="16px"
              align="start"
            >
              All saved vocabulary
            </Text>
            <Text color="#868e96" fz={14} fw={400}>
              All vocabulary saved in all collections.
            </Text>
            <Flex
              w="100%"
              maw="100%"
              gap="2rem"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              {allVocabulary?.data?.length != 0 && (
                <Button
                  styles={(theme) => ({
                    root: {
                      border: " 0.0625rem solid #dee2e6",
                      borderRadius: "0.7rem",
                      backgroundColor: "rgba(255, 239, 224, 0.1)",
                      ...theme.fn.hover({
                        backgroundColor: "rgba(255, 239, 224, 0.1)",
                      }),
                    },
                  })}
                  variant="default"
                  onClick={() => {
                    navigate(`/handbook/flashcard`);
                  }}
                >
                  <Flex
                    justify="flex-center"
                    align="flex-center"
                    direction="row"
                    wrap="wrap"
                    gap="xs"
                  >
                    <IconCards color="#fc6736" stroke={1.8} size="1.12rem" />
                    <Text color="#fc6736" fz={13} fw={450}>
                      Flashcards
                    </Text>
                  </Flex>
                </Button>
              )}
              <div
                className="search"
                style={{
                  width: "16rem",
                  padding: "0.7rem",
                  border: "0.0625rem solid #ced4da",
                }}
              >
                <input
                  style={{
                    fontWeight: "400",
                  }}
                  ref={inputRef}
                  value={searchValue}
                  placeholder="Search vocabularies"
                  spellCheck={false}
                  onChange={handleChange}
                />
                <IconSearch color="#AAAAAA" size="1.2rem"></IconSearch>
              </div>
              {data?.pages?.[0]?.data?.total != 0 && (
                <Button
                  p="0 0.7rem"
                  fw={500}
                  fz={14}
                  radius="1.5rem"
                  leftIcon={<IconCirclePlus m-r="0.5rem" size="1.125rem" />}
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.pinkPastel[0],
                      ...theme.fn.hover({
                        backgroundColor: theme.fn.darken(
                          theme.colors.pinkPastel[0],
                          0.1
                        ),
                      }),
                    },
                  })}
                  onClick={openAddVocabulary}
                >
                  {" "}
                  Add vocabulary
                </Button>
              )}
            </Flex>
            <VocabularyList
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              allVocabulary={allVocabulary}
              perPage={search.perPage}
              handleSuccess={() => {
                setReload((prev) => !prev);
              }}
            />
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel px="16px" value="collections">
          <Flex
            gap="4px"
            justify="start"
            align="start"
            direction="column"
            wrap="wrap"
            pb="lg"
            pt="2rem"
          >
            <Text
              fw="500"
              color={theme.colors.navyBlur[0]}
              fz="16px"
              align="start"
            >
              Collections
            </Text>
            <Text color="#868e96" fz={14} fw={400}>
              Collections of vocabulary for various themes. Create collections
              and add words as desired.
            </Text>
          </Flex>
          <SimpleGrid
            py="1rem"
            maw="100%"
            cols={3}
            spacing="3rem"
            verticalSpacing="3rem"
          >
            <Flex
              gap={10}
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
              pt="2rem"
              style={{ border: "0.15rem dashed #5d5c5f", cursor: "pointer" }}
              p="xs"
              color="#F582A7"
              onClick={open}
              mih={350}
            >
              <IconCirclePlus color="#F582A7" size="4rem" stroke={0.8} />
              <Text color="#F582A7" fw={450} fz={14}>
                New collection
              </Text>
            </Flex>
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
                {data?.pages?.map((group, i) => (
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
                        <Text>No collection yet</Text>
                      </Flex>
                    ) : (
                      <>
                        {group?.data?.data?.map((item, index) => (
                          <div key={index}>
                            <CollectionItem
                              description={item.description}
                              index={index}
                              id={item.id}
                              image_url={item.image_url}
                              name={item.name}
                              number_of_vocabularies={
                                item.number_of_vocabularies
                              }
                            />
                          </div>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </SimpleGrid>
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
          <Modal
            title="Add collection"
            opened={opened}
            onClose={close}
            size={640}
            centered
            m={20}
            styles={() => ({
              title: {
                fontWeight: "bold",
              },
            })}
          >
            <CollectionForm
              handleAddSuccess={() => {
                setReload((prev) => !prev);
              }}
              handleCancel={close}
            />
          </Modal>
          <Modal
            title="Add vocabulary"
            opened={openedAddVocabulary}
            onClose={closeAddVocabulary}
            size={800}
            centered
            m={20}
            styles={() => ({
              title: {
                fontWeight: "bold",
              },
            })}
          >
            <VocabularyForm
              handleAddSuccess={() => {
                setReload((prev) => !prev);
              }}
              handleCancel={closeAddVocabulary}
            />
          </Modal>
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}

export default Handbook;
