import { Button, Flex, TextInput } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParagraph } from "../../hooks/useParagraph";
import { notificationShow } from "../Notification";
import { handleGlobalException } from "../../utils/error";
import { Paragraph } from "../Speeches/type";

const NameSpeechForm: React.FC<{
  id?: number;
  name?: string;
  original_text?: string | null | undefined;
  question?: string;
  suggestion_answers?: [string] | undefined;
  audio_url?: string;
  updated_text?: string;
  translated_updated_text?: string;
  overall_comment?: string;
  relevance_to_question?: string;
  suggestion_improvements?: [string];
  level?: string;
  topic_name?: string;
  handleAddSuccess: () => void;
  isEdit?: boolean;
}> = ({
  id,
  name,
  original_text,
  question,
  suggestion_answers,
  audio_url,
  updated_text,
  translated_updated_text,
  overall_comment,
  relevance_to_question,
  suggestion_improvements,
  level,
  topic_name,
  handleAddSuccess,
  isEdit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name || "",
      original_text: original_text,
      question: question,
      suggestion_answers: suggestion_answers,
      audio_url: audio_url,
      updated_text: updated_text,
      translated_updated_text: translated_updated_text,
      overall_comment: overall_comment,
      relevance_to_question: relevance_to_question,
      suggestion_improvements: suggestion_improvements,
      level: level,
      topic_name: topic_name,
    },
  });
  const { handleAddParagraph, onAddParagraph } = useParagraph();
  const { handleUpdateParagraph, onUpdateParagraph } = useParagraph();
  const onSubmit: SubmitHandler<Paragraph> = (data) => {
    const handleSuccess = (message: string) => {
      notificationShow("success", "Success!", message);
    };
    const handleError = (error) => {
      handleGlobalException(error, () => {});
    };
    if (isEdit && id) {
      onUpdateParagraph(
        { id: id, name: data.name },
        () => {
          handleSuccess("Speech name updated successfully!");
          handleAddSuccess();
        },
        handleError
      );
    } else {
      onAddParagraph(
        data,
        () => {
          handleSuccess("Speech saved successfully!");
          handleAddSuccess();
        },
        handleError
      );
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="xl">
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              placeholder="Enter name"
              className="customTextInput customInput"
              {...field}
              withAsterisk
              label="Name"
              radius="md"
              icon={<IconLock size="0.8rem" />}
              error={
                errors.name
                  ? errors.name.type === "required"
                    ? "Please enter name"
                    : errors.name.message
                  : false
              }
            />
          )}
        ></Controller>
        <Button
          loading={
            isEdit
              ? handleUpdateParagraph.isLoading
              : handleAddParagraph.isLoading
          }
          className="customButton"
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
          type="submit"
        >
          SAVE
        </Button>
      </Flex>
    </form>
  );
};

export default NameSpeechForm;
