import Action from "../../util/action.model";

const initialState = {
  collections: [],
};

export default function ingestReducer(state = initialState, action: Action) {
  switch (action.type) {
    case "loadCollections": {
      const collections = action.payload;
      return { ...state, collections };
    }

    default:
      return state;
  }
}
