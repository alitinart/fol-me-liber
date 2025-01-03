import { BsPlus, BsX } from "react-icons/bs";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import State from "../../../util/state.model";
import { useEffect, useState } from "react";
import BookItem from "../BookItem/BookItem";
import SidebarOpener from "./SidebarOpener";
import requests from "../../../services/requests.provider";
import Loading from "../Loading/Loading";

export default function Sidebar() {
  const isSidebarOpen = useSelector((state: State) => state.app.isSidebarOpen);
  const books = useSelector((state: State) => state.ingest.collections);
  const collectionId = useSelector((state: State) => state.app.collectionId);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const data = requests.getAllBooks();
      dispatch({ type: "loadCollections", payload: data });
      setLoading(false);
    };

    fetchBooks();
  }, [dispatch]);

  return (
    <div className={`sidebar ${!isSidebarOpen ? "sidebar-closed" : ""}`}>
      <div className="sidebar-header">
        <button
          onClick={() => {
            dispatch({ type: "toggleIngestModal" });
            dispatch({ type: "toggleSidebar" });
          }}
        >
          <BsPlus size={30} />
        </button>
        <button
          className="close-sidebar-mobile"
          onClick={() => {
            dispatch({ type: "toggleSidebar" });
          }}
        >
          <BsX size={30} />
        </button>
      </div>
      {books.length > 0 ? (
        <div className="books">
          {books.map((bookData) => {
            return (
              <BookItem
                isActive={collectionId === bookData.id}
                key={bookData.id}
                {...bookData}
              />
            );
          })}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-full -m-16">
          <Loading />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full -m-16">
          <h1 className="text-gray-400 font-bold opacity-60">
            No books uploaded
          </h1>
        </div>
      )}
      <SidebarOpener />
    </div>
  );
}
