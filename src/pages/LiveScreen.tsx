import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MeetingAppProvider } from "../MeetingAppContextDef";
import { MeetingContainer } from "../meeting/MeetingContainer";
import JoiningScreen from "../components/screens/JoiningScreen";
import { useLive, useLiveDetail } from "../hooks/useLive";
import { handleGlobalException } from "../utils/error";
import { notificationShow } from "../components/Notification";
import { RoomItem } from "../components/LiveList/type";
import PasswordForm from "../components/ModalItem/PasswordForm";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SubmitHandler } from "react-hook-form";
import ErrModal from "../components/ModalItem/ErrModal";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import useAuth from "../hooks/useAuth";

export default function LiveScreen() {
  const { userProfile } = useAuth();
  const { id, roomId } = useParams();
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState(id || "");
  const [participantName, setParticipantName] = useState();
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [customAudioStream, setCustomAudioStream] = useState(null);
  const [customVideoStream, setCustomVideoStream] = useState(null);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const [detailRoom, setDetailRoom] = useState<RoomItem>();
  const [passValue, setPassValue] = useState("");
  const [data, setData] = useState<{
    id: number;
    videoSDKToken: string;
    password?: string;
  }>({
    id: roomId,
    videoSDKToken: token,
  });
  const [changeIsCall, setchangeIsCall] = useState(false);
  const [err, setErr] = useState("");
  const { onSubmitJoinRoom } = useLive();

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;
  const navigate = useNavigate();
  const { onSubmitLeaveRoom, fetchLiveToken } = useLive();
  const { fetchDetaiRoom } = useLiveDetail(roomId);
  const location = useLocation();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedErr, { open: openErr, close: closeErr }] = useDisclosure(false);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setParticipantName(userProfile.full_name);
    }
  }, [userProfile]);

  useEffect(() => {
    async function fetchSDKToken() {
      const dataToken = await fetchLiveToken.refetch();
      if (dataToken.isSuccess) {
        setToken(dataToken.data.data.token);
        setData((prevData) => ({
          ...prevData,
          videoSDKToken: dataToken.data.data.token,
        }));
      } else if (dataToken.isError) {
        const error = dataToken.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchSDKToken();
  }, []);

  useEffect(() => {
    async function fetchDetailLiveRoom() {
      const data = await fetchDetaiRoom.refetch();
      if (data.isSuccess) {
        setDetailRoom(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchDetailLiveRoom();
  }, [isLoad]);

  useEffect(() => {
    if (location?.state?.isValidJoining) {
      setMeetingStarted(true);
    } else {
      if (detailRoom && token) {
        onSubmit(data);
      }
    }
  }, [location?.state, detailRoom, token]);

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  window.addEventListener("beforeunload", function (e) {
    return "Are you sure you want to leave the meeting?";
  });

  useEffect(() => {
    if (isMeetingLeft) {
      const handleSuccess = (message: string) => {
        notificationShow("success", "Success!", message);
      };
      onSubmitLeaveRoom(
        { id: roomId, videoSDKToken: token },
        () => {
          handleSuccess("Leave a room successfully!");
          navigate("/live");
        },
        (error) => {
          handleGlobalException(error, () => {});
        }
      );
    }
  }, [isMeetingLeft]);

  const onSubmit: SubmitHandler<{ id: number }> = async (data) => {
    let isCall;
    if (detailRoom?.is_private) {
      isCall = false;
      open();
      if (changeIsCall) {
        isCall = true;
      }
    } else {
      isCall = true;
    }
    if (isCall) {
      try {
        const handleSuccess = (message: string) => {
          notificationShow("success", "Success!", message);
        };
        const handleError = (error) => {
          setMeetingStarted(false);
          setErr(error.response.data.message);
          openErr();
        };

        onSubmitJoinRoom(
          data,
          () => {
            handleSuccess("Room joined successfully!");
            setMeetingStarted(true);
            close();
          },
          handleError
        );
      } catch (error) {
        handleGlobalException(error, () => {});
      }
    }
  };

  useEffect(() => {
    if (passValue) {
      setData((prevData) => ({
        ...prevData,
        password: passValue,
      }));
      setchangeIsCall(true);
    }
  }, [passValue]);
  useEffect(() => {
    if (changeIsCall) {
      onSubmit(data);
    }
  }, [changeIsCall]);

  useEffect(() => {
    if (detailRoom) {
      const roomMembersCollection = collection(db, "room_members");
      const unsubscribe = onSnapshot(roomMembersCollection, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const found = data.some((item) => +item?.room_id == detailRoom?.id);
        if (found) {
          setIsLoad((prev) => !prev);
        }
      });

      return () => unsubscribe();
    }
  }, [detailRoom]);

  return (
    <>
      {token && userProfile?.full_name && (
        <MeetingAppProvider>
          {isMeetingStarted ? (
            <MeetingProvider
              config={{
                meetingId,
                micEnabled: micOn,
                webcamEnabled: webcamOn,
                name: participantName ? participantName : "TestUser",
                participantId: userProfile?.id,
                multiStream: true,
                customCameraVideoTrack: customVideoStream,
                customMicrophoneAudioTrack: customAudioStream,
              }}
              token={token}
              reinitialiseMeetingOnConfigChange={true}
              joinWithoutUserInteraction={true}
            >
              <MeetingContainer
                detailRoom={detailRoom}
                onMeetingLeave={() => {
                  setToken("");
                  setMeetingId("");
                  setParticipantName("");
                  setWebcamOn(false);
                  setMicOn(false);
                  setMeetingStarted(false);
                }}
                setIsMeetingLeft={setIsMeetingLeft}
                isMeetingLeft={isMeetingLeft}
                token={token}
                roomId={roomId}
              />
            </MeetingProvider>
          ) : (
            // : isMeetingLeft ? (
            //   <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
            // )
            !isMeetingLeft && (
              <JoiningScreen
                participantName={participantName}
                setParticipantName={setParticipantName}
                setMeetingId={setMeetingId}
                setToken={setToken}
                micOn={micOn}
                setMicOn={setMicOn}
                webcamOn={webcamOn}
                setWebcamOn={setWebcamOn}
                customAudioStream={customAudioStream}
                setCustomAudioStream={setCustomAudioStream}
                customVideoStream={customVideoStream}
                setCustomVideoStream={setCustomVideoStream}
                onClickStartMeeting={() => {
                  setMeetingStarted(true);
                }}
                startMeeting={isMeetingStarted}
                setIsMeetingLeft={setIsMeetingLeft}
              />
            )
          )}
        </MeetingAppProvider>
      )}
      <Modal
        overlayProps={{
          color: "#000",
          opacity: 1,
          blur: 1,
        }}
        title="Enter password"
        opened={opened}
        onClose={() => {
          close();
          navigate("/live");
        }}
        size={450}
        centered
        m={20}
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        <PasswordForm setPassValue={setPassValue} />
      </Modal>
      <Modal
        overlayProps={{
          color: "#000",
          opacity: 1,
          blur: 1,
        }}
        title="Err"
        opened={openedErr}
        onClose={() => {
          closeErr();
          navigate("/live");
        }}
        size={450}
        centered
        m={20}
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        <ErrModal
          content={err}
          closeModal={() => {
            closeErr();
            navigate("/live");
          }}
        />
      </Modal>
    </>
  );
}
