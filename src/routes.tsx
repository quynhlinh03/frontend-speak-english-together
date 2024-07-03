import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import ErrorPage from "./pages/Error";
import Live from "./pages/Live";
import Login from "./pages/Login";
import * as ROUTES from "./constants/routes";
import VerifyAccount from "./pages/VerifyAccount";
import LiveScreen from "./pages/LiveScreen";
import OnlyHeader from "./layouts/OnlyHeader";
import Account from "./pages/Account";
import AIRoom from "./pages/AIRoom";
import Buddy from "./pages/Buddy";
import Translate from "./pages/Translate";
import Handbook from "./pages/Handbook";
import CollectionDetail from "./components/Collections/CollectionDetail";
import SavedSpeeches from "./pages/SavedSpeeches";
import DetailSpeech from "./pages/DetailSpeech";
import FlashcardVacubulary from "./pages/FlashcardVocabulary";
import Chat from "./pages/Chat";
import { CometChatUsersWithMessages } from "@cometchat/chat-uikit-react";
import CometChatTS from "./pages/Chat";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.HOME,
    element: <OnlyHeader />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "screen/:id/:roomId",
        element: <LiveScreen />,
      },
    ],
  },
  {
    path: ROUTES.HOME,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="live" />,
      },
      {
        path: "screen/:id/:roomId",
        element: <LiveScreen />,
      },
      {
        path: "live",
        element: <Live />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "cometchat",
        element: <CometChatUsersWithMessages />,
      },
      {
        path: "chat/:conversationWith",
        element: <CometChatTS />,
      },
      {
        path: "buddy",
        element: <Buddy />,
      },
      {
        path: "search",
        element: <Live />,
      },
      {
        path: "ai-room",
        element: <AIRoom />,
      },
      {
        path: "ai-room/saved",
        element: <SavedSpeeches />,
      },
      {
        path: "ai-room/saved/:id",
        element: <DetailSpeech />,
      },
      {
        path: "translate",
        element: <Translate />,
      },
      {
        path: "handbook/:tabValue",
        element: <Handbook />,
      },
      {
        path: "personal/:id/:tabValue",
        element: <Account />,
      },
      {
        path: "handbook/collections/:id",
        element: <CollectionDetail />,
      },
      {
        path: "handbook/flashcard/:collectionId?",
        element: <FlashcardVacubulary />,
      },
    ],
  },
  {
    path: "/verify/:token",
    element: <VerifyAccount />,
  },
]);
