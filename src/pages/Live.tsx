import { Button, Container, Flex, Tabs, Text, Modal } from "@mantine/core";
import LiveList from "../components/LiveList/LiveList";
import { IconCirclePlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import LiveForm from "../components/LiveList/LiveForm";
import { StyledTabs } from "../components/UI/StyledTabs/StyledTabs";
import SelectCustom from "../components/UI/SelectCustom/SelectCustom";
import { useEffect, useState } from "react";
import { useLive } from "../hooks/useLive";
import { handleGlobalException } from "../utils/error";
import { convertData } from "../utils/common";

function Live() {
  const { fetchListTopic } = useLive();
  const [topicId, setTopicId] = useState<number | null>(null);
  const [listTopic, setListTopic] = useState([]);
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
  }, []);

  const handleSuccessSubmitAdd = () => {
    close();
  };
  const handleCloseModal = () => {
    close();
  };
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container size={1200} pt={10} pb={15}>
      <StyledTabs defaultValue="livenow">
        <Tabs.List className="tabCustom">
          <Tabs.Tab value="livenow">Live now</Tabs.Tab>
          {/* <Tabs.Tab value="upcoming">Upcoming</Tabs.Tab> */}
        </Tabs.List>

        <Flex gap="lg" justify="flex-end" align="center">
          <SelectCustom
            props={{
              className: "filterSelect",
              clearable: true,
              data: convertData(listTopic),
              placeholder: "Topic",
              onChange: (selectedValue: number) => {
                setTopicId(selectedValue);
              },
            }}
          />
          <Button
            p="0 0.7rem"
            fw={500}
            fz={14}
            radius="1.5rem"
            leftIcon={<IconCirclePlus m-r="0.5rem" size="1.125rem" />}
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
            onClick={open}
          >
            {" "}
            Create room
          </Button>
        </Flex>
        <Modal
          title="Create a new room"
          opened={opened}
          onClose={close}
          size={640}
          centered
          m={20}
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
        >
          <LiveForm
            onSuccesSubmitAdd={handleSuccessSubmitAdd}
            onCancel={handleCloseModal}
          />
        </Modal>
        <Tabs.Panel value="livenow">
          {/* <Text className="textDark" fw={500} fz={16} pb={10}>
            Host room
          </Text>
          <LiveList list={hostlist} />
          <Divider my="sm" p="10px 0" /> */}

          <Text className="textDark" fw={500} fz={16} pb={10} pt={10}>
            Audience room
          </Text>
          <LiveList topicId={topicId} />
        </Tabs.Panel>
        {/* <Tabs.Panel value="upcoming">
          <Text fw={500} fz={16}>
            Upcoming
          </Text>
        </Tabs.Panel> */}
      </StyledTabs>
    </Container>
  );
}

export default Live;
