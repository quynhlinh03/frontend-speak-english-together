import {
  Avatar,
  Image,
  Menu,
  Header,
  Flex,
  Text,
  ActionIcon,
} from "@mantine/core";
import {
  IconLogout,
  IconPassword,
  IconUser,
  IconChevronDown,
} from "@tabler/icons-react";
import useAuth from "../hooks/useAuth";
import Search from "../components/Search/Search";
import NotiList from "../components/Notifications/NotiList";
import MessList from "../components/Messager/MessList";
import { useState } from "react";
import ConfirmLogoutModal from "../components/Logout/ConfirmLogoutModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUserProfile from "../hooks/useUserProfile";
import { CometChat } from "@cometchat/chat-sdk-javascript";
// import NotiList from "../components/Notifications/NotiList";

export default function HomeHeader() {
  const { userProfile } = useUserProfile();
  const { logout } = useAuth();
  const [openConfirmLogout, setOpenConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const [queryParameters] = useSearchParams();
  const onSearch = (searchValue: string) => {
    if (searchValue) {
      queryParameters.set("keyword", searchValue);
      navigate(`/search/?${decodeURIComponent(queryParameters.toString())}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <Header
      className="header"
      height={{ base: 70, md: 70 }}
      p="0.55rem 0.75rem"
    >
      <Flex justify={"space-between"} align={"center"}>
        <Flex
          gap="xs"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
          onClick={() => {
            navigate("/");
          }}
        >
          <ActionIcon w={100}>
            <Image
              maw={100}
              radius="md"
              src="https://i.imgur.com/MpWOclu.png"
              alt="ESpeak Logo"
            />
          </ActionIcon>
        </Flex>
        <Flex>
          <Search
            onSearch={onSearch}
            keyword={queryParameters.get("keyword")}
          />
        </Flex>
        <Flex
          gap="xl"
          justify="flex-end"
          align="center"
          direction="row"
          wrap="nowrap"
        >
          {/* <MessList />
          <NotiList /> */}
          <Menu shadow="md" radius="md" width={200}>
            <Menu.Target>
              <ActionIcon
                variant="filled"
                style={{
                  height: "3rem",
                  padding: "0.3rem",
                  borderRadius: "20rem",
                  marginLeft: "0.2rem",
                  background: "#fff",
                  color: "#555",
                  width: "fit-content",
                }}
              >
                <Flex
                  pl="0.2rem"
                  justify="center"
                  align="center"
                  direction="row"
                  gap="xs"
                >
                  <Text style={{ letterSpacing: "0.001px" }} fz={15} fw={420}>
                    {userProfile?.data.full_name}
                  </Text>
                  <Avatar
                    size={36}
                    radius="xl"
                    src={userProfile?.data.avatar_url}
                    alt="avatar"
                    ml="0.2rem"
                  />
                </Flex>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                p="1rem"
                icon={<IconUser size={14} />}
                onClick={() => {
                  navigate(`/personal/${userProfile?.data.id}/profile`);
                }}
              >
                <Text maw={130} truncate>
                  {userProfile?.data.full_name}
                </Text>
              </Menu.Item>
              <Menu.Item
                p="1rem"
                icon={<IconPassword size={14} />}
                onClick={() => {
                  navigate(`/personal/${userProfile?.data.id}/change_password`);
                }}
              >
                Change password
              </Menu.Item>
              <Menu.Item
                p="1rem"
                icon={<IconLogout size={14} />}
                onClick={() => {
                  setOpenConfirmLogout(true);
                }}
              >
                Log out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Flex>
      {openConfirmLogout && (
        <ConfirmLogoutModal
          onConfirm={() => {
            CometChat.logout().then(
              (loggedOut: Object) => {
                console.log("Logout completed successfully");
                logout();
                setOpenConfirmLogout(false);
              },
              (error: CometChat.CometChatException) => {
                console.log("Logout failed with exception:", { error });
                localStorage.clear();
                window.location.reload();
              }
            );
          }}
          onClose={() => {
            setOpenConfirmLogout(false);
          }}
        />
      )}
    </Header>
  );
}
