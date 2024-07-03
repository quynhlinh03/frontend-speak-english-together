import React from "react";
import TranslateTool from "../Translate/TranslateTool";
import { ScrollArea } from "@mantine/core";

export const TranslatePanel: React.FC<{
  panelHeight: number;
}> = ({ panelHeight }) => {
  return (
    <ScrollArea h={700}>
      <TranslateTool style />
    </ScrollArea>
  );
};
