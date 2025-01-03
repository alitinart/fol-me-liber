import { useParams } from "react-router";
import MessageBox from "../components/Chat/MessageBox/MessageBox";
import MessageHistory from "../components/Chat/MessageHistory/MessageHistory";
import { useDispatch } from "react-redux";
import Sidebar from "../components/layout/Sidebar/Sidebar";

export default function Chat() {
  const { collectionId } = useParams();
  const dispatch = useDispatch();

  dispatch({ type: "changeCollection", payload: collectionId });

  return (
    <>
      <Sidebar />
      <div className="chat">
        <MessageHistory />
        <MessageBox />
      </div>
    </>
  );
}
