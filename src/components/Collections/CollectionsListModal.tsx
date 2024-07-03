import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCollectionList } from "../../hooks/useCollection";
import React from "react";
import { IconChevronsDown, IconCirclePlus } from "@tabler/icons-react";
import {
  Text,
  Flex,
  Center,
  Image,
  Radio,
  Group,
  Grid,
  Avatar,
  Button,
  Modal,
} from "@mantine/core";
import sleep from "../../assets/images/error.png";
import { useVocabulary } from "../../hooks/useVocabulary";
import { notificationShow } from "../Notification";
import { handleGlobalException } from "../../utils/error";
import { Vocabulary } from "../Vocabulary/type";
import { SubmitHandler } from "react-hook-form";
import CollectionForm from "./CollectionForm";
import { useDisclosure } from "@mantine/hooks";

export interface CollectionsListModalProps {
  setIsSaved: Dispatch<SetStateAction<boolean>>;
  vocabulary: Vocabulary;
  handleSuccessAddVocabulary: () => void;
}

function CollectionsListModal({
  setIsSaved,
  vocabulary,
  handleSuccessAddVocabulary,
}: CollectionsListModalProps) {
  const filter = {
    page: 1,
    perPage: 6,
  };
  const { handleAddVocabulary, onAddVocabulary } = useVocabulary();
  const [opened, { open, close }] = useDisclosure(false);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useCollectionList(filter);

  const [value, setValue] = useState("");

  const addVocabulary: SubmitHandler<Vocabulary> = async (data) => {
    const handleSuccess = (message: string) => {
      notificationShow("success", "Success!", message);
    };
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };

    onAddVocabulary(
      data,
      () => {
        handleSuccess("Vocabulary saved successfully!");
        setIsSaved(true);
        handleSuccessAddVocabulary();
      },
      handleError
    );
  };

  useEffect(() => {
    refetch();
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
                  <Radio.Group
                    className="radioCustom"
                    value={value}
                    onChange={setValue}
                    name="collection"
                    required
                  >
                    <Group mt="xs">
                      <Flex
                        w="100%"
                        gap="1.2rem"
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap"
                      >
                        {group.data.data.map((item) => (
                          <div style={{ width: "100%" }} key={item.id}>
                            <Grid
                              className="hover"
                              justify="space-between"
                              align="center"
                            >
                              <Grid.Col span="auto">
                                <Flex
                                  gap={10}
                                  justify="flex-start"
                                  align="center"
                                  direction="row"
                                  wrap="wrap"
                                >
                                  <Avatar size={40} src={item.image_url} />
                                  <div>
                                    <Text color="#212529" fw={500} fz={14}>
                                      {item.name}
                                    </Text>
                                    <Text color="#868e96" fw={400} fz={12}>
                                      {item.number_of_vocabularies} items
                                    </Text>
                                  </div>
                                </Flex>
                              </Grid.Col>
                              <Grid.Col pr={20} span="content">
                                <Radio value={item.id.toString()} />
                              </Grid.Col>
                            </Grid>
                          </div>
                        ))}
                      </Flex>
                    </Group>
                  </Radio.Group>
                </>
              )}
            </React.Fragment>
          ))}
          <div style={{ cursor: "pointer", color: "#F582A7" }}>
            <Center py={10} onClick={() => fetchNextPage()}>
              {isFetchingNextPage
                ? "Loading ..."
                : hasNextPage && (
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
                  )}
            </Center>
          </div>
        </>
      )}
      <Flex
        className="hover"
        style={{
          borderTop: "0.0625rem solid #dee2e6",
          borderBottom: "0.0625rem solid #dee2e6",
        }}
        py={10}
        w="100%"
        gap={10}
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
        mb={10}
        onClick={open}
      >
        <Avatar bg="#1F4172" size={40}>
          <IconCirclePlus color="#fff" size="1.1rem" />
        </Avatar>
        <Text color="#212529" fw={500} fz={14}>
          New collection
        </Text>
      </Flex>

      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "sm", sm: "lg" }}
        justify={{ sm: "end" }}
      >
        <Button
          w="8rem"
          loading={handleAddVocabulary.isLoading}
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
          onClick={() => {
            if (value) {
              addVocabulary({ ...vocabulary, collection_id: +value });
            } else {
              notificationShow("error", "Error!", "Please select a collection");
            }
          }}
          type="submit"
        >
          Done
        </Button>
      </Flex>
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
            refetch();
          }}
          handleCancel={close}
        />
      </Modal>
    </>
  );
}

export default CollectionsListModal;
