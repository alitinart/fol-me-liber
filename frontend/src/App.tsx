import "./App.css";
import { Route, Routes } from "react-router";
import Chat from "./routes/Chat";
import { Toaster } from "react-hot-toast";
import Auth from "./routes/Auth";
import Home from "./routes/Home";
import IngestModal from "./components/IngestModal/IngestModal";
import Header from "./components/layout/Header/Header";

function App() {
  return (
    <>
      <Header />
      <main className="view">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Home />} />
          <Route path="/chat/:collectionId" element={<Chat />} />
          <Route path="/auth/:mode" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        <Toaster />
        <IngestModal />
      </main>
    </>
  );
}

export default App;
