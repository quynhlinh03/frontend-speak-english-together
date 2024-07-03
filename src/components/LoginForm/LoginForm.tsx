import {
  Button,
  Flex,
  TextInput,
  PasswordInput,
  Text,
  useMantineTheme,
  Divider,
  ThemeIcon,
} from "@mantine/core";
import { IconBrandGoogleFilled, IconMail, IconLock } from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IFormInputs } from "./type";
import useAuth from "../../hooks/useAuth";
import { handleGlobalException } from "../../utils/error";

const LoginForm = () => {
  const theme = useMantineTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { onSubmitAccountForm, handleLoginPassword } = useAuth();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    onSubmitAccountForm(
      data,
      () => {},
      (error) => {
        handleGlobalException(error, () => {});
      }
    );
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
        Sign In
      </Text>
      <Flex direction="column" gap="xl">
        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
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
                    : errors.email.message
                  : false
              }
            />
          )}
        ></Controller>
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
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
                    : errors.password.message
                  : false
              }
            />
          )}
        ></Controller>
        {/* <Flex justify="flex-end">
          <Text className="pHover" color={theme.colors.navyBlur[0]}>
            Forgot password ?
          </Text>
        </Flex> */}
        <Button
          className="customButton"
          loading={handleLoginPassword.isLoading}
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
          LOGIN
        </Button>
        {/* <Divider my="xs" label="OR" labelPosition="center" />
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Text color={theme.colors.navyBlur[0]}>Sign in with</Text>
          <ThemeIcon className="themeiconCustom" radius="xl" size="xl">
            <IconBrandGoogleFilled size="1.3rem" />
          </ThemeIcon>
        </Flex> */}
      </Flex>
    </form>
  );
};

export default LoginForm;
