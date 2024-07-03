import {
  AspectRatio,
  Overlay,
  Image,
  Flex,
  Text,
  useMantineTheme,
  ActionIcon,
  Modal,
  Button,
} from "@mantine/core";
import {
  IconSearch,
  IconTrashX,
  IconPencilMinus,
  IconCards,
} from "@tabler/icons-react";
import { useCollection, useCollectionDetail } from "../../hooks/useCollection";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { handleGlobalException } from "../../utils/error";
import { CollectionDetails } from "./type";
import { useListVocabulary } from "../../hooks/useVocabulary";
import { AllVocabularyProps } from "../Vocabulary/type";
import VocabularyList from "../Vocabulary/VocabularyList";
import { notificationShow } from "../Notification";
import { deleteModal } from "../../utils/deleteModal";
import CollectionForm from "./CollectionForm";
import { useDisclosure } from "@mantine/hooks";

function CollectionDetail() {
  const { id } = useParams();
  const theme = useMantineTheme();
  const [collectionDetail, setCollectionDetail] = useState<CollectionDetails>();
  const { fetchDetailCollection } = useCollectionDetail(+id);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [allVocabulary, setAllVocabulary] = useState<AllVocabularyProps>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };
  const handleClear = () => {
    setSearchValue("");
  };
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleClear);
  }, []);

  const search = {
    page: currentPage,
    perPage: 5,
    collectionId: id,
    search: searchValue,
  };
  const { fetchAllVocabulary } = useListVocabulary(search);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const { handleDeleteCollection, onSubmitHandleDeleteCollection } =
    useCollection();

  const [opened, { open, close }] = useDisclosure(false);

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
    async function fetchCollectionDetailData() {
      const data = await fetchDetailCollection.refetch();

      if (data.isSuccess) {
        setCollectionDetail(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchCollectionDetailData();
  }, [reload]);

  const handleDeleteCollectionData = (id: number) => {
    onSubmitHandleDeleteCollection(
      id,
      () => {
        notificationShow(
          "success",
          "Success!",
          "Collection delete successfully"
        );
        navigate(`/handbook/collections`);
      },
      (error) => {
        handleGlobalException(error, () => {});
      }
    );
  };

  return (
    <>
      <AspectRatio
        className="aspectRatio"
        ratio={16 / 9}
        w="100%"
        h={200}
        mx="auto"
      >
        <Image w="100%" h={200} src={collectionDetail?.image_url} />
        <Overlay w="100%" h={200} color="#000" opacity={0.6}>
          <Flex
            w="100%"
            h={200}
            gap={2}
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
          >
            <Text py={2} color="#fff" tt="uppercase" lts={1} fz={21} fw={500}>
              {collectionDetail?.name}
            </Text>
            <Text color="#fff" fz={14} fw={450}>
              {collectionDetail?.number_of_vocabularies} items
            </Text>
            <Text color="#fff" fz={14} fw={400}>
              {collectionDetail?.description}
            </Text>
          </Flex>
        </Overlay>
      </AspectRatio>
      <Flex
        style={{
          position: "absolute",
          top: "240px",
          zIndex: "200",
          right: "290px",
        }}
        gap="md"
        justify="flex-end"
        align="flex-end"
        direction="row"
        wrap="wrap"
      >
        <ActionIcon
          style={{
            backgroundColor: "#fff",
            ...theme.fn.hover({
              backgroundColor: "#fff",
            }),
          }}
          size="xl"
          radius="xl"
          variant="filled"
          bg="#fff"
          loading={handleDeleteCollection.isLoading}
          onClick={(event) => {
            event.stopPropagation();
            deleteModal(
              "Delete collection",
              "Are you sure you want to delete this collection?",
              "Delete",
              () => {
                handleDeleteCollectionData(+id);
              }
            );
          }}
        >
          <IconTrashX color="#F582A7" size="1.1rem" />
        </ActionIcon>
        <ActionIcon
          style={{
            backgroundColor: "#fff",
            ...theme.fn.hover({
              backgroundColor: "#fff",
            }),
          }}
          size="xl"
          radius="xl"
          variant="filled"
          bg="#fff"
          onClick={(event) => {
            event.stopPropagation();
            open();
          }}
        >
          <IconPencilMinus color="#F582A7" size="1.1rem" />
        </ActionIcon>
      </Flex>
      <Flex
        gap="4px"
        justify="start"
        align="start"
        direction="column"
        wrap="wrap"
        pb="lg"
        pt="2rem"
      >
        <Text fw="500" color={theme.colors.navyBlur[0]} fz="16px" align="start">
          All saved vocabulary
        </Text>
        <Text color="#868e96" fz={14} fw={400}>
          All vocabulary saved in {collectionDetail?.name}.
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
                navigate(`/handbook/flashcard/${id}`);
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
              placeholder="Search vocabularies"
              spellCheck={false}
              onChange={handleChange}
            />
            <IconSearch color="#AAAAAA" size="1.2rem"></IconSearch>
          </div>
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
      {id && (
        <Modal
          title="Edit collection"
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
            id={+id}
            collectionDetail={collectionDetail}
            handleAddSuccess={() => {
              close();
              setReload((prev) => !prev);
            }}
            handleCancel={close}
          />
        </Modal>
      )}
    </>
  );
}

export default CollectionDetail;
