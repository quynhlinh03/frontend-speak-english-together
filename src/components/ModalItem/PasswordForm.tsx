import { Button, Flex, PasswordInput } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const PasswordForm: React.FC<{
  setPassValue: (value: string) => void;
}> = ({ setPassValue }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
  });
  const onSubmit: SubmitHandler<{ password: string }> = (data) => {
    setPassValue(data.password);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="xl">
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
        <Button
          className="customButton"
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
          SUBMIT
        </Button>
      </Flex>
    </form>
  );
};

export default PasswordForm;
