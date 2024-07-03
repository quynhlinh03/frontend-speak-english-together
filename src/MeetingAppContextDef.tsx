import React, { useContext, createContext, useState, useEffect, useRef, ReactNode } from "react";

interface Participant {
  id: string | null;
  label: string | null;
}

interface RaisedHandParticipant {
  participantId: string;
  raisedHandOn: number;
}

interface MeetingAppContextType {
  selectedMic: Participant;
  selectedWebcam: Participant;
  selectedSpeaker: Participant;
  isCameraPermissionAllowed: boolean | null;
  isMicrophonePermissionAllowed: boolean | null;
  raisedHandsParticipants: RaisedHandParticipant[];
  sideBarMode: string | null;
  sideBarArr: Array<string>;
  pipMode: boolean;
  setRaisedHandsParticipants: React.Dispatch<React.SetStateAction<RaisedHandParticipant[]>>;
  setSelectedMic: React.Dispatch<React.SetStateAction<Participant>>;
  setSelectedWebcam: React.Dispatch<React.SetStateAction<Participant>>;
  setSelectedSpeaker: React.Dispatch<React.SetStateAction<Participant>>;
  setSideBarMode: React.Dispatch<React.SetStateAction<string | null>>;
  setSideBarArr:  React.Dispatch<React.SetStateAction<Array<string>>>;
  setPipMode: React.Dispatch<React.SetStateAction<boolean>>;
  useRaisedHandParticipants: () => { participantRaisedHand: (participantId: string) => void };
  setIsCameraPermissionAllowed: React.Dispatch<React.SetStateAction<boolean | null>>;
  setIsMicrophonePermissionAllowed: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const MeetingAppContext = createContext<MeetingAppContextType | null>(null);

export const useMeetingAppContext = (): MeetingAppContextType => {
  const context = useContext(MeetingAppContext);
  if (!context) {
    throw new Error("useMeetingAppContext must be used within a MeetingAppProvider");
  }
  return context;
};

interface MeetingAppProviderProps {
  children: ReactNode;
}

export const MeetingAppProvider = ({ children }: MeetingAppProviderProps): JSX.Element => {
  const [selectedMic, setSelectedMic] = useState<Participant>({ id: null, label: null });
  const [selectedWebcam, setSelectedWebcam] = useState<Participant>({ id: null, label: null });
  const [selectedSpeaker, setSelectedSpeaker] = useState<Participant>({ id: null, label: null });
  const [isCameraPermissionAllowed, setIsCameraPermissionAllowed] = useState<boolean | null>(null);
  const [isMicrophonePermissionAllowed, setIsMicrophonePermissionAllowed] = useState<boolean | null>(null);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<RaisedHandParticipant[]>([]);
  const [sideBarMode, setSideBarMode] = useState<string | null>(null);
  const [sideBarArr, setSideBarArr] = useState<string[]>([]);
  const [pipMode, setPipMode] = useState<boolean>(false);

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<RaisedHandParticipant[]>([]);

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const newItem = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem);
      } else {
        raisedHandsParticipants[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHandsParticipants);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const now = new Date().getTime();

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return parseInt(raisedHandOn) + 15000 > parseInt(now);
      });

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  const contextValue: MeetingAppContextType = {
    selectedMic,
    selectedWebcam,
    selectedSpeaker,
    isCameraPermissionAllowed,
    isMicrophonePermissionAllowed,
    raisedHandsParticipants,
    sideBarMode,
    sideBarArr,
    pipMode,
    setRaisedHandsParticipants,
    setSelectedMic,
    setSelectedWebcam,
    setSelectedSpeaker,
    setSideBarMode,
    setSideBarArr,
    setPipMode,
    useRaisedHandParticipants,
    setIsCameraPermissionAllowed,
    setIsMicrophonePermissionAllowed,
  };

  return (
    <MeetingAppContext.Provider value={contextValue}>
      {children}
    </MeetingAppContext.Provider>
  );
};
