import {
  Card,
  Image,
  Group,
  Text,
  Grid,
  Flex,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { CollectionProps } from "./type";

export interface ExtendedCollectionProps extends CollectionProps {
  index: number;
}

function CollectionModalItem({
  index,
  image_url,
  name,
  number_of_vocabularies,
}: ExtendedCollectionProps) {
  return (
    <Card
      key={index}
      radius={0}
      bg={index % 2 == 0 ? "#bbe0fd" : "#f5d8da"}
      padding="xs"
    >
      <Card.Section>
        <Image w="100%" height="18rem" src={image_url} alt="Norway" />
      </Card.Section>

      <Group position="apart">
        <Grid px={3} w="100%" justify="space-between" align="center">
          <Grid.Col span="auto">
            <Flex
              gap={4}
              justify="start"
              align="start"
              direction="column"
              wrap="wrap"
            >
              <Text
                lts={2}
                tt="uppercase"
                color="#5d5c5f"
                pt={10}
                fw={550}
                fz={14}
              >
                {name}
              </Text>
              <Text color="#5d5c5f" fw={400} fz={12}>
                {number_of_vocabularies} items
              </Text>
            </Flex>
          </Grid.Col>
          <Grid.Col
            color="#5d5c5f"
            p={0}
            span="content"
            style={{ cursor: "pointer" }}
          >
            <IconArrowRight color="#5d5c5f" size="1.25rem" />
          </Grid.Col>
        </Grid>
      </Group>
    </Card>
  );
}

export default CollectionModalItem;
