import "./Header.css";
import logo from "../../../assets/logo.png";

export default function Header() {
  return (
    <div
      className={`flex items-center gap-4 p-5 fixed z-50 inset-x-0 max-w-max md:bottom-3 md:mx-0 mx-auto default-duration`}
    >
      <img className="w-16" src={logo} alt="" />
      <p className="font-bold uppercase text-white">Fol Me Libër</p>
    </div>
  );
}
