/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AxError } from "../util/request-error.model";
import BookCollection from "../util/book-collection.model";

const API_URL = "http://localhost:8080";

const BOOKS_STORAGE_KEY = "uploaded_books";
const DEFAULT_BOOKS_STORAGE_VALUE = "[]";

const requests = {
  ask: async (userQuestion: string, collectionId: string, guid: string) => {
    await axios.post(`${API_URL}/api/v1/assistant/ask`, {
      userQuestion,
      collectionId,
      guid,
    });
  },
  getAllBooks: () => {
    const strBooks = localStorage.getItem(BOOKS_STORAGE_KEY);
    if (!strBooks) return [];

    return JSON.parse(strBooks);
  },
  deleteBook: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/v1/book/${id}`);
      removeBookFromStorage(id);
    } catch (e: any) {
      if (e instanceof AxiosError) return toastError(e);
    }
    toast.success("Book deleted");
  },
};

const sseRequests = {
  session: async ({
    onConnect,
    onMessage,
    serviceRequest,
    onClose,
    onError,
  }: {
    onConnect: (guid: string) => any;
    onMessage: (result: any) => any;
    onClose: (event: any) => any;
    onError?: (e: any) => any;
    serviceRequest: () => any;
  }) => {
    const eventSource = new EventSource(
      "http://localhost:8080/api/v1/assistant/session"
    );
    let guid = "";

    eventSource.addEventListener("GUI_ID", async (event) => {
      guid = JSON.parse(event.data);
      console.log(`Guid: ${guid}`);
      onConnect(guid);

      eventSource.addEventListener(guid, (event) => {
        const result = JSON.parse(event.data);
        onMessage(result);
        if (result === "100") {
          eventSource.close();
        }
      });
      try {
        await serviceRequest();
      } catch (e: any) {
        onError!(e);
      }
    });

    eventSource.onerror = (event: any) => {
      if (event.target.readyState === EventSource.CLOSED) {
        console.log("SSE closed (" + event.target.readyState + ")");
      }
      onClose(event);
      eventSource.close();
    };

    eventSource.onopen = () => {
      console.log("Connection Opened");
    };
  },
};

const toastError = (e: AxError) =>
  toast.error(
    `${e.response?.data.title || "Internal Server Error"}\n${
      e.response?.data.message || ""
    }`
  );

const addNewBookToStorage = (book: BookCollection) => {
  let strBooks = localStorage.getItem(BOOKS_STORAGE_KEY);
  if (!strBooks) {
    localStorage.setItem(BOOKS_STORAGE_KEY, DEFAULT_BOOKS_STORAGE_VALUE);
    strBooks = DEFAULT_BOOKS_STORAGE_VALUE;
  }

  const currentBooks: BookCollection[] = JSON.parse(strBooks);
  currentBooks.push(book);
  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(currentBooks));
};

const removeBookFromStorage = (bookId: string) => {
  const currentBooks: BookCollection[] = requests.getAllBooks();
  const filteredBooks = currentBooks.filter((book) => book.id !== bookId);
  localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(filteredBooks));
};

export { sseRequests, addNewBookToStorage };
export default requests;
