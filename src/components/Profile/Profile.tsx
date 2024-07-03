import {
  Button,
  Flex,
  TextInput,
  Text,
  useMantineTheme,
  Select,
  Container,
  Textarea,
  Paper,
  Grid,
  Avatar,
  FileButton,
  Input,
  MultiSelect,
} from "@mantine/core";
import { DateInput, DateValue } from "@mantine/dates";
import {
  IconMail,
  IconUser,
  IconCloudUpload,
  IconStack,
  IconBrandNationalGeographic,
  IconFileDescription,
  IconCalendar,
  IconBriefcase,
  IconHeart,
  IconLanguage,
  IconTarget,
} from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { handleGlobalException } from "../../utils/error";
import SelectCustom from "../UI/SelectCustom/SelectCustom";
import { notificationShow } from "../Notification/Notification";
import useUserProfile from "../../hooks/useUserProfile";
import { Account } from "./type";
import { levelData } from "../LoginForm/type";
import { useEffect, useState } from "react";
import { useLive } from "../../hooks/useLive";
import { DetailUser } from "../Buddy/type";
import {
  interests,
  learning_goals,
  nationality,
  native_language,
  occupation,
} from "../../utils/common";

const Profile: React.FC<{
  isMe: boolean;
  user: DetailUser;
  fetchDataProfile: () => void;
}> = ({ isMe, user, fetchDataProfile }) => {
  const theme = useMantineTheme();
  const [file, setFile] = useState<File | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      avatar_url: "",
      description: "",
      full_name: "",
      level: "",
      nationality: "",
      email: "",
      birthday: "",
      native_language: "",
      interests: [],
      learning_goals: [],
      occupation: "",
    },
  });
  const [dataInterests, setDataInterests] = useState(interests);
  const [dataLearningGoals, setDataLearningGoals] = useState(learning_goals);
  const [dataOccupation, setDataOccupation] = useState(occupation);
  const { uploadImages } = useLive();
  const { fetchUserProfile, onSubmitProfileForm, handleUpdateProfile } =
    useUserProfile();
  const [isEdit, setIsEdit] = useState(false);
  async function fetchData() {
    const data = await fetchUserProfile();
    if (data.isSuccess) {
      const result = data.data.data;
      Object.keys(result).forEach((key) => {
        setValue(key, result[key]);
      });
    } else if (data.isError) {
      const error = data.error;
      handleGlobalException(error, () => {});
    }
  }
  useEffect(() => {
    if (!isMe) {
      Object.keys(user).forEach((key) => {
        setValue(key, user[key]);
      });
    }
  }, [user]);
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
        setValue("avatar_url", data.data.imageUrl);
      },
    });
  };

  useEffect(() => {
    if (isMe) {
      fetchData();
    }
  }, [isMe]);

  const handleCancel = () => {
    fetchData();
    setIsEdit(false);
  };
  const onSubmit: SubmitHandler<Account> = (data) => {
    if (isEdit) {
      onSubmitProfileForm(
        data,
        () => {
          fetchDataProfile();
          fetchData();
          notificationShow(
            "success",
            "Success!",
            "Profile updated successfully"
          );
          setIsEdit(false);
        },
        (error) => {
          handleGlobalException(error, () => {});
        }
      );
    }
  };
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
            Profile
          </Text>
          <Text color="#868e96" fz={14} fw={400}>
            View profile.
          </Text>
        </Flex>

        <Paper className="paperColor" withBorder p="md">
          <Grid>
            <Grid.Col span={4}>
              <Flex
                gap="4px"
                justify="start"
                align="start"
                direction="column"
                wrap="wrap"
              >
                <Text fz={14} fw={500}>
                  Personal Infomation
                </Text>
                <Text color="#868e96" fz={14} fw={400}>
                  View personal details here
                </Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span={8}>
              <Paper className="paperColor" withBorder p="md">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Flex direction="column" gap="xl">
                    <Input.Wrapper className="avatar" label="Avatar">
                      <Grid>
                        <Grid.Col span="content">
                          <Avatar
                            mr={5}
                            size={80}
                            radius="100%"
                            src={
                              !isMe
                                ? user["avatar_url"]
                                : getValues("avatar_url")
                            }
                            alt="avatar"
                          />
                        </Grid.Col>
                        <Grid.Col span="auto">
                          {isMe && (
                            <Flex
                              mih="100%"
                              gap="8px"
                              justify="center"
                              align="flex-start"
                              direction="column"
                              wrap="wrap"
                            >
                              <FileButton
                                onChange={setFile}
                                accept="image/png,image/jpeg"
                              >
                                {(props) => (
                                  <Button
                                    loading={uploadImages.isLoading}
                                    {...props}
                                    style={
                                      !isEdit ? { pointerEvents: "none" } : {}
                                    }
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
                                        Upload Photo
                                      </Text>
                                    </Flex>
                                  </Button>
                                )}
                              </FileButton>
                              <Text color="#868e96" fz={12} fw={400}>
                                PNG, JPEG, maximum size 5MB
                              </Text>
                            </Flex>
                          )}
                        </Grid.Col>
                      </Grid>
                    </Input.Wrapper>
                    <Controller
                      name="full_name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextInput
                          placeholder="Enter your full name"
                          className="customTextInput profile"
                          withAsterisk
                          {...field}
                          label="Full name"
                          radius="md"
                          icon={<IconUser size="0.8rem" />}
                          style={!isEdit ? { pointerEvents: "none" } : {}}
                          error={
                            errors.full_name
                              ? errors.full_name.type === "required"
                                ? "Please enter your full name"
                                : errors.full_name.message
                              : false
                          }
                        />
                      )}
                    ></Controller>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true, validate: isEmailValid }}
                      render={({ field }) => (
                        <TextInput
                          placeholder="Enter your email"
                          className="customTextInput profile"
                          {...field}
                          label="Email"
                          withAsterisk
                          radius="md"
                          icon={<IconMail size="0.8rem" />}
                          style={{ pointerEvents: "none" }}
                          error={
                            errors.email
                              ? errors.email.type === "required"
                                ? "Please enter your Email"
                                : errors.email.type === "validate"
                                ? "Email is not valid"
                                : errors.email.message
                              : false
                          }
                        />
                      )}
                    ></Controller>
                    <Controller
                      name="level"
                      control={control}
                      rules={{ required: "Please select your level" }}
                      render={({ field }) => (
                        <SelectCustom
                          props={{
                            style: !isEdit ? { pointerEvents: "none" } : {},
                            className: "customTextInput profile",
                            data: levelData,
                            label: "Level",
                            value: getValues("level"),
                            placeholder: "Select your level",
                            icon: <IconStack size="0.8rem" />,
                            onChange: (selectedValue: string) =>
                              field.onChange(selectedValue),
                            error: errors.level
                              ? errors.level.type === "required"
                                ? "Please enter your level"
                                : errors.level.message
                              : false,
                          }}
                        />
                      )}
                    ></Controller>
                    <Controller
                      name="nationality"
                      control={control}
                      rules={{ required: "Please select your nationality" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          searchable
                          withAsterisk
                          label="Nationality"
                          className="customTextInput profile"
                          placeholder="Select your nationality"
                          data={nationality}
                          icon={<IconBrandNationalGeographic size="0.8rem" />}
                          style={!isEdit ? { pointerEvents: "none" } : {}}
                          error={
                            errors.nationality
                              ? errors.nationality.type === "required"
                                ? "Please enter your nationality"
                                : errors.nationality.message
                              : false
                          }
                        />
                      )}
                    ></Controller>
                    {(isMe || (!isMe && user.description)) && (
                      <Controller
                        name="description"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                          <Textarea
                            placeholder="Enter your bio"
                            className="customTextInput profile iconArea"
                            {...field}
                            label="Bio"
                            radius="md"
                            minRows={3}
                            icon={<IconFileDescription size="0.8rem" />}
                            style={!isEdit ? { pointerEvents: "none" } : {}}
                          />
                        )}
                      ></Controller>
                    )}
                    {(isMe || (!isMe && user.birthday)) && (
                      <Controller
                        name="birthday"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                          <DateInput
                            {...field}
                            clearable
                            label="Birthday"
                            className="customTextInput profile"
                            icon={<IconCalendar size="0.8rem" />}
                            style={!isEdit ? { pointerEvents: "none" } : {}}
                            onChange={(selectedValue: DateValue) => {
                              field.onChange(selectedValue);
                            }}
                            placeholder="Select your birthday"
                            value={
                              field.value ? new Date(field.value) : undefined
                            }
                          />
                        )}
                      ></Controller>
                    )}
                    {(isMe || (!isMe && user.native_language)) && (
                      <Controller
                        name="native_language"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                          <Select
                            searchable
                            clearable
                            {...field}
                            label="Native language"
                            className="customTextInput profile"
                            placeholder="Select your native language"
                            data={native_language}
                            icon={<IconLanguage size="0.8rem" />}
                            style={!isEdit ? { pointerEvents: "none" } : {}}
                          />
                        )}
                      ></Controller>
                    )}
                    {(isMe || (!isMe && user.interests == null)) && (
                      <Controller
                        name="interests"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => {
                          const currentValues = field.value;
                          const updatedDataInterests = [...dataInterests];

                          currentValues.forEach((value) => {
                            if (
                              !updatedDataInterests.some(
                                (item) => item === value
                              )
                            ) {
                              updatedDataInterests.push(value);
                            }
                          });
                          return (
                            <MultiSelect
                              searchable
                              clearable
                              {...field}
                              label="Interests"
                              className="customTextInput profile"
                              placeholder="Select your interests"
                              data={updatedDataInterests}
                              icon={<IconHeart size="0.8rem" />}
                              style={!isEdit ? { pointerEvents: "none" } : {}}
                              creatable
                              getCreateLabel={(query) => `+ Create ${query}`}
                              onCreate={(query) => {
                                const item = query;
                                setDataInterests((current) => [
                                  ...current,
                                  item,
                                ]);
                                return item;
                              }}
                              value={field.value}
                            />
                          );
                        }}
                      ></Controller>
                    )}
                    {(isMe || (!isMe && user.learning_goals == null)) && (
                      <Controller
                        name="learning_goals"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => {
                          const currentValues = field.value;
                          const updatedDataLearningGoals = [
                            ...dataLearningGoals,
                          ];

                          currentValues.forEach((value) => {
                            if (
                              !updatedDataLearningGoals.some(
                                (item) => item === value
                              )
                            ) {
                              updatedDataLearningGoals.push(value);
                            }
                          });
                          return (
                            <MultiSelect
                              searchable
                              clearable
                              {...field}
                              label="Learning goals"
                              className="customTextInput profile"
                              placeholder="Select your learning goals"
                              data={updatedDataLearningGoals}
                              icon={<IconTarget size="0.8rem" />}
                              style={!isEdit ? { pointerEvents: "none" } : {}}
                              creatable
                              getCreateLabel={(query) => `+ Create ${query}`}
                              onCreate={(query) => {
                                const item = query;
                                setDataLearningGoals((current) => [
                                  ...current,
                                  item,
                                ]);
                                return item;
                              }}
                            />
                          );
                        }}
                      ></Controller>
                    )}
                    {(isMe || (!isMe && user.occupation)) && (
                      <Controller
                        name="occupation"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => {
                          const currentValues = field.value;
                          const updatedOccupation = [...dataOccupation];
                          if (currentValues) {
                            if (
                              !updatedOccupation.some(
                                (item) => item === currentValues
                              )
                            ) {
                              updatedOccupation.push(currentValues);
                            }
                          }
                          return (
                            <Select
                              searchable
                              clearable
                              {...field}
                              label="Occupation"
                              className="customTextInput profile"
                              placeholder="Select your occupation"
                              data={updatedOccupation}
                              icon={<IconBriefcase size="0.8rem" />}
                              style={!isEdit ? { pointerEvents: "none" } : {}}
                              creatable
                              getCreateLabel={(query) => `+ Create ${query}`}
                              onCreate={(query) => {
                                const item = query;
                                setDataOccupation((current) => [
                                  ...current,
                                  item,
                                ]);
                                return item;
                              }}
                            />
                          );
                        }}
                      ></Controller>
                    )}

                    {isEdit && isMe && (
                      <Flex
                        direction={{ base: "column", sm: "row" }}
                        gap={{ base: "sm", sm: "lg" }}
                        justify={{ sm: "end" }}
                      >
                        <Button
                          loading={handleUpdateProfile.isLoading}
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
                          Save changes
                        </Button>
                        <Button
                          styles={(theme) => ({
                            root: {
                              color: theme.colors.pinkPastel[0],
                              background: theme.white,
                              borderColor: theme.colors.pinkPastel[0],
                              ...theme.fn.hover({
                                backgroundColor: theme.fn.darken(
                                  theme.white,
                                  0.05
                                ),
                              }),
                            },
                          })}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </form>
                {!isEdit && isMe && (
                  <Flex
                    pt="xl"
                    direction={{ base: "column", sm: "row" }}
                    gap={{ base: "sm", sm: "lg" }}
                    justify={{ sm: "end" }}
                  >
                    <Button
                      type="button"
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
                        setIsEdit(true);
                      }}
                    >
                      Edit profile
                    </Button>
                  </Flex>
                )}
              </Paper>
            </Grid.Col>
          </Grid>
        </Paper>
      </>
    </Container>
  );
};

export default Profile;
