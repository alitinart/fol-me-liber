import { useState } from "react";
import Input from "../layout/Input/Input";
import "./form.css";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="auth-form">
      <Input
        type="text"
        value={email}
        setValue={setEmail}
        inputAttributes={{
          required: true,
          placeholder: "Email",
        }}
      />
      <Input
        type="text"
        value={password}
        setValue={setPassword}
        inputAttributes={{
          required: true,
          placeholder: "Password",
        }}
      />
      <p className="text-white text-center mt-2">
        Don't have an account ?{" "}
        <span className="text-primary font-bold cursor-pointer">
          <Link to={"/auth/signup"}>Sign up</Link>
        </span>
      </p>
      <button type="submit" className="submit-button">
        Login
      </button>
    </form>
  );
}
