import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import State from "../../../util/state.model";

export default function SidebarOpener() {
  const isSidebarOpen = useSelector((state: State) => state.app.isSidebarOpen);
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => dispatch({ type: "toggleSidebar" })}
      className={`sidebar-opener`}
    >
      {isSidebarOpen ? <BsCaretLeftFill /> : <BsCaretRightFill />}
    </div>
  );
}
