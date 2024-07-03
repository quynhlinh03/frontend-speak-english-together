import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export const deleteModal = (
  title: string,
  content: string | undefined,
  confirm?: string,
  onConfirm: () => void
) => {
  modals.openConfirmModal({
    title: <div style={{ fontWeight: "bold" }}>{title}</div>,
    centered: true,
    children: <Text size="sm">{content}</Text>,
    labels: { confirm: confirm || "Leave", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: onConfirm,
  });
};
