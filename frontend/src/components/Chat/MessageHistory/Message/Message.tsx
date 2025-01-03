import Markdown from "react-markdown";
import * as MessageType from "../../../../util/message.model";

import "./Message.css";

export default function Message({ type, content, ts }: MessageType.default) {
  return (
    <div className={`message message-${type}`}>
      <div className="avatar"></div>
      <div className="content">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
