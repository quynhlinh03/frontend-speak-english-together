import {
  Button,
  Flex,
  TextInput,
  PasswordInput,
  Text,
  useMantineTheme,
  Select,
} from "@mantine/core";
import {
  IconMail,
  IconUser,
  IconLock,
  IconStack,
  IconBrandNationalGeographic,
} from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IFormInputs, levelData } from "./type";
import useAuth from "../../hooks/useAuth";
import { handleGlobalException } from "../../utils/error";
import SelectCustom from "../UI/SelectCustom/SelectCustom";
import { notificationShow } from "../Notification/Notification";
import {nationality, native_language} from "../../utils/common";

const RegisterForm = () => {
  const theme = useMantineTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      level: "",
      nationality: "",
        native_language: "",
      email: "",
      password: "",
    },
  });
  const { onSubmitRegister, handleRegister } = useAuth();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    onSubmitRegister(
      data,
      (error) => {
        handleGlobalException(error, () => {});
      },
      () => {
        notificationShow(
          "success",
          "Success!",
          "Your account has been successfully registered. Please check your email to confirm your account!"
        );
        // onMethodChange();
      }
    );
  };
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isPasswordValid = (password: string) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
    return passwordRegex.test(password);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text
        fw="600"
        color={theme.colors.navyBlur[0]}
        fz="20px"
        align="center"
        pb="lg"
      >
        Sign Up
      </Text>
      <Flex direction="column" gap="xl">
        <Controller
          name="full_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              placeholder="Enter your full name"
              className="customTextInput customInput"
              withAsterisk
              {...field}
              label="Full name"
              radius="md"
              icon={<IconUser size="0.8rem" />}
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
              className="customTextInput customInput"
              {...field}
              label="Email"
              withAsterisk
              radius="md"
              icon={<IconMail size="0.8rem" />}
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
                data: levelData,
                label: "Level",
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
              withAsterisk
              label="Nationality"
              className="customTextInput customInput"
              placeholder="Select your nationality"
              data={nationality}
              icon={<IconBrandNationalGeographic size="0.8rem" />}
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
          <Controller
              name="native_language"
              control={control}
              rules={{ required: "Please select your native language" }}
              render={({ field }) => (
                  <Select
                      {...field}
                      withAsterisk
                      label="Native language"
                      className="customTextInput customInput"
                      placeholder="Select your native language"
                      data={native_language}
                      icon={<IconBrandNationalGeographic size="0.8rem" />}
                      error={
                          errors.native_language
                              ? errors.native_language.type === "required"
                                  ? "Please enter your native language"
                                  : errors.native_language.message
                              : false
                      }
                  />
              )}
          ></Controller>

        <Controller
          name="password"
          control={control}
          rules={{ required: true, validate: isPasswordValid }}
          render={({ field }) => (
            <PasswordInput
              placeholder="Enter your password"
              className="customTextInput customInput"
              {...field}
              withAsterisk
              label="Password"
              radius="md"
              icon={<IconLock size="0.8rem" />}
              error={
                errors.password
                  ? errors.password.type === "required"
                    ? "Please enter your password"
                    : errors.password.type === "validate"
                    ? "Password requires at least 1 digit, 1 special character, 1 uppercase letter, 1 lowercase letter, and be at least 6 characters long"
                    : errors.password.message
                  : false
              }
            />
          )}
        ></Controller>
        <Button
          className="customButton"
          loading={handleRegister.isLoading}
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
          REGISTER
        </Button>
      </Flex>
    </form>
  );
};

export default RegisterForm;
