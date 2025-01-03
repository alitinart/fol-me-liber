import Action from "../../util/action.model";

const initalState = {
  messages: [],
  isLoading: false,
};

export default function chatReducer(state = initalState, action: Action) {
  switch (action.type) {
    case "addMessage": {
      const messages = [...state.messages, action.payload];
      return {
        ...state,
        messages,
      };
    }
    case "startLoading":
      return {
        ...state,
        isLoading: true,
      };
    case "stopLoading":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
