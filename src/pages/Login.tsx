import { Flex, Paper, Image, Text, Container } from "@mantine/core";
import LoginPasswordForm from "../components/LoginForm/index";
import demo1 from "../assets/images/loginitem1.png";
import demo2 from "../assets/images/loginitem2.png";
import demo3 from "../assets/images/loginitem3.png";

const Login: React.FC = () => {
  return (
    <>
      <Flex
        mih="100vh"
        gap="10rem"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Container ml={0} mr={0}>
          <Flex
            gap="4rem"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
          >
            <Flex
              w="100%"
              gap="xs"
              justify="flex-start"
              align="flex-start"
              direction="column"
              wrap="wrap"
            >
              <Text className="text-custom" fw={300} fz={18}>
                Welcome to
              </Text>
              <Text className="text-custom" fw={600} fz={24}>
                Speak English Together
              </Text>
            </Flex>
            <Flex
              gap="6rem"
              justify="center"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Image maw="16rem" mx="auto" src={demo3} alt="Random image" />
              <Image maw="11rem" mx="auto" src={demo1} alt="Random image" />
            </Flex>
            <Flex>
              <Image maw="16rem" mx="auto" src={demo2} alt="Random image" />
            </Flex>
          </Flex>
        </Container>
        <Paper radius="md" p="3rem" w="34rem" className="login-container">
          <LoginPasswordForm />
        </Paper>
      </Flex>
    </>
  );
};

export default Login;
