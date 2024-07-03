import {
  ActionIcon,
  Button,
  Flex,
  Grid,
  Input,
  Stack,
  TextInput,
  Textarea,
  Text,
  ScrollArea,
} from "@mantine/core";
import {
  IconFileDescription,
  IconAbc,
  IconHealthRecognition,
  IconCircleMinus,
  IconCirclePlus,
} from "@tabler/icons-react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { notificationShow } from "../Notification";
import { handleGlobalException } from "../../utils/error";
import { Vocabulary } from "./type";
import { useVocabulary, useVocabularyDetail } from "../../hooks/useVocabulary";
import SelectCustom from "../UI/SelectCustom/SelectCustom";
import { AllCollectionProps, CollectionProps } from "../Collections/type";
import { useCollection } from "../../hooks/useCollection";
import { useEffect, useState } from "react";
import { TopicData } from "../LiveList/type";

export function convertData(data: CollectionProps[]) {
  return data?.map((item) => {
    return {
      id: item.id,
      image: item.image_url,
      label: item.name,
      value: item.id,
    };
  });
}

export function convertDataGetName(data: TopicData[]) {
  return data
    .filter((item) => item.name.toLowerCase() !== "free topic")
    .map((item) => {
      return {
        id: item.id,
        image: item.image,
        label: item.name,
        value: item.name,
        content: item.content,
      };
    });
}

export interface VocabularyFormProps {
  handleCancel: () => void;
  handleAddSuccess: () => void;
  id?: number | null;
}

