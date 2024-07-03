import { Container, Flex, Image, Text } from "@mantine/core";
import { IconPointFilled } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
// import axios from "../../settings/axios";
// import { HANDLE_READ_NOTIFICATION } from "../../constants/apis";
// import { convertDateTime } from "../../utils/helper";

interface NotiItemProps {
  id: number;
  createdTime: string;
  url: string;
  title: string;
  description: string;
  read: boolean;
  image: string;
  employeeId?: number;
  handleSuccessRead: () => void;
}

function NotiItem({
  id,
  createdTime,
  url,
  title,
  description,
  read,
  image,
  handleSuccessRead,
}: NotiItemProps) {
  // const handleReadNoti = useMutation({
  //   mutationKey: ["a-noti"],
  //   mutationFn: (id: number) => {
  //     return axios.put(HANDLE_READ_NOTIFICATION(id));
  //   },
  //   onSuccess: handleSuccessRead,
  // });
  // const onHandlReadNoti = (id: number) => {
  //   handleReadNoti.mutate(id);
  // };
  return (
    <Container
      p={5}
      onClick={() => {
        window.open(`${url}`, "_self");
        // onHandlReadNoti(id);
      }}
    >
      <Flex gap="xs" align="center" direction="row" wrap="wrap">
        <Image m={10} width={50} height={50} src={image} />
        <Flex
          maw="17.5rem"
          justify="center"
          align="flex-start"
          direction="column"
          wrap="wrap"
        >
          <Text fw={600}>{title}</Text>
          <Text>{description}</Text>
          {/* <Text style={{ color: "rgb(0, 67, 156)" }}>{convertDateTime(createdTime)}</Text> */}
        </Flex>
        {read == false && (
          <IconPointFilled style={{ color: "rgb(0, 67, 156)" }} />
        )}
      </Flex>
    </Container>
  );
}

export default NotiItem;
