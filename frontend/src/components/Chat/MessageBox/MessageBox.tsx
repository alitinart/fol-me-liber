import { FormEvent, useState } from "react";
import { BsSend } from "react-icons/bs";
import "./MessageBox.css";
import { useDispatch, useSelector } from "react-redux";
import requests, { sseRequests } from "../../../services/requests.provider";
import State from "../../../util/state.model";

export default function MessageBox() {
  const [userQuestion, setUserQuestion] = useState("");
  const dispatch = useDispatch();

  const { collectionId } = useSelector((state: State) => state.app);
  const { isLoading, messages } = useSelector((state: State) => state.chat);

  const hasMessages = messages.length !== 0;

  const onAsk = async (event: FormEvent) => {
    event.preventDefault();
    dispatch({ type: "startLoading" });

    const newMessage = {
      type: "USER",
      content: userQuestion,
      ts: new Date().toString(),
    };
    dispatch({ type: "addMessage", payload: newMessage });
    setUserQuestion("");

    let typingMessage = "";
    let guid = "";
    await sseRequests.session({
      onConnect: (tguid: string) => {
        guid = tguid;
      },
      onMessage: (ev) => {
        const text = ev.text;
        typingMessage = typingMessage + text;
        dispatch({ type: "streamText", payload: text });
      },
      serviceRequest: async () => {
        await requests.ask(userQuestion, collectionId, guid);
      },
      onClose: () => {
        const newAIMessage = {
          type: "AI",
          content: typingMessage,
          ts: new Date().toString(),
        };
        dispatch({ type: "addMessage", payload: newAIMessage });
        dispatch({ type: "streamingDone" });
        dispatch({ type: "stopLoading" });
      },
      onError: () => {
        console.log("ERR");
        const newAIMessage = {
          type: "AI",
          content:
            "# Error Occurred while asking model\nPlease try again later",
          ts: new Date().toString(),
        };
        dispatch({ type: "addMessage", payload: newAIMessage });
        dispatch({ type: "stopLoading" });
      },
    });
  };

  return (
    <div
      className={`p-5 message-input-box ${
        !hasMessages
          ? "message-input-box-pre-anim"
          : "message-input-box-post-anim"
      }`}
    >
      {!hasMessages ? (
        <h1 className="text-center mb-10 text-white font-extrabold text-3xl">
          What can I help you with ?
        </h1>
      ) : (
        <></>
      )}
      <form className="input-box" onSubmit={onAsk}>
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          className="w-full"
          placeholder={
            !isLoading ? "Type your question ..." : "Generating Response"
          }
          required
          disabled={isLoading}
        />
        <button className="message-submit" type="submit">
          <BsSend size={20} />
        </button>
      </form>
    </div>
  );
}
