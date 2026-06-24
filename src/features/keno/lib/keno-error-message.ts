import axios from "axios";

export function getKenoErrorMessage(error: unknown) {
  if (!error) {
    return null;
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  }

  return "Unable to complete the request";
}
