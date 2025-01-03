import Action from "../../util/action.model";

const initialState = {
  isSidebarOpen: true,
  isIngestModalOpen: false,
  collectionId: "",
};

export default function appReducer(state = initialState, action: Action) {
  switch (action.type) {
    case "toggleSidebar":
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    case "toggleIngestModal":
      return {
        ...state,
        isIngestModalOpen: !state.isIngestModalOpen,
      };
    case "changeCollection":
      return {
        ...state,
        collectionId: action.payload,
      };
    default:
      return state;
  }
}
