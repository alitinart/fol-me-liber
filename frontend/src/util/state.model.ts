import BookCollection from "./book-collection.model";
import Message from "./message.model";

export default interface State {
  chat: {
    isLoading: boolean;
    messages: Message[];
  };
  streamText: {
    typingMessage: string;
  };
  app: {
    isSidebarOpen: boolean;
    isIngestModalOpen: boolean;
    collectionId: string;
  };
  ingest: {
    collections: BookCollection[];
  };
}
