import { useParams } from "react-router-dom";
import axios from "../settings/axios";
import { useQuery } from "@tanstack/react-query";
import { Flex, Text, Anchor, Image, Center } from "@mantine/core";
import successImg from "../assets/images/success.png";
import failImg from "../assets/images/fail.png";

function Success() {
  return (
    <Center m={100}>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Image width={80} height={80} src={successImg} />
        <Text fw={600} fz={20}>
          Confirm successful registration!
        </Text>
        <Text fw={400} fz={16}>
          You have successfully registered an account on the Speak English
          Together website. Go to the{" "}
          <Anchor href="https://speaking-english-together.live/" target="_blank">
            website
          </Anchor>{" "}
          to start using it.
        </Text>
      </Flex>
    </Center>
  );
}

function Fail({ error }) {

  return (
    <Center m={100}>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Image width={80} height={80} src={failImg} />
        <Text fw={600} fz={20}>
          An error occurred!
        </Text>
        <Text fw={400} fz={16}>
          {error && error.response.data.message}
        </Text>
      </Flex>
    </Center>
  );
}
export default function VerifyAccount() {
  const params = useParams();
  const { isLoading, data, error } = useQuery({
    queryKey: ["get-detail-branch"],
    queryFn: () => {
      return axios.get(`/auth/verify?token=${params.token}`);
    },
  });
  if (isLoading) return "Loading...";
  return data ? (
    <h1>
      <Success />
    </h1>
  ) : (
    <Fail error={error} />
  );
}
