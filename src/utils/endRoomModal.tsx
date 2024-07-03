import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export const endRoomModal = (
  title: string,
  content: string | undefined,
  onConfirm: () => void
) => {
  modals.openConfirmModal({
    title: <div style={{ fontWeight: "bold" }}>{title}</div>,
    centered: true,
    children: <Text size="sm">{content}</Text>,
    labels: { confirm: "Leave", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: onConfirm,
    onCancel: onConfirm,
  });
};
