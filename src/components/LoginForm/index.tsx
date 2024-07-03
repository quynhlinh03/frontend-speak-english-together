import { Flex, Text, useMantineTheme } from "@mantine/core";
import LoginForm from "./LoginForm";
import { useState } from "react";
import RegisterForm from "./RegisterForm";

const AuthForm: React.FC = () => {
  const theme = useMantineTheme();

  const [register, setRegister] = useState(false);

  return (
    <>
      <div>
        {register ? (
          <RegisterForm
            onMethodChange={() => {
              setRegister(false);
            }}
          />
        ) : (
          <LoginForm />
        )}

        {!register ? (
          <Flex
            pt={50}
            justify="center"
            align="center"
            wrap="wrap"
            gap="0.2rem"
          >
            <Text className="option" color={theme.colors.navyBlur[0]}>
              Don't have an account ?
            </Text>
            <p
              onClick={() => {
                setRegister(true);
              }}
            >
              <Text
                className="pHover"
                color={theme.colors.navyBlur[0]}
                fw={600}
                onClick={() => setRegister(true)}
              >
                Sign up
              </Text>
            </p>
          </Flex>
        ) : (
          <Flex
            pt={50}
            justify="center"
            align="center"
            wrap="wrap"
            gap="0.2rem"
          >
            <Text className="option" color={theme.colors.navyBlur[0]}>
              Have an account ?
            </Text>
            <p
              className="pHover"
              onClick={() => {
                setRegister(false);
              }}
            >
              <Text color={theme.colors.navyBlur[0]} fw={600}>
                Sign in
              </Text>
            </p>
          </Flex>
        )}
      </div>
    </>
  );
};

export default AuthForm;
