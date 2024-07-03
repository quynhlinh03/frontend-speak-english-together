import { notificationShow } from "../components/Notification";

type ErrorObject = {
  code: string;
  message: string;
  response: {
    status: number;
    data: {
      error: string;
      message: string;
    };
  };
};

export const handleGlobalException = (
  error: ErrorObject,
  customError: () => void
) => {
  if (error.code === "ERR_NETWORK") {
    notificationShow("error", "Error!", error.message);
  } else if ([403, 404, 500, 400, 409].includes(error.response.status)) {
    notificationShow("error", "Error!", error.response.data.message);
  } else if (error.response.status === 401) {
    localStorage.clear();
    window.location.reload();
  } else {
    customError();
  }
};
