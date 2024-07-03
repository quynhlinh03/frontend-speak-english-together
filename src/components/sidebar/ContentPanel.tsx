import React from "react";
import { RoomItem } from "../LiveList/type";
import TopicContent from "../ModalItem/TopicContent";

export const ContentPanel: React.FC<{
  panelHeight: number;
  detailRoom: RoomItem | undefined;
}> = ({ panelHeight, detailRoom }) => {

  return (
    <div>
      {detailRoom?.topic.content && (
        <TopicContent
          topic_url={detailRoom.topic.image}
          topic={detailRoom.topic.name}
          style
          content={detailRoom?.topic.content}
        />
      )}
    </div>
  );
};