function VocabularyForm({
  handleCancel,
  handleAddSuccess,
  id,
}: VocabularyFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      word: "",
      meaning: "",
      examples: [{ text: "", translation: "" }],
      context: "",
      collection_id: null,
    },
  });
  const {
    handleAddVocabulary,
    onAddVocabulary,
    handleUpdateVocabulary,
    onUpdateVocabulary,
  } = useVocabulary();
  const [allCollection, setAllCollection] = useState<AllCollectionProps>();
  const { fetchAllCollection } = useCollection();
  if (id) {
    const { fetchVocabularyDetail } = useVocabularyDetail(id);
    useEffect(() => {
      async function fetchDetailVocabulary() {
        const data = await fetchVocabularyDetail.refetch();
        if (data.isSuccess) {
          const result = data.data.data;
          const transformData = {
            ...result,
            collection_id: result.collection.id,
          };
          type TransformDataKeys = keyof typeof transformData;

          (Object.keys(transformData) as TransformDataKeys[]).map(
            (item: TransformDataKeys) => {
              if (item != "collection" && item != "id") {
                setValue(item, transformData[item]);
              }
            }
          );
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchDetailVocabulary();
    }, [id]);
  }

  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    name: "examples",
    control,
  });

  const onSubmit: SubmitHandler<Vocabulary> = async (data) => {
    const handleSuccess = (message: string) => {
      notificationShow("success", "Success!", message);
    };
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };
    if (id) {
      onUpdateVocabulary(
        { id: id, data: data },
        () => {
          handleSuccess("Vocabulary updated successfully!");
          handleAddSuccess();
          handleCancel();
        },
        handleError
      );
    } else {
      onAddVocabulary(
        data,
        () => {
          handleSuccess("Vocabulary saved successfully!");
          handleAddSuccess();
          handleCancel();
        },
        handleError
      );
    }
  };

  useEffect(() => {
    async function fetchAllVocabularyData() {
      const data = await fetchAllCollection.refetch();
      if (data.isSuccess) {
        setAllCollection(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchAllVocabularyData();
  }, []);

  return (
    <ScrollArea.Autosize mah={800} type="never">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack p="10px 2px" spacing="xl">
          <Controller
            name="word"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextInput
                className="customTextInput avatar"
                placeholder="Enter word"
                {...field}
                label="Word"
                withAsterisk
                radius="md"
                icon={<IconAbc size="0.8rem" />}
                error={
                  errors.word
                    ? errors.word.type === "required"
                      ? "Please enter word"
                      : errors.word.message
                    : false
                }
              />
            )}
          ></Controller>
          <Controller
            name="meaning"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextInput
                className="customTextInput avatar"
                placeholder="Enter meaning"
                {...field}
                label="Meaning"
                withAsterisk
                radius="md"
                icon={<IconAbc size="0.8rem" />}
                error={
                  errors.meaning
                    ? errors.meaning.type === "required"
                      ? "Please enter meaning"
                      : errors.meaning.message
                    : false
                }
              />
            )}
          ></Controller>
          <Controller
            name="context"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <Textarea
                placeholder="Enter context"
                className="customTextInput profile iconArea"
                {...field}
                label="Context"
                radius="md"
                autosize
                minRows={3}
                icon={<IconFileDescription size="0.8rem" />}
              />
            )}
          ></Controller>
          <Input.Wrapper label="Examples">
            <Flex
              pt="6.4px"
              gap="1rem"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              {exampleFields.map((item, index) => (
                <Grid key={item.id} w="100%" justify="center" align="center">
                  <Grid.Col pl={0} span="auto">
                    <Controller
                      name={`examples.${index}.text` as const}
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Enter text"
                          className="customTextInput profile iconArea"
                          radius="md"
                          minRows={1}
                          icon={<IconFileDescription size="0.8rem" />}
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col pl={0} span="auto">
                    <Controller
                      name={`examples.${index}.translation` as const}
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Enter translation"
                          className="customTextInput profile iconArea"
                          radius="md"
                          minRows={1}
                          icon={<IconFileDescription size="0.8rem" />}
                        />
                      )}
                    />
                  </Grid.Col>

                  <Grid.Col p={0} span="content">
                    <ActionIcon
                      disabled={exampleFields.length === 1}
                      onClick={() => {
                        removeExample(index);
                      }}
                      bg="#1F4172"
                      variant="filled"
                    >
                      <IconCircleMinus size="1.125rem" />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              ))}
              <Button
                onClick={() => {
                  appendExample({ text: "", translation: "" });
                }}
                styles={(theme) => ({
                  root: {
                    width: "100%",
                    borderRadius: "0.5rem",
                    fontWeight: 400,
                    color: theme.colors.navyBlur[0],
                    backgroundColor: theme.colors.navyBlurLight[0],
                    ...theme.fn.hover({
                      color: theme.fn.darken(theme.colors.navyBlur[0], 0.1),
                      backgroundColor: theme.colors.navyBlurLight[0],
                    }),
                  },
                })}
                variant="light"
                type="button"
                px="0.5rem"
              >
                <Flex
                  gap={8}
                  justify="flex-start"
                  align="center"
                  direction="row"
                  wrap="wrap"
                >
                  <IconCirclePlus size="1rem" />
                  <Text fz={14} fw={400}>
                    Add
                  </Text>
                </Flex>
              </Button>
            </Flex>
          </Input.Wrapper>

          {allCollection?.total != 0 && allCollection && (
            <Controller
              name="collection_id"
              control={control}
              rules={{ required: "Please select collection" }}
              render={({ field }) => (
                <SelectCustom
                  props={{
                    style: { color: "#212529", fontWeight: "400" },
                    clearable: true,
                    data: convertData(allCollection.data),
                    label: "Collection",
                    value: getValues("collection_id") || "",
                    placeholder: "Select collection",
                    icon: <IconHealthRecognition size="0.8rem" />,
                    onChange: (selectedValue: string) => {
                      field.onChange(selectedValue);
                      setValue("collection_id", +selectedValue);
                    },
                    error: errors.collection_id
                      ? errors.collection_id.type === "required"
                        ? "Please select collection"
                        : errors.collection_id.message
                      : false,
                  }}
                />
              )}
            ></Controller>
          )}
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={{ base: "sm", sm: "lg" }}
            justify={{ sm: "center" }}
          >
            <Button
              w="8rem"
              loading={
                id
                  ? handleUpdateVocabulary.isLoading
                  : handleAddVocabulary.isLoading
              }
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
              type="submit"
            >
              {id ? "Save" : "Add"}
            </Button>
            <Button
              w="8rem"
              styles={(theme) => ({
                root: {
                  color: theme.colors.pinkPastel[0],
                  background: theme.white,
                  borderColor: theme.colors.pinkPastel[0],
                  ...theme.fn.hover({
                    backgroundColor: theme.fn.darken(theme.white, 0.05),
                  }),
                },
              })}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Flex>
        </Stack>
      </form>
    </ScrollArea.Autosize>
  );
}

export default VocabularyForm;
