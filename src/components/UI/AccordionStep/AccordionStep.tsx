import { Accordion, Center, Text } from "@mantine/core";

interface AccordionStepProps {
  component: JSX.Element;
  title: string;
}

function AccordionStep({ component, title }: AccordionStepProps) {
  return (
    <Accordion
      className="accordionstep"
      variant="filled"
      radius="lg"
      w="100%"
      defaultValue="step"
    >
      <Accordion.Item value="step">
        <Accordion.Control>
          <Center>
            <Text ml="2rem" fz={14} fw={500}>
              {title}
            </Text>
          </Center>
        </Accordion.Control>
        <Accordion.Panel>{component}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionStep;
