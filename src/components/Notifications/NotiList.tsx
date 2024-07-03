import {
  ActionIcon,
  Center,
  Flex,
  Indicator,
  Menu,
  Tabs,
  Text,
} from "@mantine/core";
import { IconBell, IconCircleCheck, IconDots } from "@tabler/icons-react";
import { useEffect, useState } from "react";
// import { useNotification } from "../../hooks/useNotification";
import NotiItem from "./NotiItem";
import React from "react";
import { useInView } from "react-intersection-observer";
import { useMutation } from "@tanstack/react-query";
// import axios from "../../settings/axios";
// import { HANDLE_READ_ALL_NOTIFICATION } from "../../constants/apis";

export default function NotiList() {
  // const { ref, inView } = useInView();
  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   refetch,
  //   dataRead,
  //   fetchNextPageRead,
  //   hasNextPageRead,
  //   isFetchingNextPageRead,
  //   refetchRead,
  // } = useNotification({ offset: 0, limit: 5 });
  // const handleSuccessRead = () => {
  //   setReload((prev) => !prev);
  // };
  const [opened, setOpened] = useState(false);
  // const [subOpened, setSubOpened] = useState(false);
  // const [reload, setReload] = useState(false);
  // useEffect(() => {
  //   if (inView && hasNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, hasNextPage, fetchNextPage]);

  // useEffect(() => {
  //   if (inView && hasNextPageRead) {
  //     fetchNextPageRead();
  //   }
  // }, [inView, hasNextPageRead, fetchNextPageRead]);

  // useEffect(() => {
  //   refetch();
  //   refetchRead();
  // }, [reload]);

  // const handleReadAllNoti = useMutation({
  //   mutationKey: ["a-noti"],
  //   mutationFn: () => {
  //     return axios.put(HANDLE_READ_ALL_NOTIFICATION);
  //   },
  //   onSuccess: handleSuccessRead,
  // });
  // const onHandlReadAllNoti = () => {
  //   handleReadAllNoti.mutate();
  // };

  return (
    <>
      <Menu opened={opened} onChange={setOpened} shadow="md">
        <Menu.Target>
          <Indicator
            inline
            // label={dataRead?.pages[0].data.totalItems}
            label="1"
            color="red"
            size={20}
            className="colorCustom"
            // disabled={dataRead?.pages[0].data.totalItems === 0 ? true : false}
          >
            <ActionIcon
              onClick={() => {
                // handleSuccessRead();
              }}
              color="indigo"
              variant="light"
              radius="xl"
              size="lg"
            >
              <IconBell size="1.25rem" />
            </ActionIcon>
          </Indicator>
        </Menu.Target>

        <Menu.Dropdown
          miw={420}
          mah={640}
          style={{ overflow: "auto" }}
          className="menu-dropdown-cart"
        >
          {/* <Flex
            px={10}
            py={15}
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Text fw={600} fz={18}>
              Thông báo
            </Text>
            <Menu opened={subOpened} onChange={setSubOpened} shadow="md">
              <Menu.Target>
                <ActionIcon>
                  <IconDots size="1.25rem" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    onHandlReadAllNoti();
                  }}
                  icon={<IconCircleCheck size={14} />}
                >
                  Đánh dấu tất cả là đã đọc
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
          <Tabs
            radius="xl"
            variant="pills"
            keepMounted={false}
            defaultValue="all"
          >
            <Tabs.List className="tab-noti-read" p={10}>
              <Tabs.Tab value="all">Tất cả</Tabs.Tab>
              <Tabs.Tab value="unread">Chưa đọc</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="all">
              {" "}
              {data?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {!group.data.items.length && (
                    <Center style={{ color: "#4a4f63" }} py={15}>
                      Chưa có thông báo nào
                    </Center>
                  )}
                  {group.data.items.map((element) => (
                    <Menu.Item ref={ref} key={element.id} className="menu-item">
                      <NotiItem
                        handleSuccessRead={handleSuccessRead}
                        id={element.id}
                        createdTime={element.createdTime}
                        url={element.url}
                        title={element.title}
                        description={element.description}
                        read={element.read}
                        image={element.image}
                      />
                    </Menu.Item>
                  ))}
                </React.Fragment>
              ))}
              {isFetchingNextPage && <Center>Đang tải...</Center>}
            </Tabs.Panel>
            <Tabs.Panel value="unread">
              {" "}
              {dataRead?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {!group.data.items.length && (
                    <Center style={{ color: "#4a4f63" }} py={15}>
                      Không có thông báo nào chưa đọc
                    </Center>
                  )}
                  {group.data.items.map((element) => (
                    <Menu.Item ref={ref} key={element.id} className="menu-item">
                      <NotiItem
                        handleSuccessRead={() => {
                          setReload((prev) => !prev);
                        }}
                        id={element.id}
                        createdTime={element.createdTime}
                        url={element.url}
                        title={element.title}
                        description={element.description}
                        read={element.read}
                        image={element.image}
                      />
                    </Menu.Item>
                  ))}
                </React.Fragment>
              ))}
              {isFetchingNextPageRead && <Center>Đang tải...</Center>}
            </Tabs.Panel>
          </Tabs> */}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
