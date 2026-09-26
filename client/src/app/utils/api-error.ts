export const API_ERROR_EVENT = "app:api-error";

// Tells the app-wide notice (components/api-error-notice) to show a message.
export const reportApiError = (message: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: message }));
  }
};
