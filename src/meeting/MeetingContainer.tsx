import { useState, useEffect, useRef, createRef } from "react";
import { Constants, useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { BottomBar } from "./components/BottomBar";
import { SidebarConatiner } from "../components/sidebar/SidebarContainer";
import MemorizedParticipantView from "./components/ParticipantView";
import { PresenterView } from "../components/PresenterView";
import { nameTructed, trimSnackBarText } from "../utils/helper";
import WaitingToJoinScreen from "../components/screens/WaitingToJoinScreen";
import ConfirmBox from "../components/ConfirmBox";
import useIsMobile from "../hooks/useIsMobile";
import useIsTab from "../hooks/useIsTab";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { RoomItem } from "../components/LiveList/type";
import { HeaderRoom } from "./components/HeaderRoom";
import { webcamMicModal } from "../utils/webcamMicModal";

interface MeetingContainerProps {
  onMeetingLeave: () => void;
  setIsMeetingLeft: React.Dispatch<React.SetStateAction<boolean>>;
  detailRoom: RoomItem | undefined;
  isMeetingLeft: boolean;
  roomId: number;
  token: string;
}

export function MeetingContainer({
  onMeetingLeave,
  setIsMeetingLeft,
  detailRoom,
  isMeetingLeft,
  roomId,
  token
}: MeetingContainerProps) {
  const { setSelectedMic, setSelectedWebcam, setSelectedSpeaker } =
    useMeetingAppContext();

  const { useRaisedHandParticipants } = useMeetingAppContext();
  const bottomBarHeight = 60;

  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [localParticipantAllowedJoin, setLocalParticipantAllowedJoin] =
    useState<boolean | null>(null);
  const [meetingErrorVisible, setMeetingErrorVisible] = useState(false);
  const [meetingError, setMeetingError] = useState<{
    code: number;
    message: string;
  } | null>(null);

  const mMeetingRef = useRef<any>();
  const containerRef = createRef<HTMLDivElement>();
  const containerHeightRef = useRef<number>();
  const containerWidthRef = useRef<number>();

  useEffect(() => {
    containerHeightRef.current = containerHeight;
    containerWidthRef.current = containerWidth;
  }, [containerHeight, containerWidth]);

  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });

  const sideBarContainerWidth = isXLDesktop
    ? 400
    : isLGDesktop
    ? 360
    : isTab
    ? 320
    : isMobile
    ? 280
    : 240;

  useEffect(() => {
    containerRef.current?.offsetHeight &&
      setContainerHeight(containerRef.current.offsetHeight);
    containerRef.current?.offsetWidth &&
      setContainerWidth(containerRef.current.offsetWidth);

    window.addEventListener("resize", ({ target }) => {
      containerRef.current?.offsetHeight &&
        setContainerHeight(containerRef.current.offsetHeight);
      containerRef.current?.offsetWidth &&
        setContainerWidth(containerRef.current.offsetWidth);
    });
  }, [containerRef]);

  const { participantRaisedHand } = useRaisedHandParticipants();

  const _handleMeetingLeft = () => {
    console.log("_handleMeetingLeft", _handleMeetingLeft)
    setIsMeetingLeft(true);
  };

  const _handleOnRecordingStateChanged = ({ status }: { status: string }) => {
    if (
      status === Constants.recordingEvents.RECORDING_STARTED ||
      status === Constants.recordingEvents.RECORDING_STOPPED
    ) {
      toast(
        `${
          status === Constants.recordingEvents.RECORDING_STARTED
            ? "Meeting recording is started"
            : "Meeting recording is stopped."
        }`,
        {
          position: "bottom-left",
          autoClose: 4000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  function onParticipantJoined(participant: any) {
    participant && participant.setQuality("high");
  }

  function onEntryResponded(participantId: string, name: string) {
    if (mMeetingRef.current?.localParticipant?.id === participantId) {
      if (name === "allowed") {
        setLocalParticipantAllowedJoin(true);
      } else {
        setLocalParticipantAllowedJoin(false);
        setTimeout(() => {
          _handleMeetingLeft();
        }, 3000);
      }
    }
  }

  function onMeetingJoined() {
    console.log("onMeetingJoined");
  }

  function onMeetingLeft() {
    setSelectedMic({ id: null, label: null });
    setSelectedWebcam({ id: null, label: null });
    setSelectedSpeaker({ id: null, label: null });
    onMeetingLeave();
  }

  const _handleOnError = (data: { code: number; message: string }) => {
    const { code, message } = data;
    console.log("meetingErr", code, message);

    const joiningErrCodes = [
      4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010,
    ];

    const isJoiningError = joiningErrCodes.findIndex((c) => c === code) !== -1;
    const isCriticalError = `${code}`.startsWith("500");

    new Audio(
      isCriticalError
        ? `https://static.videosdk.live/prebuilt/notification_critical_err.mp3`
        : `https://static.videosdk.live/prebuilt/notification_err.mp3`
    ).play();

    setMeetingErrorVisible(true);
    setMeetingError({
      code,
      message: isJoiningError ? "Unable to join meeting!" : message,
    });
  };

  const mMeeting = useMeeting({
    onParticipantJoined,
    onEntryResponded,
    onMeetingJoined,
    onMeetingLeft,
    onError: _handleOnError,
    onRecordingStateChanged: _handleOnRecordingStateChanged,
    onMicRequested,
    onWebcamRequested,
  });
  function onMicRequested({ accept, reject, participantId }: any) {
    webcamMicModal(
      "Turn on mic?",
      "The host is requesting to turn on your mic",
      () => {
        accept();
      },
      () => {
        reject();
      }
    );
  }
  function onWebcamRequested({ accept, reject, participantId }: any) {
    webcamMicModal(
      "Turn on webcam?",
      "The host is requesting to turn on your webcam",
      () => {
        accept();
      },
      () => {
        reject();
      }
    );
  }
  const isPresenting = mMeeting.presenterId ? true : false;

  useEffect(() => {
    mMeetingRef.current = mMeeting;
  }, [mMeeting]);

  usePubSub("RAISE_HAND", {
    onMessageReceived: (data: { senderId: string; senderName: string }) => {
      const localParticipantId = mMeeting?.localParticipant?.id;

      const { senderId, senderName } = data;

      const isLocal = senderId === localParticipantId;

      new Audio(
        `https://static.videosdk.live/prebuilt/notification.mp3`
      ).play();

      toast(`${isLocal ? "You" : nameTructed(senderName, 15)} raised hand 🖐🏼`, {
        position: "bottom-left",
        autoClose: 4000,
        hideProgressBar: true,
        closeButton: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      participantRaisedHand(senderId);
    },
  });

  usePubSub("CHAT", {
    onMessageReceived: (data: {
      senderId: string;
      senderName: string;
      message: string;
    }) => {
      const localParticipantId = mMeeting?.localParticipant?.id;

      const { senderId, senderName, message } = data;

      const isLocal = senderId === localParticipantId;

      if (!isLocal) {
        new Audio(
          `https://static.videosdk.live/prebuilt/notification.mp3`
        ).play();

        toast(
          `${trimSnackBarText(
            `${nameTructed(senderName, 15)} says: ${message}`
          )}`,
          {
            position: "bottom-left",
            autoClose: 4000,
            hideProgressBar: true,
            closeButton: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    },
  });

  return (
    <div className="fixed inset-0">
      <div
        style={{ backgroundColor: "#FEFAF6" }}
        ref={containerRef}
        className="h-full flex flex-col"
      >
        {typeof localParticipantAllowedJoin === "boolean" ? (
          localParticipantAllowedJoin ? (
            <>
              <HeaderRoom
                detailRoom={detailRoom}
                bottomBarHeight={bottomBarHeight}
              />

              <div
                style={{ backgroundColor: "rgba(255, 239, 224, 0.1)" }}
                className={` flex flex-1 flex-row`}
              >
                <div className={`flex flex-1 `}>
                  {isPresenting ? (
                    <PresenterView
                      height={containerHeight - 2 * bottomBarHeight}
                    />
                  ) : null}
                  {isPresenting && isMobile ? null : (
                    <MemorizedParticipantView isPresenting={isPresenting} />
                  )}
                </div>

                <SidebarConatiner
                  detailRoom={detailRoom}
                  height={containerHeight - 2 * bottomBarHeight}
                  sideBarContainerWidth={sideBarContainerWidth}
                />
              </div>

              <BottomBar
                detailRoom={detailRoom}
                bottomBarHeight={bottomBarHeight}
                setIsMeetingLeft={setIsMeetingLeft}
                isMeetingLeft={isMeetingLeft}
                token={token}
                roomId={roomId}
              />
            </>
          ) : (
            <></>
          )
        ) : (
          !mMeeting.isMeetingJoined && <WaitingToJoinScreen />
        )}
        <ConfirmBox
          open={meetingErrorVisible}
          successText="OKAY"
          onSuccess={() => {
            setMeetingErrorVisible(false);
          }}
          title={`Error Code: ${meetingError?.code}`}
          subTitle={meetingError?.message || ""}
        />
      </div>
    </div>
  );
}
