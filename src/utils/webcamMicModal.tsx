import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export const webcamMicModal = (
  title: string,
  content: string | undefined,
  onConfirm: () => void,
  onCancel: () => void
) => {
  modals.openConfirmModal({
    title: <div style={{ fontWeight: "bold" }}>{title}</div>,
    centered: true,
    children: <Text size="sm">{content}</Text>,
    labels: { confirm: "Turn on", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: onConfirm,
    onCancel: onCancel,
  });
};
