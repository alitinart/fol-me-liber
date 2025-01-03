import Action from "../../util/action.model";

const initalState = {
  typingMessage: "",
};

export default function streamTextReducer(state = initalState, action: Action) {
  switch (action.type) {
    case "streamText":
      return {
        ...state,
        typingMessage: `${state.typingMessage}${action.payload}`,
      };
    case "streamingDone":
      return {
        ...state,
        typingMessage: "",
      };
    default:
      return state;
  }
}
