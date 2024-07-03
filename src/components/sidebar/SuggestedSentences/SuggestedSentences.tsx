import React, { useEffect, useState } from "react";
import { Button, Center, Flex, ScrollArea, Text } from "@mantine/core";
import { useSpeakingSenctence } from "../../../hooks/useLive";
import { handleGlobalException } from "../../../utils/error";
import { IconChevronsDown } from "@tabler/icons-react";
import { SentencesItem } from "./SentencesItem";

export const SuggestedSentences: React.FC<{
  id: number;
  panelHeight: number;
}> = ({ panelHeight, id }) => {
  const [refresh, setRefresh] = useState(false);
  const [sentence, setSentence] =
    useState<{ english: string; translated: string }[]>();
  const { fetchSpeakingSenctence } = useSpeakingSenctence(id, refresh);

  useEffect(() => {
    async function fetchDetailLiveRoom() {
      if (id) {
        const data = await fetchSpeakingSenctence.refetch();
        if (data.isSuccess) {
          setSentence(data.data.data.data);
          setRefresh(false);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
    }
    fetchDetailLiveRoom();
  }, [refresh]);
  return (
    <ScrollArea w="100%" h={700}>
      {!sentence && <Center>Loading...</Center>}
      {sentence?.map((item, index) => (
        <div style={{ width: "100%" }} key={index}>
          <SentencesItem
            index={index}
            english={item.english}
            translate={item.translated}
          />
        </div>
      ))}
      {sentence && (
        <Center>
          <Button
            styles={(theme) => ({
              root: {
                ...theme.fn.hover({
                  backgroundColor: "#fff",
                }),
              },
            })}
            variant="subtle"
            onClick={() => {
              setRefresh(true);
            }}
            loading={fetchSpeakingSenctence.isFetching}
            leftIcon={<IconChevronsDown color="#F582A7" size={12} />}
          >
            <Text fz={14} fw={400} color="#F582A7">
              Load more
            </Text>
          </Button>
        </Center>
      )}
    </ScrollArea>
  );
};
