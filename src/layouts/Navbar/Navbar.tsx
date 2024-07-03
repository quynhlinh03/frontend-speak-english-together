import { Navbar, UnstyledButton, Group, Avatar, Text } from "@mantine/core";
import MainLink from "./NavigationLink";
import { options } from "./Options";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
// import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import useUserProfile from "../../hooks/useUserProfile";

export default function DashboardNavbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { userProfile } = useUserProfile();
  const dark = colorScheme === "dark";
  const links = options.map((link) => <MainLink {...link} key={link.label} />);
  const navigate = useNavigate();

  return (
    <Navbar
      p="sm"
      hiddenBreakpoint="sm"
      width={{ sm: 220, lg: 250 }}
      className="navbar"
    >
      <UnstyledButton
        onClick={() => {
          navigate(`/personal/${userProfile?.data.id}/profile`);
        }}
      >
        <Group>
          <Avatar
            size={40}
            color="blue"
            src={userProfile?.data.avatar_url}
          ></Avatar>
          <div>
            <Text maw={160} truncate>
              {userProfile?.data.full_name}
            </Text>
            <Text maw={160} truncate size="xs" color="dimmed">
              {userProfile?.data.email}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
      <Navbar.Section grow mt="md">
        {links}
      </Navbar.Section>
      {/* <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "blue"}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
      >
        {dark ? <IconSun size="1.125rem" /> : <IconMoonStars size="1.125rem" />}
      </ActionIcon> */}
    </Navbar>
  );
}
