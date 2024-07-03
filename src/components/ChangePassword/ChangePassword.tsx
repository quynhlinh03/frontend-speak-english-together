import {
  Button,
  Flex,
  Text,
  useMantineTheme,
  Container,
  Paper,
  Grid,
  PasswordInput,
} from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { handleGlobalException } from "../../utils/error";
import { Password } from "./type";
import useAuth from "../../hooks/useAuth";

const ChangePassword = () => {
  const theme = useMantineTheme();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const { handleChangePassword, onSubmitChangePassword, isAuthenticated } =
    useAuth();

  const handleCancel = () => {};
  const onSubmit: SubmitHandler<Password> = (data) => {
    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: "Password does not match",
      });
    } else {
      onSubmitChangePassword(data, (error) => {
        handleGlobalException(error, () => {});
      });
    }
  };
  const isPasswordValid = (password: string) => {
    const passwordRegex =
    /^(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
    return passwordRegex.test(password);
  };
  return (
    <Container py={20} maw="100%" className="personal-ctn">
      {isAuthenticated && (
        <form onSubmit={handleSubmit(onSubmit)}>
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
              Password
            </Text>
            <Text color="#868e96" fz={14} fw={400}>
              Update your password.
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
                    Password
                  </Text>
                  <Text color="#868e96" fz={14} fw={400}>
                    Enter your current password to make update
                  </Text>
                </Flex>
              </Grid.Col>
              <Grid.Col span={8}>
                <Paper className="paperColor" withBorder p="md">
                  <Flex direction="column" gap="xl">
                    <Controller
                      name="current_password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <PasswordInput
                          placeholder="Enter your current password"
                          className="customTextInput profile"
                          {...field}
                          withAsterisk
                          label="Current password"
                          radius="md"
                          icon={<IconLock size="0.8rem" />}
                          error={
                            errors.current_password
                              ? errors.current_password.type === "required"
                                ? "Please enter your current password"
                                : errors.current_password.message
                              : false
                          }
                        />
                      )}
                    ></Controller>
                    <Controller
                      name="new_password"
                      control={control}
                      rules={{ required: true, validate: isPasswordValid }}
                      render={({ field }) => (
                        <PasswordInput
                          placeholder="Enter your new password"
                          className="customTextInput profile"
                          {...field}
                          withAsterisk
                          label="New password"
                          radius="md"
                          icon={<IconLock size="0.8rem" />}
                          error={
                            errors.new_password
                              ? errors.new_password.type === "required"
                                ? "Please enter your new password"
                                : errors.new_password.type === "validate"
                                ? "Password requires at least 1 digit, 1 special character, 1 uppercase letter, 1 lowercase letter, and be at least 6 characters long"
                                : errors.new_password.message
                              : false
                          }
                        />
                      )}
                    ></Controller>
                    <Controller
                      name="confirm_password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <PasswordInput
                          placeholder="Confirm your password"
                          className="customTextInput profile"
                          {...field}
                          withAsterisk
                          label="Confirm password"
                          radius="md"
                          icon={<IconLock size="0.8rem" />}
                          error={
                            errors.confirm_password
                              ? errors.confirm_password.type === "required"
                                ? "Please enter your confirm password"
                                : errors.confirm_password.message
                              : false
                          }
                        />
                      )}
                    ></Controller>
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      gap={{ base: "sm", sm: "lg" }}
                      justify={{ sm: "end" }}
                    >
                      <Button
                        loading={handleChangePassword.isLoading}
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
                  </Flex>
                </Paper>
              </Grid.Col>
            </Grid>
          </Paper>
        </form>
      )}
    </Container>
  );
};

export default ChangePassword;
