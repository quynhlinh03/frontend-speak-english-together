import React, { Fragment, useEffect, useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import useIsMobile from "../../hooks/useIsMobile";
import useIsTab from "../../hooks/useIsTab";
import { XIcon } from "@heroicons/react/outline";
import { ChatPanel } from "./ChatPanel";
import { ParticipantPanel } from "./ParticipantPanel";
import { Dialog, Transition } from "@headlessui/react";
import { useMediaQuery } from "react-responsive";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { Stack } from "@mantine/core";
import { ContentPanel } from "./ContentPanel";
import { TranslatePanel } from "./TranslatePanel";
import { RoomItem } from "../LiveList/type";
import { SuggestedSentences } from "./SuggestedSentences/SuggestedSentences";
import useAuth from "../../hooks/useAuth";
import { webcamMicModal } from "../../utils/webcamMicModal";

interface SideBarTabViewProps {
  height: string;
  sideBarContainerWidth: string;
  panelHeight: number;
  panelHeaderHeight: number;
  panelHeaderPadding: number;
  panelPadding: number;
  // handleClose: (sideBarMode: string) => void;
  handleClose: () => void;
  detailRoom: RoomItem;
}

const SideBarTabView: React.FC<SideBarTabViewProps> = ({
  height,
  sideBarContainerWidth,
  panelHeight,
  panelHeaderHeight,
  panelHeaderPadding,
  panelPadding,
  handleClose,
  detailRoom,
}) => {
  const { participants } = useMeeting();
  const { sideBarMode, sideBarArr } = useMeetingAppContext();
  const [isHostRoom, setIsHostRoom] = useState<boolean>();
  const { userProfile } = useAuth();

  useEffect(() => {
    if (detailRoom.host_user_id && userProfile?.id) {
      setIsHostRoom(detailRoom.host_user_id == userProfile?.id);
    }
  }, [detailRoom, userProfile]);

  return (
    <div
      style={{
        height,
        width: sideBarContainerWidth,
        paddingTop: panelPadding,
        paddingLeft: panelPadding,
        paddingRight: panelPadding,
        paddingBottom: panelPadding,
        backgroundColor: "#FEFAF6",
      }}
    >
      <div>
        <div
          style={{
            height: height,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: "#FEFAF6",
            border: "0.0625rem solid #ced4da",
          }}
        >
          <>
            {sideBarMode && (
              <Stack h="100%">
                {sideBarMode === "PARTICIPANTS" && (
                  <>
                    <div
                      className={`flex items-center justify-between`}
                      style={{
                        padding: panelHeaderPadding,
                        height: panelHeaderHeight - 1,
                        borderBottom: "0.0625rem solid #ced4da",
                      }}
                    >
                      <p className="text-base text-black font-bold">
                        {"PARTICIPANTS".charAt(0).toUpperCase() +
                          "PARTICIPANTS".slice(1).toLowerCase() || ""}{" "}
                        ({new Map(participants)?.size})
                      </p>
                      <button
                        className="text-black"
                        onClick={() => {
                          handleClose();
                        }}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <ParticipantPanel detailRoom={detailRoom} isHostRoom={isHostRoom} panelHeight={panelHeight} />
                  </>
                )}
                {sideBarMode === "CHAT" && (
                  <>
                    <div
                      className={`flex items-center justify-between`}
                      style={{
                        padding: panelHeaderPadding,
                        height: panelHeaderHeight - 1,
                        borderBottom: "0.0625rem solid #ced4da",
                      }}
                    >
                      <p className="text-base text-black font-bold">
                        {"CHAT".charAt(0).toUpperCase() +
                          "CHAT".slice(1).toLowerCase() || ""}
                      </p>
                      <button
                        className="text-black"
                        onClick={() => {
                          handleClose();
                        }}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <ChatPanel panelHeight={panelHeight} />
                  </>
                )}
                {sideBarMode === "CONTENT" && (
                  <>
                    <div
                      className={`flex items-center justify-between`}
                      style={{
                        padding: panelHeaderPadding,
                        height: panelHeaderHeight - 1,
                        borderBottom: "0.0625rem solid #ced4da",
                      }}
                    >
                      <p className="text-base text-black font-bold">
                        {"CONTENT".charAt(0).toUpperCase() +
                          "CONTENT".slice(1).toLowerCase() || ""}
                      </p>
                      <button
                        className="text-black"
                        onClick={() => {
                          handleClose();
                        }}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <ContentPanel
                      detailRoom={detailRoom}
                      panelHeight={panelHeight}
                    />
                  </>
                )}
                {sideBarMode === "TRANSLATE" && (
                  <>
                    <div
                      className={`flex items-center justify-between`}
                      style={{
                        padding: panelHeaderPadding,
                        height: panelHeaderHeight - 1,
                        borderBottom: "0.0625rem solid #ced4da",
                      }}
                    >
                      <p className="text-base text-black font-bold">
                        {"TRANSLATE".charAt(0).toUpperCase() +
                          "TRANSLATE".slice(1).toLowerCase() || ""}
                      </p>
                      <button
                        className="text-black"
                        onClick={() => {
                          handleClose();
                        }}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <TranslatePanel panelHeight={panelHeight} />
                  </>
                )}
                {sideBarMode === "SENTENCES" && (
                  <>
                    <div
                      className={`flex items-center justify-between`}
                      style={{
                        padding: panelHeaderPadding,
                        height: panelHeaderHeight - 1,
                        borderBottom: "0.0625rem solid #ced4da",
                      }}
                    >
                      <p className="text-base text-black font-bold">
                        {"Suggested sentences".charAt(0).toUpperCase() +
                          "Suggested sentences".slice(1).toLowerCase() || ""}
                      </p>
                      <button
                        className="text-black"
                        onClick={() => {
                          handleClose();
                        }}
                        style={{ margin: 0, padding: 0 }}
                      >
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <SuggestedSentences id={detailRoom?.id} panelHeight={panelHeight} />
                  </>
                )}
              </Stack>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export const SidebarConatiner: React.FC<{
  height: number;
  sideBarContainerWidth: number;
  detailRoom: RoomItem | undefined;
}> = ({ height, sideBarContainerWidth, detailRoom }) => {
  const {
    raisedHandsParticipants,
    sideBarMode,
    sideBarArr,
    setSideBarMode,
    setSideBarArr,
  } = useMeetingAppContext();
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });

  useEffect(() => {
    if (sideBarMode) {
      if (!sideBarArr.includes(sideBarMode)) {
        setSideBarArr((prevArr) => [...prevArr, sideBarMode]);
      }
    }
  }, [sideBarMode]);

  const panelPadding = 8;

  const paddedHeight = height - panelPadding * 3.5;

  const panelHeaderHeight = isMobile
    ? 40
    : isTab
    ? 44
    : isLGDesktop
    ? 48
    : isXLDesktop
    ? 52
    : 0;

  const panelHeaderPadding = isMobile
    ? 6
    : isTab
    ? 8
    : isLGDesktop
    ? 10
    : isXLDesktop
    ? 12
    : 0;

  const handleClose = () => {
    setSideBarMode(null);
  };
  // const handleSideBarArr = (sideBarMode: string) => {
  //   if (sideBarArr.includes(sideBarMode)) {
  //     setSideBarArr((prevArr) =>
  //       prevArr.filter((mode) => mode !== sideBarMode)
  //     );
  //   }
  // };

  return sideBarMode ? (
    isTab || isMobile ? (
      <Transition appear show={sideBarMode ? true : false} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 9999 }}
          onClose={handleClose}
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
              <div className="flex h-screen items-center justify-center text-center">
                <Dialog.Panel
                  style={{ backgroundColor: "#FEFAF6" }}
                  className="w-screen transform overflow-hidden shadow-xl transition-all"
                >
                  <SideBarTabView
                    height={"100%"}
                    sideBarContainerWidth={"100%"}
                    panelHeight={height}
                    raisedHandsParticipants={raisedHandsParticipants}
                    panelHeaderHeight={panelHeaderHeight}
                    panelHeaderPadding={panelHeaderPadding}
                    panelPadding={panelPadding}
                    handleClose={handleClose}
                  />
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    ) : (
      <SideBarTabView
        detailRoom={detailRoom}
        height={paddedHeight}
        sideBarContainerWidth={sideBarContainerWidth}
        panelHeight={paddedHeight - panelHeaderHeight - panelHeaderPadding}
        raisedHandsParticipants={raisedHandsParticipants}
        panelHeaderHeight={panelHeaderHeight}
        panelHeaderPadding={panelHeaderPadding}
        panelPadding={panelPadding}
        handleClose={handleClose}
        // handleClose={(sideBarMode) => {
        //   // handleClose();
        //   handleSideBarArr(sideBarMode);
        // }}
      />
    )
  ) : (
    <></>
  );
};
