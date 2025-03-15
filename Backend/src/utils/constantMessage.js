module.exports = {
  AUTH: {
    NO_TOKEN: "You are not logged in!",
    INVALID_TOKEN: "Invalid token!",
    USER_NOT_FOUND: "User does not exist.",
    PASSWORD_CHANGED: "Password changed recently! Log in again.",
    GET_SUCCESS: "Get User Success"
  },
  RESERVATION: {
    NOT_FOUND: "No reservations found.",
    INVALID_ID: "Invalid id! Try again",
    INVALID_STATUS: "Invalid reservation status.",
  },
  USER: {
    EMAIL_EXISTS: "Email already in use.",
    NOT_FOUND: "User not found.",
  },
  GENERAL: {
    SERVER_ERROR: "Something went wrong!",
    BAD_REQUEST: "Invalid request parameters.",
    FORBIDDEN: "You do not have permission.",
  },
  HOTEL: {
    NOT_FOUND: "No hotel found",
    INVALID_ID: "Invalid id!",
    SUCCESS: "Get hotel data success",
    CHECK_IN_DATE: "Check-in date cannot be before check-out date.",
    CHECK_OUT_DATE: "Check-out date cannot be in the past.",
    INVALID_ID: "Invalid id !",
    SUCCESS: "Get hotel data success",
    CHECK_IN_DATE: "CheckInDate cannot be before CheckOutDate",
    CHECK_OUT_DATE: "CheckOutDate cannot be in the past"
  },
  FEEDBACK: {
    NOT_FOUND: "No feedback found.",
    INVALID_STATUS: "Invalid feedback status.",
    SUCCESS: "Get feedback success",
  },
  ROOM: {
    NOT_FOUND: "No room found.",
    INVALID_ID: "Invalid id!",
    SUCCESS: "Get room success"
  },
  PAYMENT: {
    SUCCESS: "Payment success.",
    FAIL: "Payment failed! Check error in server.",
    CANCEL_SUCCESS: "Cancel payment success.",
    CANCEL_FAIL: "Cancel payment failed!"
  }
};
