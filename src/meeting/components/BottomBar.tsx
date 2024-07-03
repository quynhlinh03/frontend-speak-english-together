import {
  Constants,
  useMeeting,
  usePubSub,
  useMediaDevice,
} from "@videosdk.live/react-sdk";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardIcon,
  CheckIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import recordingBlink from "../../static/animations/recording-blink.json";
import useIsRecording from "../../hooks/useIsRecording";
import RecordingIcon from "../../icons/Bottombar/RecordingIcon";
import MicOnIcon from "../../icons/Bottombar/MicOnIcon";
import MicOffIcon from "../../icons/Bottombar/MicOffIcon";
import WebcamOnIcon from "../../icons/Bottombar/WebcamOnIcon";
import WebcamOffIcon from "../../icons/Bottombar/WebcamOffIcon";
import ScreenShareIcon from "../../icons/Bottombar/ScreenShareIcon";
import ChatIcon from "../../icons/Bottombar/ChatIcon";
import ParticipantsIcon from "../../icons/Bottombar/ParticipantsIcon";
import EndIcon from "../../icons/Bottombar/EndIcon";
import RaiseHandIcon from "../../icons/Bottombar/RaiseHandIcon";
import PipIcon from "../../icons/Bottombar/PipIcon";
import { OutlinedButton } from "../../components/buttons/OutlinedButton";
import useIsTab from "../../hooks/useIsTab";
import useIsMobile from "../../hooks/useIsMobile";
import MobileIconButton from "../../components/buttons/MobileIconButton";
import { sideBarModes } from "../../utils/common";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { createPopper } from "@popperjs/core";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import useMediaStream from "../../hooks/useMediaStream";
import { deleteModal } from "../../utils/deleteModal";
import useUserProfile from "../../hooks/useUserProfile";
import { endRoomModal } from "../../utils/endRoomModal";
import { useNavigate } from "react-router-dom";
import ShowContentIcon from "../../icons/Bottombar/ShowContentIcon";
import { RoomItem } from "../../components/LiveList/type";
import SuggestedIcon from "../../icons/Bottombar/SuggestedIcon";
import useAuth from "../../hooks/useAuth";
import { webcamMicModal } from "../../utils/webcamMicModal";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../../components/Notification";
import { useLive } from "../../hooks/useLive";

interface PipBTNProps {
  isMobile: boolean;
  isTab: boolean;
}

const PipBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
  const { pipMode, setPipMode } = useMeetingAppContext();

  const getRowCount = (length: number) => {
    return length > 2 ? 2 : length > 0 ? 1 : 0;
  };
  const getColCount = (length: number) => {
    return length < 2 ? 1 : length < 5 ? 2 : 3;
  };

  const pipWindowRef = useRef(null);
  const togglePipMode = async () => {
    //Check if PIP Window is active or not
    //If active we will turn it off
    if (pipWindowRef.current) {
      await document.exitPictureInPicture();
      pipWindowRef.current = null;
      return;
    }

    //Check if browser supports PIP mode else show a message to user
    if ("pictureInPictureEnabled" in document) {
      //Creating a Canvas which will render our PIP Stream
      const source = document.createElement("canvas");
      const ctx = source.getContext("2d");

      //Create a Video tag which we will popout for PIP
      const pipVideo = document.createElement("video");
      pipWindowRef.current = pipVideo;
      pipVideo.autoplay = true;

      //Creating stream from canvas which we will play
      const stream = source.captureStream();
      pipVideo.srcObject = stream;
      drawCanvas();

      //When Video is ready we will start PIP mode
      pipVideo.onloadedmetadata = () => {
        pipVideo.requestPictureInPicture();
      };
      await pipVideo.play();

      //When the PIP mode starts, we will start drawing canvas with PIP view
      pipVideo.addEventListener("enterpictureinpicture", (event) => {
        drawCanvas();
        setPipMode(true);
      });

      //When PIP mode exits, we will dispose the track we created earlier
      pipVideo.addEventListener("leavepictureinpicture", (event) => {
        pipWindowRef.current = null;
        setPipMode(false);
        pipVideo.srcObject?.getTracks().forEach((track) => track.stop());
      });

      //These will draw all the video elements in to the Canvas
      function drawCanvas() {
        //Getting all the video elements in the document
        const videos = document.querySelectorAll("video");
        try {
          //Perform initial black paint on the canvas
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, source.width, source.height);

          //Drawing the participant videos on the canvas in the grid format
          const rows = getRowCount(videos.length);
          const columns = getColCount(videos.length);
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
              if (j + i * columns <= videos.length || videos.length === 1) {
                ctx.drawImage(
                  videos[j + i * columns],
                  j < 1 ? 0 : source.width / (columns / j),
                  i < 1 ? 0 : source.height / (rows / i),
                  source.width / columns,
                  source.height / rows
                );
              }
            }
          }
        } catch (error) {
          console.log(error);
        }

        //If pip mode is on, keep drawing the canvas when ever new frame is requested
        if (document.pictureInPictureElement === pipVideo) {
          requestAnimationFrame(drawCanvas);
        }
      }
    } else {
      alert("PIP is not supported by your browser");
    }
  };

  return isMobile || isTab ? (
    <MobileIconButton
      id="pip-btn"
      tooltipTitle={pipMode ? "Stop PiP" : "Start Pip"}
      buttonText={pipMode ? "Stop PiP" : "Start Pip"}
      isFocused={pipMode}
      Icon={PipIcon}
      onClick={() => {
        togglePipMode();
      }}
      disabled={false}
    />
  ) : (
    <OutlinedButton
      Icon={PipIcon}
      onClick={() => {
        togglePipMode();
      }}
      isFocused={pipMode}
      tooltip={pipMode ? "Stop PiP" : "Start Pip"}
      disabled={false}
    />
  );
};

