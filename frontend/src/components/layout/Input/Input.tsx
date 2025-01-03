import { InputHTMLAttributes } from "react";
import "./Input.css";

interface Props {
  type: string;
  value: any;
  setValue: any;
  inputAttributes: InputHTMLAttributes<any>;
}

export default function Input(props: Props) {
  return (
    <input
      className="form-control"
      type={props.type}
      value={props.value}
      onChange={(e) => props.setValue(e.target.value)}
      {...props.inputAttributes}
    />
  );
}
