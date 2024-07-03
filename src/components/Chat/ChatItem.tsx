import {
  Paper,
  Grid,
  Avatar,
  Flex,
  Text,
  Indicator,
  Badge,
} from "@mantine/core";
interface ChatItemProps {
  avatar_url?: string;
  name?: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  status?: string;
  isYou?: boolean;
}

export default function ChatItem({
  avatar_url,
  name,
  lastMessage,
  time,
  unread,
  status,
  isYou,
}: ChatItemProps) {
  return (
    <Paper
      style={{ borderBottom: "1px solid #0000000d", width: "18.5rem" }}
      w="100%"
      py="1rem"
    >
      <Grid w="100%" align="center" justify="space-between">
        <Grid.Col span="content">
          {status != "offline" ? (
            <Indicator
              inline
              size={12}
              offset={6}
              position="bottom-end"
              color="green"
              withBorder
            >
              <Avatar radius="100%" size={35} src={avatar_url} />
            </Indicator>
          ) : (
            <Avatar radius="100%" size={35} src={avatar_url} />
          )}
        </Grid.Col>
        <Grid.Col span="auto">
          <Flex
            gap={3}
            align="flex-start"
            justify="flex-start"
            direction="column"
          >
            <Text
              style={{ display: "initial", maxWidth: "10rem" }}
              lineClamp={1}
              fz={15}
            >
              {name}
            </Text>
            <Text
              style={{ display: "initial", maxWidth: "10rem" }}
              color="#555"
              lineClamp={1}
            >
              {isYou ? "You: " : ""}
              {lastMessage}
            </Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span="content">
          <Flex gap={5} align="flex-end" justify="flex-end" direction="column">
            <div>
              {time && (
                <Text color="#0006" fz={12}>
                  {time}
                </Text>
              )}
            </div>
            {unread && unread != 0 ? (
              <Badge fw={600} p="0.3rem" color="red" size="xs" variant="filled">
                {unread}
              </Badge>
            ) : (
              <div></div>
            )}
          </Flex>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
