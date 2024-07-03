import {
  Button,
  Flex,
  TextInput,
  Text,
  NumberInput,
  Switch,
  Textarea,
  Stack,
  Grid,
  Input,
  FileButton,
  PasswordInput,
  ScrollArea,
  Modal,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { handleGlobalException } from "../../../utils/error";
import { useLive } from "../../../hooks/useLive";
import { notificationShow } from "../../Notification";
import { Live } from "../type";
import {
  IconNotes,
  IconUsers,
  IconSquareKey,
  IconPhotoPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploaded from "./ImageUploaded";
import SelectCustom from "../../UI/SelectCustom/SelectCustom";
import { levelData } from "../../LoginForm/type";
import { convertData } from "../../../utils/common";
import TopicContent from "../../ModalItem/TopicContent";
import { useDisclosure } from "@mantine/hooks";

const LiveForm: React.FC<{
  onSuccesSubmitAdd: () => void;
  onCancel: () => void;
}> = ({ onSuccesSubmitAdd }) => {
  const { handleAddLive, onSubmitAddLiveForm, fetchListTopic, uploadImages } =
    useLive();
  const [opened, { open, close }] = useDisclosure(false);
  const [isNavigated, setIsNavigated] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      topicId: 0,
      isPrivate: false,
      password: "",
      description: "",
      thumbnail: "",
      maxMemberAmount: 2,
      videoSDKToken: "",
      level: "",
    },
  });
  const { fetchLiveToken } = useLive();

  const [file, setFile] = useState<File | null>(null);
  const [listTopic, setListTopic] = useState([]);
  const [isShowContent, setIsShowContent] = useState(false);
  const [topicContent, setTopicContent] = useState("");
  const [topicImg, setTopicImg] = useState("");
  const [topicName, setTopicName] = useState("");
  const [topicId, setTopicId] = useState<number | null>(null);
  const [sdkToken, setSdkToken] = useState("");

  useEffect(() => {
    async function fetchTopicData() {
      const data = await fetchListTopic.refetch();
      if (data.isSuccess) {
        setListTopic(data.data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchTopicData();
    async function fetchSDKToken() {
      const dataToken = await fetchLiveToken.refetch();
      if (dataToken.isSuccess) {
        setSdkToken(dataToken.data.data.token);
      } else if (dataToken.isError) {
        const error = dataToken.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchSDKToken();
  }, []);

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

  useEffect(() => {
    const selectedTopic = listTopic.find((topic) => topic.id === topicId);
    if (selectedTopic && selectedTopic.content) {
      setTopicContent(selectedTopic.content);
      setTopicImg(selectedTopic.image);
      setTopicName(selectedTopic.name);
    }
  }, [topicId]);

  const handleUpload = (item: File) => {
    const formData = new FormData();
    formData.append("file", item);
    uploadImages.mutate(formData, {
      onSuccess: (data) => {
        setValue("thumbnail", data.data.imageUrl);
      },
    });
  };

  const onSubmit: SubmitHandler<Live> = async (data) => {
    try {
      let video_sdk_room_id;
      let idRoom;

      data.videoSDKToken = sdkToken;

      const handleSuccess = (message: string) => {
        notificationShow("success", "Success!", message);
      };
      const handleError = (error) => {
        handleGlobalException(error, () => {});
      };

      onSubmitAddLiveForm(
        data,
        (responseData) => {
          video_sdk_room_id = responseData.data.video_sdk_room_id;
          idRoom = responseData.data.id;
          handleSuccess("Room created successfully!");
          onSuccesSubmitAdd();
          if (!isNavigated) {
            setIsNavigated(true);
            navigate(`/screen/${video_sdk_room_id}/${idRoom}`, {
              state: { isValidJoining: true },
            });
          }
        },
        handleError
      );
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  };

  return (
    <ScrollArea.Autosize mah={800} type="never">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack p="10px 2px" spacing="xl">
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextInput
                className="customTextInput"
                placeholder="Enter your room name"
                {...field}
                label="Room name"
                withAsterisk
                radius="md"
                error={
                  errors.name
                    ? errors.name.type === "required"
                      ? "Please enter your name"
                      : errors.name.message
                    : false
                }
              />
            )}
          ></Controller>
          <Controller
            name="topicId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectCustom
                props={{
                  data: convertData(listTopic),
                  label: "Topic",
                  placeholder: "Select your topic",
                  onChange: (selectedValue: number) => {
                    if (selectedValue === 7) {
                      setIsShowContent(false);
                    } else {
                      setIsShowContent(true);
                    }
                    field.onChange(selectedValue);
                    setTopicId(selectedValue);
                  },
                  error: errors.topicId
                    ? errors.topicId.type === "required"
                      ? "Please enter your topic"
                      : errors.topicId.message
                    : false,
                }}
              />
            )}
          ></Controller>
          {isShowContent && (
            <Button
              styles={(theme) => ({
                root: {
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
              onClick={open}
            >
              <Flex
                gap={8}
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <IconNotes size="1rem" />
                <Text fz={14} fw={400}>
                  Preview topic content
                </Text>
              </Flex>
            </Button>
          )}
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              <Flex
                gap={8}
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <IconUsers size="1rem" />
                <Text fz={14} fw={400}>
                  Maximum members
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={2}>
              <Controller
                name="maxMemberAmount"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <NumberInput
                    className="customTextInput"
                    {...field}
                    withAsterisk
                    radius="md"
                    min={2}
                    error={
                      errors.maxMemberAmount
                        ? errors.maxMemberAmount.type === "required"
                          ? "Please enter maximum members"
                          : errors.maxMemberAmount.message
                        : false
                    }
                  />
                )}
              ></Controller>
            </Grid.Col>
          </Grid>
          <Grid justify="space-between" align="center">
            <Grid.Col span="content">
              {" "}
              <Flex
                gap={8}
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <IconSquareKey size="1rem" />
                <Text fz={14} fw={400}>
                  Private
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span="content">
              <Controller
                name="isPrivate"
                control={control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    size="lg"
                    onLabel="ON"
                    offLabel="OFF"
                    onChange={(value) => {
                      field.onChange(value);
                      setChecked(value.currentTarget.checked);
                    }}
                    value={field.value.toString()}
                  />
                )}
              ></Controller>
            </Grid.Col>
          </Grid>
          {checked && (
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <PasswordInput
                  className="customTextInput"
                  placeholder="Enter your password"
                  label="Password"
                  {...field}
                  withAsterisk
                  radius="md"
                  error={
                    errors.password
                      ? errors.password.type === "required"
                        ? "Please enter your password"
                        : errors.password.message
                      : false
                  }
                />
              )}
            ></Controller>
          )}
          <Controller
            name="level"
            control={control}
            rules={{ required: "Please select english room level" }}
            render={({ field }) => (
              <SelectCustom
                props={{
                  style: { radius: "lg" },
                  data: levelData,
                  label: "Level",
                  placeholder: "Select english room level",
                  onChange: (selectedValue: string) =>
                    field.onChange(selectedValue),
                  error: errors.level
                    ? errors.level.type === "required"
                      ? "Please enter english room level"
                      : errors.level.message
                    : false,
                }}
              />
            )}
          ></Controller>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                className="customTextInput"
                placeholder="Enter description"
                {...field}
                label="Description"
                radius="md"
                minRows={3}
              />
            )}
          ></Controller>
          {/* <Input.Wrapper label="Thumbnail" py="7px">
            <Flex
              gap="md"
              justify="flex-start"
              align="center"
              direction="row"
              wrap="wrap"
              py={5}
            >
              <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => (
                  <Button
                    loading={uploadImages.isLoading}
                    {...props}
                    variant="default"
                    radius="md"
                    styles={() => ({
                      root: {
                        width: "192px",
                        height: "108px",
                      },
                    })}
                  >
                    {!uploadImages.isLoading && <IconPhotoPlus size="1rem" />}
                  </Button>
                )}
              </FileButton>
              <ImageUploaded
                imageField={getValues("thumbnail")}
                removeImage={() => {
                  setValue("thumbnail", "");
                }}
              />
            </Flex>
          </Input.Wrapper> */}
          <Button
            loading={handleAddLive.isLoading}
            fw={500}
            fz={14}
            radius="1.5rem"
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
            {" "}
            Start now
          </Button>
        </Stack>
      </form>
      <Modal
        title="Preview Topic Content"
        opened={opened}
        onClose={close}
        size={700}
        centered
        m={20}
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        <TopicContent
          topic={topicName}
          topic_url={topicImg}
          content={topicContent}
        ></TopicContent>
      </Modal>
    </ScrollArea.Autosize>
  );
};

export default LiveForm;