const MicBTN = () => {
  const {
    selectedMic,
    setSelectedMic,
    selectedSpeaker,
    setSelectedSpeaker,
    isMicrophonePermissionAllowed,
  } = useMeetingAppContext();

  const { getMicrophones, getPlaybackDevices } = useMediaDevice();

  const mMeeting = useMeeting();
  const [mics, setMics] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const localMicOn = mMeeting?.localMicOn;
  const changeMic = mMeeting?.changeMic;

  const getMics = async () => {
    const mics = await getMicrophones();
    const speakers = await getPlaybackDevices();

    mics && mics?.length && setMics(mics);
    speakers && speakers?.length && setSpeakers(speakers);
  };

  const [tooltipShow, setTooltipShow] = useState(false);
  const btnRef = useRef();
  const tooltipRef = useRef();

  const openTooltip = () => {
    createPopper(btnRef.current, tooltipRef.current, {
      placement: "top",
    });
    setTooltipShow(true);
  };
  const closeTooltip = () => {
    setTooltipShow(false);
  };
  return (
    <>
      <OutlinedButton
        Icon={localMicOn ? MicOnIcon : MicOffIcon}
        onClick={() => {
          mMeeting.toggleMic();
        }}
        bgColor={localMicOn ? "#132043" : "rgba(31, 65, 114, 0.2)"}
        borderColor={localMicOn && "#ffffff33"}
        isFocused={localMicOn}
        focusIconColor={localMicOn && "#FEFAF6"}
        tooltip={"Toggle Mic"}
        renderRightComponent={() => {
          return (
            <>
              <Popover className="relative">
                {({ close }) => (
                  <>
                    <Popover.Button
                      disabled={!isMicrophonePermissionAllowed}
                      className="flex items-center justify-center mt-1 mr-1 focus:outline-none"
                    >
                      <div
                        ref={btnRef}
                        onMouseEnter={openTooltip}
                        onMouseLeave={closeTooltip}
                      >
                        <button
                          onClick={() => {
                            getMics();
                          }}
                        >
                          <ChevronDownIcon
                            className="h-4 w-4"
                            style={{
                              color: mMeeting.localMicOn ? "white" : "black",
                            }}
                          />
                        </button>
                      </div>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute left-1/2 bottom-full z-10 mt-3 w-72 -translate-x-1/2 transform px-4 sm:px-0 pb-4">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className={" bg-gray-750 py-1"}>
                            <div>
                              <div className="flex items-center p-3 pb-0">
                                <p className="ml-3 text-sm text-gray-900">
                                  {"MICROPHONE"}
                                </p>
                              </div>
                              <div className="flex flex-col">
                                {mics.map(({ deviceId, label }, index) => (
                                  <div
                                    className={`px-3 py-1 my-1 pl-6 text-white text-left ${
                                      deviceId === selectedMic.id &&
                                      "bg-gray-150"
                                    }`}
                                  >
                                    <button
                                      className={`flex flex-1 w-full text-left ${
                                        deviceId === selectedMic.id &&
                                        "bg-gray-150"
                                      }`}
                                      key={`mics_${deviceId}`}
                                      onClick={() => {
                                        setSelectedMic({ id: deviceId });
                                        changeMic(deviceId);
                                        close();
                                      }}
                                    >
                                      {label || `Mic ${index + 1}`}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <hr className="border border-gray-50 mt-2 mb-1" />
                            <div>
                              <div className="flex p-3 pb-0">
                                <p className="ml-3 text-sm text-gray-900  text-center">
                                  {"SPEAKER"}
                                </p>
                              </div>
                              <div className="flex flex-col ">
                                {speakers.map(({ deviceId, label }, index) => (
                                  <div
                                    className={`px-3 py-1 my-1 pl-6 text-white ${
                                      deviceId === selectedSpeaker.id &&
                                      "bg-gray-150"
                                    }`}
                                  >
                                    <button
                                      className={`flex flex-1 w-full text-left ${
                                        deviceId === selectedSpeaker.id &&
                                        "bg-gray-150"
                                      }`}
                                      key={`speakers_${deviceId}`}
                                      onClick={() => {
                                        setSelectedSpeaker({ id: deviceId });
                                        close();
                                      }}
                                    >
                                      {label || `Speaker ${index + 1}`}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              <div
                style={{ zIndex: 999 }}
                className={`${
                  tooltipShow ? "" : "hidden"
                } overflow-hidden flex flex-col items-center justify-center pb-4`}
                ref={tooltipRef}
              >
                <div className={"rounded-md p-1.5 bg-black "}>
                  <p className="text-base text-white ">{"Change microphone"}</p>
                </div>
              </div>
            </>
          );
        }}
      />
    </>
  );
};

const WebCamBTN = () => {
  const { selectedWebcam, setSelectedWebcam, isCameraPermissionAllowed } =
    useMeetingAppContext();
  const { getCameras } = useMediaDevice();
  const mMeeting = useMeeting();
  const [webcams, setWebcams] = useState([]);
  const { getVideoTrack } = useMediaStream();

  const localWebcamOn = mMeeting?.localWebcamOn;
  const changeWebcam = mMeeting?.changeWebcam;

  const getWebcams = async () => {
    let webcams = await getCameras();
    webcams && webcams?.length && setWebcams(webcams);
  };

  const [tooltipShow, setTooltipShow] = useState(false);
  const btnRef = useRef();
  const tooltipRef = useRef();

  const openTooltip = () => {
    createPopper(btnRef.current, tooltipRef.current, {
      placement: "top",
    });
    setTooltipShow(true);
  };
  const closeTooltip = () => {
    setTooltipShow(false);
  };

  return (
    <>
      <OutlinedButton
        Icon={localWebcamOn ? WebcamOnIcon : WebcamOffIcon}
        onClick={async () => {
          let track;
          if (!localWebcamOn) {
            track = await getVideoTrack({
              webcamId: selectedWebcam.id,
            });
          }
          mMeeting.toggleWebcam(track);
        }}
        bgColor={localWebcamOn ? "#132043" : "rgba(31, 65, 114, 0.2)"}
        borderColor={localWebcamOn && "#ffffff33"}
        isFocused={localWebcamOn}
        focusIconColor={localWebcamOn ? "white" : "#132043"}
        tooltip={"Toggle Webcam"}
        renderRightComponent={() => {
          return (
            <>
              <Popover className="relative">
                {({ close }) => (
                  <>
                    <Popover.Button
                      disabled={!isCameraPermissionAllowed}
                      className="flex items-center justify-center mt-1 mr-1 focus:outline-none"
                    >
                      <div
                        ref={btnRef}
                        onMouseEnter={openTooltip}
                        onMouseLeave={closeTooltip}
                      >
                        <button
                          onClick={() => {
                            getWebcams();
                          }}
                        >
                          <ChevronDownIcon
                            className="h-4 w-4"
                            style={{
                              color: localWebcamOn ? "white" : "black",
                            }}
                          />
                        </button>
                      </div>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute left-1/2 bottom-full z-10 mt-3 w-72 -translate-x-1/2 transform px-4 sm:px-0 pb-4">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className={" bg-gray-750 py-1"}>
                            <div>
                              <div className="flex items-center p-3 pb-0">
                                <p className="ml-3 text-sm text-gray-900">
                                  {"WEBCAM"}
                                </p>
                              </div>
                              <div className="flex flex-col">
                                {webcams.map(({ deviceId, label }, index) => (
                                  <div
                                    className={`px-3 py-1 my-1 pl-6 text-black ${
                                      deviceId === selectedWebcam.id &&
                                      "bg-gray-150"
                                    }`}
                                  >
                                    <button
                                      className={`flex flex-1 w-full text-left ${
                                        deviceId === selectedWebcam.id &&
                                        "bg-gray-150"
                                      }`}
                                      key={`output_webcams_${deviceId}`}
                                      onClick={() => {
                                        setSelectedWebcam({ id: deviceId });
                                        changeWebcam(deviceId);
                                        close();
                                      }}
                                    >
                                      {label || `Webcam ${index + 1}`}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              <div
                style={{ zIndex: 999 }}
                className={`${
                  tooltipShow ? "" : "hidden"
                } overflow-hidden flex flex-col items-center justify-center pb-4`}
                ref={tooltipRef}
              >
                <div className={"rounded-md p-1.5 bg-black "}>
                  <p className="text-base text-white ">{"Change webcam"}</p>
                </div>
              </div>
            </>
          );
        }}
      />
    </>
  );
};

interface BottomBarProps {
  bottomBarHeight: string;
  setIsMeetingLeft: React.Dispatch<React.SetStateAction<boolean>>;
  detailRoom: RoomItem;
  isMeetingLeft: boolean;
  token: string;
  roomId: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  bottomBarHeight,
  setIsMeetingLeft,
  detailRoom,
  isMeetingLeft,
  token,
  roomId,
}) => {
  const { userProfile } = useAuth();
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();
  const [isHostRoom, setIsHostRoom] = useState<boolean>();
  const navigate = useNavigate();

  function onMeetingLeft() {
    console.log("onMeetingLeft");
    navigate("/live");
  }
  const { onSubmitLeaveRoomAuto } = useLive();

  //Event to determine if some other participant has left
  function onParticipantLeft(participant) {
    console.log("detailRoom", detailRoom);
    console.log(" onParticipantLeft", participant);
    // endRoomModal("Meeting Ended", "The host has ended the room.", () => {
    //   navigate("/live");
    // });
    onSubmitLeaveRoomAuto(
      {
        room_id: detailRoom.id,
        user_id: +participant.id,
        videoSDKToken: token,
      },
      () => {
        console.log("[AUTO] Leave the room automatically");
      },
      (error) => {
        // handleGlobalException(error, () => {});
        console.log("[AUTO] Leave the room failed", error);
      }
    );
  }

  const { leave } = useMeeting({
    onMeetingLeft,
    onParticipantLeft,
  });

  useEffect(() => {
    if (detailRoom.host_user_id && userProfile?.id) {
      console.log(
        "detailRoom.host_user_id == userProfile?.id",
        detailRoom.host_user_id == userProfile?.id
      );
      setIsHostRoom(detailRoom.host_user_id == userProfile?.id);
    }
  }, [detailRoom, userProfile]);

  const RaiseHandBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
    const { publish } = usePubSub("RAISE_HAND");
    const RaiseHand = () => {
      publish("Raise Hand");
    };

    return isMobile || isTab ? (
      <MobileIconButton
        id="RaiseHandBTN"
        tooltipTitle={"Raise hand"}
        Icon={RaiseHandIcon}
        onClick={RaiseHand}
        buttonText={"Raise Hand"}
      />
    ) : (
      <OutlinedButton
        onClick={RaiseHand}
        tooltip={"Raise Hand"}
        Icon={RaiseHandIcon}
      />
    );
  };

  // const RecordingBTN = () => {
  //   const { startRecording, stopRecording, recordingState } = useMeeting();
  //   const defaultOptions = {
  //     loop: true,
  //     autoplay: true,
  //     animationData: recordingBlink,
  //     rendererSettings: {
  //       preserveAspectRatio: "xMidYMid slice",
  //     },
  //     height: 64,
  //     width: 160,
  //   };

  //   const isRecording = useIsRecording();
  //   const isRecordingRef = useRef(isRecording);

  //   useEffect(() => {
  //     isRecordingRef.current = isRecording;
  //   }, [isRecording]);

  //   const { isRequestProcessing } = useMemo(
  //     () => ({
  //       isRequestProcessing:
  //         recordingState === Constants.recordingEvents.RECORDING_STARTING ||
  //         recordingState === Constants.recordingEvents.RECORDING_STOPPING,
  //     }),
  //     [recordingState]
  //   );

  //   const _handleClick = () => {
  //     const isRecording = isRecordingRef.current;

  //     if (isRecording) {
  //       stopRecording();
  //     } else {
  //       startRecording();
  //     }
  //   };

  //   return (
  //     <OutlinedButton
  //       Icon={RecordingIcon}
  //       onClick={_handleClick}
  //       isFocused={isRecording}
  //       tooltip={
  //         recordingState === Constants.recordingEvents.RECORDING_STARTED
  //           ? "Stop Recording"
  //           : recordingState === Constants.recordingEvents.RECORDING_STARTING
  //           ? "Starting Recording"
  //           : recordingState === Constants.recordingEvents.RECORDING_STOPPED
  //           ? "Start Recording"
  //           : recordingState === Constants.recordingEvents.RECORDING_STOPPING
  //           ? "Stopping Recording"
  //           : "Start Recording"
  //       }
  //       lottieOption={isRecording ? defaultOptions : null}
  //       isRequestProcessing={isRequestProcessing}
  //     />
  //   );
  // };

  const ScreenShareBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
    const { localScreenShareOn, toggleScreenShare, presenterId } = useMeeting();

    return isMobile || isTab ? (
      <MobileIconButton
        id="screen-share-btn"
        tooltipTitle={
          presenterId
            ? localScreenShareOn
              ? "Stop Presenting"
              : null
            : "Present Screen"
        }
        buttonText={
          presenterId
            ? localScreenShareOn
              ? "Stop Presenting"
              : null
            : "Present Screen"
        }
        isFocused={localScreenShareOn}
        Icon={ScreenShareIcon}
        onClick={() => {
          toggleScreenShare();
        }}
        disabled={
          presenterId
            ? localScreenShareOn
              ? false
              : true
            : isMobile
            ? true
            : false
        }
      />
    ) : (
      <OutlinedButton
        Icon={ScreenShareIcon}
        onClick={() => {
          toggleScreenShare();
        }}
        isFocused={localScreenShareOn}
        tooltip={
          presenterId
            ? localScreenShareOn
              ? "Stop Presenting"
              : null
            : "Present Screen"
        }
        disabled={presenterId ? (localScreenShareOn ? false : true) : false}
      />
    );
  };

  // window.onbeforeunload = (e) => {
  //   console.log("Tat trinh duyet khi roi room");

  //   return deleteModal(
  //     "Leave meeting",
  //     "Are you sure you want to leave the meeting?",
  //     "Leave",
  //     () => {
  //       setIsMeetingLeft(true);
  //       e.returnValue = ""; // Đảm bảo rằng trình duyệt không hiển thị thông báo mặc định
  //     }
  //   );
  // };
  // window.onbeforeunload = (e) => {
  //   return "Are you sure you want to leave the meeting?";
  // };

  const { onSubmitLeaveRoom } = useLive();

  const LeaveBTN = () => {
    return (
      <OutlinedButton
        Icon={EndIcon}
        bgColor="#D24545"
        color="#fff"
        onClick={() => {
          deleteModal(
            "Leave meeting",
            `Are you sure you want to leave the meeting? `,
            "Leave",
            () => {
              onSubmitLeaveRoom(
                { id: roomId, videoSDKToken: token },
                () => {
                  leave();
                  notificationShow(
                    "success",
                    "Success!",
                    "Leave a room successfully!"
                  );
                  navigate("/live");
                },
                (error) => {
                  handleGlobalException(error, () => {});
                }
              );
            }
          );
        }}
        tooltip="Leave Meeting"
      />
    );
  };

  const ChatBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
    return isMobile || isTab ? (
      <MobileIconButton
        tooltipTitle={"Chat"}
        buttonText={"Chat"}
        Icon={ChatIcon}
        isFocused={sideBarMode === sideBarModes.CHAT}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.CHAT ? null : sideBarModes.CHAT
          );
        }}
        // isFocused={sideBarArr.includes(sideBarModes.CHAT)}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.CHAT)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.CHAT]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.CHAT)
        //     );
        //   }
        // }}
      />
    ) : (
      <OutlinedButton
        Icon={ChatIcon}
        isFocused={sideBarMode === sideBarModes.CHAT}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.CHAT ? null : sideBarModes.CHAT
          );
        }}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.CHAT)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.CHAT]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.CHAT)
        //     );
        //   }
        // }}
        // isFocused={sideBarArr.includes(sideBarModes.CHAT)}
        tooltip="View Chat"
      />
    );
  };

  const ParticipantsBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
    const { participants } = useMeeting();
    return isMobile || isTab ? (
      <MobileIconButton
        tooltipTitle={"Participants"}
        buttonText={"Participants"}
        disabledOpacity={1}
        Icon={ParticipantsIcon}
        isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
          );
        }}
        // isFocused={sideBarArr.includes(sideBarModes.PARTICIPANTS)}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.PARTICIPANTS)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.PARTICIPANTS]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.PARTICIPANTS)
        //     );
        //   }
        // }}
        badge={`${new Map(participants)?.size}`}
      />
    ) : (
      <OutlinedButton
        Icon={ParticipantsIcon}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.PARTICIPANTS)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.PARTICIPANTS]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.PARTICIPANTS)
        //     );
        //   }
        // }}
        // isFocused={sideBarArr.includes(sideBarModes.PARTICIPANTS)}
        isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
          );
        }}
        tooltip={"View \nParticipants"}
        badge={`${new Map(participants)?.size}`}
      />
    );
  };

  const ShowContentBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
    return isMobile || isTab ? (
      <MobileIconButton
        tooltipTitle={"Content"}
        buttonText={"Content"}
        disabledOpacity={1}
        Icon={ShowContentIcon}
        isFocused={sideBarMode === sideBarModes.CONTENT}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.CONTENT ? null : sideBarModes.CONTENT
          );
        }}
        // isFocused={sideBarArr.includes(sideBarModes.CONTENT)}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.CONTENT)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.CONTENT]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.CONTENT)
        //     );
        //   }
        // }}
      />
    ) : (
      <OutlinedButton
        Icon={ShowContentIcon}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.CONTENT)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.CONTENT]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.CONTENT)
        //     );
        //   }
        // }}
        // isFocused={sideBarArr.includes(sideBarModes.CONTENT)}
        isFocused={sideBarMode === sideBarModes.CONTENT}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.CONTENT ? null : sideBarModes.CONTENT
          );
        }}
        tooltip={"View Lesson Content"}
      />
    );
  };

  const TranslateBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
    return isMobile || isTab ? (
      <MobileIconButton
        tooltipTitle={"Translate"}
        buttonText={"Translate"}
        disabledOpacity={1}
        Icon={TranslateIcon}
        isFocused={sideBarMode === sideBarModes.TRANSLATE}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.TRANSLATE ? null : sideBarModes.TRANSLATE
          );
        }}
        // isFocused={sideBarArr.includes(sideBarModes.TRANSLATE)}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.TRANSLATE)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.TRANSLATE]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.TRANSLATE)
        //     );
        //   }
        // }}
      />
    ) : (
      <OutlinedButton
        Icon={TranslateIcon}
        isFocused={sideBarMode === sideBarModes.TRANSLATE}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.TRANSLATE ? null : sideBarModes.TRANSLATE
          );
        }}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.TRANSLATE)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.TRANSLATE]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.TRANSLATE)
        //     );
        //   }
        // }}
        // isFocused={sideBarArr.includes(sideBarModes.TRANSLATE)}
        tooltip={"Translate Tool"}
      />
    );
  };

  const SentencesBTN: React.FC<PipBTNProps> = ({ isMobile, isTab }) => {
    return isMobile || isTab ? (
      <MobileIconButton
        tooltipTitle={"Suggested sentences"}
        buttonText={"Suggested sentences"}
        disabledOpacity={1}
        Icon={SuggestedIcon}
        isFocused={sideBarMode === sideBarModes.SENTENCES}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.SENTENCES ? null : sideBarModes.SENTENCES
          );
        }}
        // isFocused={sideBarArr.includes(sideBarModes.TRANSLATE)}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.TRANSLATE)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.TRANSLATE]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.TRANSLATE)
        //     );
        //   }
        // }}
      />
    ) : (
      <OutlinedButton
        Icon={SuggestedIcon}
        isFocused={sideBarMode === sideBarModes.SENTENCES}
        onClick={() => {
          setSideBarMode((s) =>
            s === sideBarModes.SENTENCES ? null : sideBarModes.SENTENCES
          );
        }}
        // onClick={() => {
        //   if (!sideBarArr.includes(sideBarModes.SENTENCES)) {
        //     setSideBarArr((prevArr) => [...prevArr, sideBarModes.SENTENCES]);
        //   } else {
        //     setSideBarArr((prevArr) =>
        //       prevArr.filter((mode) => mode !== sideBarModes.SENTENCES)
        //     );
        //   }
        // }}
        // isFocused={sideBarArr.includes(sideBarModes.SENTENCES)}
        tooltip={"Suggested Sentences"}
      />
    );
  };

  const MeetingIdCopyBTN = () => {
    const [isCopied, setIsCopied] = useState(false);
    return (
      <div className="flex items-center justify-center lg:ml-0 ml-4 mt-4 xl:mt-0">
        <div
          style={{ backgroundColor: "rgba(31, 65, 114, 0.1)" }}
          className="flex p-2 rounded-md items-center justify-center"
        >
          <h1
            style={{
              color: "#1f4172",
              width: "11rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="text-sm "
          >
            {window.location.href}
          </h1>
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon
                style={{ color: "#1f4172" }}
                className="h-5 w-5 text-green-400"
              />
            ) : (
              <ClipboardIcon
                style={{ color: "#1f4172" }}
                className="h-5 w-5 text-black"
              />
            )}
          </button>
        </div>
      </div>
    );
  };

  const tollTipEl = useRef();
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const [open, setOpen] = useState(false);

  const handleClickFAB = () => {
    setOpen(true);
  };

  const handleCloseFAB = () => {
    setOpen(false);
  };

  const BottomBarButtonTypes = useMemo(
    () => ({
      END_CALL: "END_CALL",
      CHAT: "CHAT",
      PARTICIPANTS: "PARTICIPANTS",
      SHOW_CONTENT: "SHOW_CONTENT",
      TRANSLATE: "TRANSLATE",
      SENTENCES: "SENTENCES",
      SCREEN_SHARE: "SCREEN_SHARE",
      WEBCAM: "WEBCAM",
      MIC: "MIC",
      RAISE_HAND: "RAISE_HAND",
      RECORDING: "RECORDING",
      PIP: "PIP",
      MEETING_ID_COPY: "MEETING_ID_COPY",
    }),
    []
  );

  const otherFeatures = [
    { icon: BottomBarButtonTypes.RAISE_HAND },
    { icon: BottomBarButtonTypes.PIP },
    { icon: BottomBarButtonTypes.SCREEN_SHARE },
    { icon: BottomBarButtonTypes.CHAT },
    { icon: BottomBarButtonTypes.SHOW_CONTENT },
    { icon: BottomBarButtonTypes.TRANSLATE },
    { icon: BottomBarButtonTypes.SENTENCES },
    { icon: BottomBarButtonTypes.PARTICIPANTS },
    { icon: BottomBarButtonTypes.MEETING_ID_COPY },
  ];

  return isMobile || isTab ? (
    <div
      className="flex items-center justify-center"
      style={{ height: bottomBarHeight }}
    >
      <LeaveBTN />
      <MicBTN />
      <WebCamBTN />
      {/* <RecordingBTN /> */}
      <OutlinedButton Icon={DotsHorizontalIcon} onClick={handleClickFAB} />
      <Transition appear show={Boolean(open)} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 9999 }}
          onClose={handleCloseFAB}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full opacity-0 scale-95"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100 scale-100"
            leaveTo="translate-y-full opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-hidden">
              <div className="flex h-full items-end justify-end text-center">
                <Dialog.Panel className="w-screen transform overflow-hidden bg-gray-800 shadow-xl transition-all">
                  <div className="grid container bg-gray-800 py-6">
                    <div className="grid grid-cols-12 gap-2">
                      {otherFeatures.map(({ icon }) => {
                        return (
                          <div
                            className={`grid items-center justify-center ${
                              icon === BottomBarButtonTypes.MEETING_ID_COPY
                                ? "col-span-7 sm:col-span-5 md:col-span-3"
                                : "col-span-4 sm:col-span-3 md:col-span-2"
                            }`}
                          >
                            {icon === BottomBarButtonTypes.RAISE_HAND ? (
                              <RaiseHandBTN isMobile={isMobile} isTab={isTab} />
                            ) : icon === BottomBarButtonTypes.SCREEN_SHARE ? (
                              <ScreenShareBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : icon === BottomBarButtonTypes.CHAT ? (
                              <ChatBTN isMobile={isMobile} isTab={isTab} />
                            ) : icon === BottomBarButtonTypes.SHOW_CONTENT ? (
                              <ShowContentBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : icon === BottomBarButtonTypes.TRANSLATE ? (
                              <TranslateBTN isMobile={isMobile} isTab={isTab} />
                            ) : icon === BottomBarButtonTypes.PARTICIPANTS ? (
                              <ParticipantsBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : icon === BottomBarButtonTypes.SENTENCES ? (
                              <SentencesBTN isMobile={isMobile} isTab={isTab} />
                            ) : icon ===
                              BottomBarButtonTypes.MEETING_ID_COPY ? (
                              <MeetingIdCopyBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : icon === BottomBarButtonTypes.PIP ? (
                              <PipBTN isMobile={isMobile} isTab={isTab} />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  ) : (
    <div
      style={{ height: bottomBarHeight, borderTop: "0.0625rem solid #ced4da" }}
      className="md:flex lg:px-2 xl:px-6 pb-2 px-2 hidden"
    >
      <MeetingIdCopyBTN />

      <div className="flex flex-1 items-center justify-center" ref={tollTipEl}>
        {/* <RecordingBTN /> */}
        <RaiseHandBTN isMobile={isMobile} isTab={isTab} />
        <MicBTN />
        <WebCamBTN />
        <ScreenShareBTN isMobile={isMobile} isTab={isTab} />
        <PipBTN isMobile={isMobile} isTab={isTab} />
        <LeaveBTN />
      </div>
      <div className="flex items-center justify-center">
        {!(detailRoom.topic.name == "Free Style") && (
          <ShowContentBTN isMobile={isMobile} isTab={isTab} />
        )}
        <SentencesBTN isMobile={isMobile} isTab={isTab} />
        <TranslateBTN isMobile={isMobile} isTab={isTab} />
        <ChatBTN isMobile={isMobile} isTab={isTab} />
        <ParticipantsBTN isMobile={isMobile} isTab={isTab} />
      </div>
    </div>
  );
};
