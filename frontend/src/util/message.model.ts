export default interface Message {
  type: "USER" | "AI";
  content: string;
  ts: any;
}
