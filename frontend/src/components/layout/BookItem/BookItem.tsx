import { BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router";
import requests from "../../../services/requests.provider";
import { useDispatch } from "react-redux";
import "./BookItem.css";

export default function BookItem(props: {
  id: string;
  collectionName: string;
  thumbnail?: string;
  title?: string;
  pages?: number;
  isActive: boolean;
  className?: string;
}) {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const onDelete = async () => {
    await requests.deleteBook(props.id);
    const data = requests.getAllBooks();
    dispatch({ type: "loadCollections", payload: data });
    nav("/chat");
  };

  return (
    <div
      className={`book-item my-5 ${props.isActive ? "book-item-active" : ""} ${
        props.className
      }`}
    >
      <div
        onClick={() => nav(`/chat/${props.id}`)}
        className="flex cursor-pointer"
      >
        <img
          src={props.thumbnail}
          alt={props.title}
          className="book-item-thumbnail"
        />
        <div className="book-info">
          <h1>{props.title}</h1>
          <p>{props.pages} PAGES</p>
        </div>
      </div>
      <BiTrash size={15} className="book-item-delete-icon" onClick={onDelete} />
    </div>
  );
}
