const API_BASE_URL: string = "https://api.videosdk.live";
const VIDEOSDK_TOKEN: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3OGQwMzhmMy05NTNiLTQwNzEtYjJlNS03NDFiODk4ODExZGMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxNDc5MTIzNSwiZXhwIjoxNzE1Mzk2MDM1fQ.qFu6wdVlaXVw3MNttZx2dTwkY21FQy-3fu-kRo_kddI";
const API_AUTH_URL: string = "";

export const getToken = async (): Promise<string> => {
  if (VIDEOSDK_TOKEN && API_AUTH_URL) {
    console.error(
      "Error: Provide only ONE PARAMETER - either Token or Auth API"
    );
    throw new Error("Provide only ONE PARAMETER - either Token or Auth API");
  } else if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  } else if (API_AUTH_URL) {
    const res = await fetch(`${API_AUTH_URL}/get-token`, {
      method: "GET",
    });
    const { token } = await res.json();
    return token;
  } else {
    console.error("Error: ", Error("Please add a token or Auth Server URL"));
    throw new Error("Please add a token or Auth Server URL");
  }
};

interface CreateMeetingResponse {
  meetingId: string | null;
  err: string | null;
}

export const createMeeting = async ({ token }: { token: string }): Promise<CreateMeetingResponse> => {
  const url: string = `${API_BASE_URL}/v2/rooms`;
  const options: RequestInit = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const response: Response = await fetch(url, options)
  const data: { roomId?: string, error?: string } = await response.json()

  if (data.roomId) {
    return { meetingId: data.roomId, err: null }
  } else {
    return { meetingId: null, err: data.error || "Unknown error" }
  }

};

interface ValidateMeetingResponse {
  meetingId: string | null;
  err: string | null;
}

export const validateMeeting = async ({ roomId, token }: { roomId: string, token: string }): Promise<ValidateMeetingResponse> => {

  const url: string = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;

  const options: RequestInit = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const response: Response = await fetch(url, options)

  if (response.status === 400) {
    const data: string = await response.text()
    return { meetingId: null, err: data }
  }

  const data: { roomId?: string, error?: string } = await response.json()

  if (data.roomId) {
    return { meetingId: data.roomId, err: null }
  } else {
    return { meetingId: null, err: data.error || "Unknown error" }
  }

};
