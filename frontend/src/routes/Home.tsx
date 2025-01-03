import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import requests from "../services/requests.provider";
import State from "../util/state.model";
import BookItem from "../components/layout/BookItem/BookItem";
import "../components/Home/Home.css";

export default function Home() {
  const dispatch = useDispatch();
  const books = useSelector((state: State) => state.ingest.collections);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = requests.getAllBooks();
      dispatch({ type: "loadCollections", payload: data });
    };

    fetchBooks();
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <h1 className="text-2xl text-white font-bold">
        Select a book to chat with
      </h1>
      <div className="mt-5 select-books">
        {books.length > 0 ? (
          books.map((book) => {
            return (
              <BookItem
                key={book.id}
                className="book-home"
                {...book}
                isActive={false}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500 font-bold opacity-60">
              No books uploaded
            </p>
            <button
              className="btn mt-5"
              onClick={() => {
                dispatch({ type: "toggleIngestModal" });
              }}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
