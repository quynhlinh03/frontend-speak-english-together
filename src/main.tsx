import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/styles/main.scss";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@cometchat/uikit-elements";
import { AppConstants } from "./AppConstants.ts";
import { CometChat } from "@cometchat/chat-sdk-javascript";

let appID: string = AppConstants.APP_ID,
  region: string = AppConstants.REGION,
  appSetting: CometChat.AppSettings = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .autoEstablishSocketConnection(true)
    .build();
CometChat.init(appID, appSetting).then(
  (initialized: boolean) => {
    console.log("Initialization completed successfully", initialized);
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <>
        <ToastContainer
          toastClassName={() =>
            "relative flex py-4 px-3 rounded overflow-hidden cursor-pointer bg-white shadow-lg"
          }
          bodyClassName={() => "text-black text-base font-normal"}
          position="bottom-left"
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={false}
          closeButton={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <App />
      </>
    );
  },
  (error: CometChat.CometChatException) => {
    console.log("Initialization failed with error:", error);
  }
);
