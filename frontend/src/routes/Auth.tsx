import { useParams } from "react-router";
import LoginForm from "../components/Auth/LoginForm";
import SignUpForm from "../components/Auth/SignUpForm";

export default function Auth() {
  const { mode } = useParams();

  return (
    <div className="w-full h-screen flex content-center items-center">
      <div className="m-auto">
        <h1 className="text-white font-extrabold text-3xl mb-2">
          Start learning in a new way
        </h1>
        {mode === "login" ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
}
