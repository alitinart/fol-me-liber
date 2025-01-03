import Action from "../../util/action.model";

const initialState = {
  token: null,
};

export default function AuthReducer(state = initialState, action: Action) {
  switch (action.type) {
    case "login":
      return { ...state, token: action.payload };
    case "logout":
      return { ...state, token: null };
    default:
      return state;
  }
}
