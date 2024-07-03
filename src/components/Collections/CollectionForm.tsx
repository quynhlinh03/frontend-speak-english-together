import {
  Image,
  Button,
  FileButton,
  Flex,
  Stack,
  TextInput,
  Text,
  Input,
  Textarea,
} from "@mantine/core";
import {
  IconCloudUpload,
  IconFileDescription,
  IconAbc,
} from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CollectionAddForm, CollectionDetails } from "./type";
import { useEffect, useState } from "react";
import { notificationShow } from "../Notification";
import { useLive } from "../../hooks/useLive";
import { useCollection } from "../../hooks/useCollection";
import { handleGlobalException } from "../../utils/error";

export interface CollectionFormProps {
  id?: number;
  collectionDetail?: CollectionDetails;
  handleCancel: () => void;
  handleAddSuccess: () => void;
}

function CollectionForm({
  id,
  collectionDetail,
  handleCancel,
  handleAddSuccess,
}: CollectionFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      image_url: "",
      description: "",
    },
  });
  const [file, setFile] = useState<File | null>(null);
  const { uploadImages } = useLive();
  const {
    handleAddCollection,
    onSubmitHandleCollection,
    handleUpdateCollection,
    onSubmitHandleUpdateCollection,
  } = useCollection();

  useEffect(() => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notificationShow(
          "error",
          "Error!",
          "Image size must be less than 5MB!"
        );
      } else {
        handleUpload(file);
      }
    }
  }, [file]);

  const handleUpload = (item: File) => {
    const formData = new FormData();
    formData.append("file", item);
    uploadImages.mutate(formData, {
      onSuccess: (data) => {
        setValue("image_url", data.data.imageUrl);
      },
    });
  };

  useEffect(() => {
    if (collectionDetail) {
      setValue("name", collectionDetail.name);
      setValue("image_url", collectionDetail.image_url);
      setValue("description", collectionDetail.description);
    }
  }, [id, collectionDetail]);

  const onSubmit: SubmitHandler<CollectionAddForm> = async (data) => {
    const handleSuccess = (message: string) => {
      notificationShow("success", "Success!", message);
    };
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };
    if (!data.image_url) {
      data.image_url =
        "https://storage.googleapis.com/speaking-english-together.appspot.com/images/1716978702287_collection.jpg";
    }
    if (id && collectionDetail) {
      onSubmitHandleUpdateCollection(
        { id: id, data: data },
        () => {
          notificationShow(
            "success",
            "Success!",
            "Collection updated successfully"
          );
          handleAddSuccess();
        },
        (error) => {
          handleGlobalException(error, () => {});
        }
      );
    } else {
      onSubmitHandleCollection(
        data,
        () => {
          handleSuccess("Collection saved successfully!");
          handleAddSuccess();
          handleCancel();
        },
        handleError
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack p="10px 2px" spacing="xl">
        <Input.Wrapper className="avatar" label="Image">
          <Flex
            pt={6}
            mih="100%"
            gap="8px"
            justify="center"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <Button
                  loading={uploadImages.isLoading}
                  {...props}
                  variant="default"
                  radius="50rem"
                  styles={() => ({
                    root: {
                      color: "#1f4172",
                      border: "solid 1px #1f4172",
                    },
                  })}
                >
                  <Flex
                    gap="7px"
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                  >
                    <IconCloudUpload size="1rem" />
                    <Text fz={12} fw={500}>
                      Upload image
                    </Text>
                  </Flex>
                </Button>
              )}
            </FileButton>
            <Text color="#868e96" fz={12} fw={400}>
              PNG, JPEG, maximum size 5MB
            </Text>
            {(getValues("image_url") || collectionDetail?.image_url) && (
              <Image
                mr={5}
                width="100%"
                radius="md"
                src={getValues("image_url") || collectionDetail?.image_url}
                alt="collection image"
              />
            )}
          </Flex>
        </Input.Wrapper>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              className="customTextInput avatar"
              placeholder="Enter your collection name"
              {...field}
              label="Collection name"
              withAsterisk
              radius="md"
              icon={<IconAbc size="0.8rem" />}
              error={
                errors.name
                  ? errors.name.type === "required"
                    ? "Please enter collection name"
                    : errors.name.message
                  : false
              }
            />
          )}
        ></Controller>
        <Controller
          name="description"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <Textarea
              placeholder="Enter description"
              className="customTextInput profile iconArea"
              {...field}
              label="Description"
              radius="md"
              minRows={3}
              icon={<IconFileDescription size="0.8rem" />}
            />
          )}
        ></Controller>
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "sm", sm: "lg" }}
          justify={{ sm: "center" }}
        >
          <Button
            w="8rem"
            loading={
              id
                ? handleUpdateCollection.isLoading
                : handleAddCollection.isLoading
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
  );
}

export default CollectionForm;
