import useIsTab from "../../hooks/useIsTab";
import useIsMobile from "../../hooks/useIsMobile";
import { RoomItem } from "../../components/LiveList/type";
import {
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Flex,
  Image,
  Text,
} from "@mantine/core";
import {
  IconLockSquareRounded,
  IconBrandOpenSource,
  IconPointFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { useUserDetail } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { DetailUser } from "../../components/Buddy/type";
import { handleGlobalException } from "../../utils/error";

interface HeaderRoomProps {
  bottomBarHeight: string;
  detailRoom: RoomItem;
}

export const HeaderRoom: React.FC<HeaderRoomProps> = ({
  bottomBarHeight,
  detailRoom,
}) => {
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const { fetchDetailUser } = useUserDetail(detailRoom.host_user_id);
  const [user, setUser] = useState<DetailUser>();

  useEffect(() => {
    async function fetchUser() {
      const data = await fetchDetailUser.refetch();
      if (data.isSuccess) {
        setUser(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchUser();
  }, [detailRoom.host_user_id]);

  return isMobile || isTab ? (
    <div
      className="flex items-center justify-center"
      style={{ height: bottomBarHeight }}
    ></div>
  ) : (
    <div
      style={{
        height: bottomBarHeight,
        borderBottom: "0.0625rem solid #ced4da",
      }}
      className="md:flex lg:px-2 xl:px-6 pb-2 px-2 hidden"
    >
      <Flex
        w="100%"
        h={bottomBarHeight}
        justify={"space-between"}
        align={"center"}
      >
        <Flex
          gap="lg"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <ActionIcon w={100}>
            <Image
              maw={100}
              radius="md"
              src="https://i.imgur.com/MpWOclu.png"
              alt="ESpeak Logo"
            />
          </ActionIcon>
          <Divider orientation="vertical" />
          <Flex
            gap={4}
            justify="flex-start"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <Flex
              gap="xs"
              justify="flex-start"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Text fz={18} fw={600}>
                {detailRoom.name}
              </Text>
              {detailRoom.description && (
                <>
                  <Divider orientation="vertical" />
                  <Flex
                    gap={5}
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="wrap"
                  >
                    <Avatar
                      w={18}
                      h={18}
                      miw={18}
                      radius="100%"
                      src={user?.avatar_url || null}
                      alt="Random image"
                    />
                    <Text color="#212529" fz={14} fw={400}>
                      {user?.full_name}
                    </Text>
                  </Flex>
                </>
              )}
            </Flex>
            {detailRoom.description ? (
              <Text color="#868e96" fz={14} fw={400}>
                {detailRoom.description}
              </Text>
            ) : (
              <Flex
                gap={8}
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Avatar
                  w={18}
                  h={18}
                  miw={18}
                  mx="auto"
                  radius="100%"
                  src={user?.avatar_url || null}
                  alt="Random image"
                />
                <Text color="#212529" fz={14} fw={400}>
                  {user?.full_name}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex
          className="liveItemCustom"
          gap="lg"
          justify="flex-end"
          align="center"
          direction="row"
          wrap="nowrap"
        >
          <Flex
            gap={8}
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <IconUserFilled size="0.9rem" />
            <Text fz={12}>
              {String(detailRoom.current_member_amount).padStart(2, "0")} /{" "}
              {String(detailRoom.max_member_amount).padStart(2, "0")}
            </Text>
          </Flex>
          <Avatar.Group spacing="xs">
            {detailRoom.room_members.slice(0, 4).map((item, index) => {
              return (
                <Avatar
                  key={index}
                  size={30}
                  src={item.avatar_url || null}
                  radius="xl"
                />
              );
            })}
            {detailRoom.room_members.length > 4 && (
              <Avatar size={30} radius="xl">
                <Text fz="13px" fw={450}>
                  +{detailRoom.room_members.length - 4}
                </Text>
              </Avatar>
            )}
          </Avatar.Group>

          <Flex
            gap={0}
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <IconPointFilled
              color={
                detailRoom.level === "BEGINNER"
                  ? "#F1B4BB"
                  : detailRoom.level === "INTERMEDIATE"
                  ? "#9CAFAA"
                  : "#EFBC9B"
              }
              size="1.5rem"
            />
            <Text fw={400} fz={13}>
              {detailRoom.level === "BEGINNER"
                ? "Beginner"
                : detailRoom.level === "INTERMEDIATE"
                ? "Intermediate"
                : "Advanced"}
            </Text>
          </Flex>
          <Flex
            gap={8}
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Image
              width={21}
              height={21}
              mx="auto"
              radius="100%"
              src={detailRoom.topic.image}
              alt="Random image"
            />
            <Text>{detailRoom.topic.name}</Text>
          </Flex>
          {detailRoom.is_private ? (
            <Badge p="10px" className="private">
              <Flex gap="sm" justify="center" align="center" direction="row">
                <IconLockSquareRounded size="1.125rem" />
                <Text>Private</Text>
              </Flex>
            </Badge>
          ) : (
            <Badge p="10px">
              <Flex gap="sm" justify="center" align="center" direction="row">
                <IconBrandOpenSource size="1.125rem" />
                <Text>Public</Text>
              </Flex>
            </Badge>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
