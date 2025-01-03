import { useState } from "react";
import Input from "../layout/Input/Input";
import { Link } from "react-router-dom";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

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
      <Input
        type="text"
        value={retypePassword}
        setValue={setRetypePassword}
        inputAttributes={{
          required: true,
          placeholder: "Retype Password",
        }}
      />
      <p className="text-white text-center mt-2">
        Already have an account ?{" "}
        <span className="text-primary font-bold cursor-pointer">
          <Link to={"/auth/login"}>Login</Link>
        </span>
      </p>
      <button type="submit" className="submit-button">
        Sign Up
      </button>
    </form>
  );
}
