import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import React, { useMemo } from "react";
import MicOffIcon from "../../icons/ParticipantTabPanel/MicOffIcon";
import MicOnIcon from "../../icons/ParticipantTabPanel/MicOnIcon";
import RaiseHand from "../../icons/ParticipantTabPanel/RaiseHand";
import VideoCamOffIcon from "../../icons/ParticipantTabPanel/VideoCamOffIcon";
import VideoCamOnIcon from "../../icons/ParticipantTabPanel/VideoCamOnIcon";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { nameTructed } from "../../utils/helper";
import { deleteModal } from "../../utils/deleteModal";
import useAuth from "../../hooks/useAuth";
import { IconSquareRoundedMinus } from "@tabler/icons-react";
import { RoomItem } from "../LiveList/type";
import { Avatar } from "@mantine/core";
import { useLive } from "../../hooks/useLive";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";

interface ParticipantListItemProps {
  participantId: string;
  raisedHand: boolean;
  isHostRoom: boolean;
  room_id: number;
  ava_url: string;
}

const ParticipantListItem: React.FC<ParticipantListItemProps> = ({
  participantId,
  raisedHand,
  isHostRoom,
  room_id,
  ava_url,
}) => {
  function onStreamEnabled(stream) {
  }
  function onStreamDisabled(stream) {
  }

  const {
    micOn,
    webcamOn,
    displayName,
    isLocal,
    enableWebcam,
    disableWebcam,
    enableMic,
    disableMic,
    remove,
  } = useParticipant(participantId, {
    onStreamEnabled,
    onStreamDisabled,
  });

  const { onSubmitRemoveMember } = useLive();

  const { userProfile } = useAuth();

  const handleRemoveParticipants = () => {
    deleteModal(
      "Remove participant",
      "Are you sure you want to remove this participant from the live room?",
      "Ok",
      () => {
        remove();
        onSubmitRemoveMember(
          { room_id: room_id, user_id: +participantId },
          () => {
            notificationShow("success", "Success!", "Participant removed successfully");
          },
          (error) => {
            handleGlobalException(error, () => {});
          }
        );
      }
    );
  };

  const handleEnableWebcam = () => {
    if (isHostRoom && userProfile?.id != +participantId) {
      // This will emit an event called "onWebcamRequested" to that particular participant
      deleteModal(
        "Enable webcam",
        "Are you sure you want to request this person to turn on their webcam?",
        "Ok",
        () => {
          enableWebcam();
        }
      );
    }
  };

  const handleEnableMic = () => {
    if (isHostRoom && userProfile?.id != +participantId) {
      // This will emit an event called "onMicRequested" to that particular participant
      deleteModal(
        "Enable mic",
        "Are you sure you want to request this person to turn on their mic?",
        "Ok",
        () => {
          enableMic();
        }
      );
    }
  };

  const handleDisableWebcam = () => {
    if (isHostRoom && userProfile?.id != +participantId) {
      // This will disable the webcam of that particular participant
      deleteModal(
        "Disable webcam",
        "Are you sure you want to turn off this person's webcam?",
        "Ok",
        () => {
          disableWebcam();
        }
      );
    }
  };

  const handleDisableMic = () => {
    if (isHostRoom && userProfile?.id != +participantId) {
      // This will disable the mic of that particular participant
      deleteModal(
        "Disable mic",
        "Are you sure you want to turn off this person's mic?",
        "Ok",
        () => {
          disableMic();
        }
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: "rgb(254, 250, 246)" }}
      className="mt-2 m-2 p-2 rounded-2xl mb-0"
    >
      <div className="flex rounded-2xl flex-1 items-center justify-center relative">
        {/* <div
          style={{
            color: "#212032",
            backgroundColor: "#757575",
            borderRadius: "100%",
          }}
          className="h-10 w-10 text-sm mt-0 rounded overflow-hidden flex relative items-center justify-center"
        >
          {displayName?.charAt(0).toUpperCase()}
        </div> */}
        <Avatar radius="50%" size={40} src={ava_url}></Avatar>
        <div className="ml-2 mr-1 flex flex-1">
          <p className="text-sm text-black overflow-hidden whitespace-pre-wrap overflow-ellipsis">
            {isLocal
              ? `${nameTructed(displayName, 15)} (you)`
              : nameTructed(displayName, 15)}
          </p>
        </div>
        {raisedHand && (
          <div className="flex items-center justify-center m-1 p-1">
            <RaiseHand fillcolor={"rgb(19, 32, 67)"} />
          </div>
        )}
        <div className="m-1 p-1">
          {micOn ? (
            <button onClick={handleDisableMic}>
              <MicOnIcon />
            </button>
          ) : (
            <button onClick={handleEnableMic}>
              <MicOffIcon />
            </button>
          )}
        </div>
        <div className="m-1 p-1">
          {webcamOn ? (
            <button onClick={handleDisableWebcam}>
              <VideoCamOnIcon />
            </button>
          ) : (
            <button onClick={handleEnableWebcam}>
              <VideoCamOffIcon />
            </button>
          )}
        </div>
        {isHostRoom && !isLocal && (
          <div className="m-1 p-1">
            <button onClick={handleRemoveParticipants}>
              <IconSquareRoundedMinus color="rgb(158, 158, 167)" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ParticipantPanel: React.FC<{
  panelHeight: number;
  isHostRoom: boolean;
  detailRoom: RoomItem;
}> = ({ panelHeight, isHostRoom, detailRoom }) => {
  const { raisedHandsParticipants } = useMeetingAppContext();
  const mMeeting = useMeeting();
  const participants = mMeeting.participants;

  const sortedRaisedHandsParticipants = useMemo(() => {
    const participantIds = [...participants.keys()];

    const notRaised = participantIds.filter(
      (pID) =>
        raisedHandsParticipants.findIndex(
          ({ participantId: rPID }) => rPID === pID
        ) === -1
    );

    const raisedSorted = raisedHandsParticipants.sort((a, b) => {
      if (a.raisedHandOn > b.raisedHandOn) {
        return -1;
      }
      if (a.raisedHandOn < b.raisedHandOn) {
        return 1;
      }
      return 0;
    });

    const combined = [
      ...raisedSorted.map(({ participantId: p }) => ({
        raisedHand: true,
        participantId: p,
      })),
      ...notRaised.map((p) => ({ raisedHand: false, participantId: p })),
    ];

    return combined;
  }, [raisedHandsParticipants, participants]);

  const filterParticipants = (sortedRaisedHandsParticipants) =>
    sortedRaisedHandsParticipants;

  const part = useMemo(
    () => filterParticipants(sortedRaisedHandsParticipants),

    [sortedRaisedHandsParticipants]
  );
  const avatarMapping: {
    [key: string]: string;
  } = {};
  detailRoom.room_members.forEach((member) => {
    avatarMapping[member.user_id] = member.avatar_url;
  });
  return (
    <div
      className={`flex w-full flex-col overflow-y-auto `}
      style={{ height: panelHeight, backgroundColor: "#FEFAF6" }}
    >
      <div
        className="flex flex-col flex-1"
        style={{ height: panelHeight - 100 }}
      >
        {[...participants.keys()].map((participantId, index) => {
          const { raisedHand, participantId: peerId } = part[index];
          const ava_url = avatarMapping[participantId];
          return (
            <ParticipantListItem
              key={participantId}
              participantId={peerId}
              raisedHand={raisedHand}
              isHostRoom={isHostRoom}
              room_id={detailRoom.id}
              ava_url={ava_url}
            />
          );
        })}
      </div>
    </div>
  );
};
