import "./MessageHistory.css";
import Message from "./Message/Message";
import { useSelector } from "react-redux";
import State from "../../../util/state.model";
import LoadingTyping from "../../layout/LoadingTyping/LoadingTyping";

export default function MessageHistory() {
  const { messages, isLoading } = useSelector((state: State) => {
    return state.chat;
  });
  const { typingMessage } = useSelector((state: State) => state.streamText);

  return (
    <div className="message-history">
      {messages.map((message) => {
        return <Message key={message.ts} {...{ ...message }} />;
      })}
      {isLoading && typingMessage === "" ? <LoadingTyping /> : <></>}
      {typingMessage ? (
        <Message key={1} content={typingMessage} type="AI" ts={null} />
      ) : (
        <></>
      )}
    </div>
  );
}
