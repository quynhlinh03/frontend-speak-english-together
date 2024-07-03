import {
  ActionIcon,
  Center,
  Container,
  Flex,
  Grid,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { IconX, IconBoxMultiple, IconVolume } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { FlashcardArray } from "react-quizlet-flashcard";
import { useNavigate, useParams } from "react-router-dom";
import { useListVocabulary } from "../hooks/useVocabulary";
import { handleGlobalException } from "../utils/error";
import { useCollectionDetail } from "../hooks/useCollection";

function FlashcardVacubulary() {
  const { collectionId } = useParams<{ collectionId?: string }>();
  const [currentCard, setCurrentCard] = useState(1);
  const [cards, setCards] = useState([]);
  const [value, SetValue] = useState<number>();
  const [search, setSearch] = useState({});
  const navigate = useNavigate();
  const [collectionName, setCollectionName] = useState("");
  const { fetchDetailCollection } = useCollectionDetail(+collectionId);
  const { fetchAllVocabulary } = useListVocabulary(search);

  useEffect(() => {
    if (collectionId) {
      setSearch({ collectionId: +collectionId });
    }
  }, [collectionId]);
  useEffect(() => {
    SetValue((currentCard / cards.length) * 100);
  }, [currentCard, cards]);
  useEffect(() => {
    async function fetchAllVocabularyData() {
      const data = await fetchAllVocabulary.refetch();
      if (data.isSuccess) {
        setCards(
          data.data.data.data.map((item, index) => ({
            id: index,
            frontHTML: (
              <Flex
                px="lg"
                h="100%"
                w="100%"
                justify="center"
                align="center"
                direction="column"
                gap="lg"
              >
                <Text color="#212529" fz={18} ta="center">
                  {item.word}
                </Text>
                <ActionIcon
                  onClick={(event) => {
                    event.stopPropagation();
                    const audio = new Audio(item.word_audio_url);
                    audio.play();
                  }}
                  className="actionicon"
                  radius="xl"
                  variant="filled"
                >
                  <IconVolume size="1.1rem" />
                </ActionIcon>
              </Flex>
            ),
            backHTML: (
              <Center px="lg" w="100%" h="100%">
                <Text color="#212529" fz={18} ta="center">
                  {item.meaning}
                </Text>
              </Center>
            ),
          }))
        );
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchAllVocabularyData();
    if (collectionId) {
      async function fetchCollectionDetailData() {
        const data = await fetchDetailCollection.refetch();

        if (data.isSuccess) {
          setCollectionName(data.data.data.name);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchCollectionDetailData();
    }
  }, [search, collectionId]);

  return (
    <Stack h="100%">
      <Container mah="content" w="100%" bg="#fff" p="0" m="0" maw="100%">
        <Grid p="1.5rem" w="100%" justify="space-between" align="center">
          <Grid.Col span="auto">
            <Flex justify="flex-start" align="center" gap="xs" direction="row">
              <IconBoxMultiple size="1.125rem" />
              <Text fw={450}>Flashcards</Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span="content">
            <Flex justify="center" align="center" gap={8} direction="column">
              <Text fw={450}>
                {currentCard} / {cards.length}
              </Text>
              <Text fw={450}>
                {!collectionId ? "All saved vocabulary" : collectionName}
              </Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span="auto">
            <Flex justify="flex-end" align="center" gap="xs" direction="row">
              <ActionIcon
                onClick={() => {
                  if (collectionId) {
                    navigate(`/handbook/collections/${collectionId}`);
                  } else {
                    navigate(`/handbook/all`);
                  }
                }}
              >
                <IconX size="1.125rem" />
              </ActionIcon>
            </Flex>
          </Grid.Col>
        </Grid>
        <Progress color="#1F4172" radius="xs" size="2px" value={value} />
      </Container>

      <Flex
        pb="4rem"
        m="auto"
        className="flashcardArray"
        justify="center"
        align="center"
      >
        <FlashcardArray
          cards={cards}
          controls={true}
          showCount={false}
          onCardChange={(id, index) => {
            setCurrentCard(index);
          }}
        />
      </Flex>
    </Stack>
  );
}

export default FlashcardVacubulary;
