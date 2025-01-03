import { useDispatch, useSelector } from "react-redux";
import "./IngestModal.css";
import State from "../../util/state.model";
import { FormEvent, useState } from "react";
import { BiX } from "react-icons/bi";
import toast from "react-hot-toast";
import Loading from "../layout/Loading/Loading";
import requests, {
  addNewBookToStorage,
  sseRequests,
} from "../../services/requests.provider";
import axios from "axios";

export default function IngestModal() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [allowUpload, setAllowUpload] = useState(true);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  const isModalOpen = useSelector(
    (state: State) => state.app.isIngestModalOpen
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!allowUpload) {
      return;
    }

    if (pdf === null) {
      return;
    }
    const collectionName = bookTitle.toLowerCase().replace(/\s+/g, "-");
    const data = new FormData();
    data.append("bookTitle", bookTitle);
    data.append("collectionName", collectionName);
    data.append("file", pdf);

    await sseRequests.session({
      onConnect: (guid) => {
        setAllowUpload(false);
        data.append("guid", guid);
      },
      onMessage: (result: number) => {
        if (progress !== result) {
          setProgress(result);
        }
      },
      onClose: () => {
        setProgress(0);
      },
      serviceRequest: () => {
        ingestBook("http://localhost:8080/api/v1/assistant/ingest", data);
      },
    });
  };

  const ingestBook = async (url: string, data: FormData) => {
    console.log("Ingest Book");
    try {
      const res = await axios.post(url, data);
      addNewBookToStorage(res.data);
      toast.success(`Book Ingested Sucessfully`);
    } catch {
      toast.error("Error while Ingesting Book");
    }

    setAllowUpload(true);
    closeModal();
    setProgress(0);
    setPdf(null);
    setBookTitle("");
    fetchBooks();
  };

  const fetchBooks = async () => {
    const data = requests.getAllBooks();
    dispatch({ type: "loadCollections", payload: data });
  };

  const closeModal = () => dispatch({ type: "toggleIngestModal" });

  return isModalOpen ? (
    <div className="ingest-modal">
      {progress === 0 ? (
        <div className="modal">
          <h1 className="text-2xl font-extrabold">Add your book</h1>
          <BiX className="close-modal" size={25} onClick={closeModal} />

          <form onSubmit={onSubmit} className="modal-form">
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="form-control form-control-outline"
              placeholder="Book Title"
              required
            />
            <input
              type="file"
              onChange={(e) => {
                const files = e.currentTarget.files;
                if (files) setPdf(files[0]);
              }}
              required
              hidden
              name="file-upload"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn btn-primary w-full mb-5 "
            >
              {pdf ? pdf.name : "Upload Book"}
            </label>
            {allowUpload ? (
              <button
                disabled={!allowUpload}
                className="btn btn-primary"
                type="submit"
              >
                Submit
              </button>
            ) : (
              <Loading bg={"var(--primary)"} className="mx-auto my-3" />
            )}
          </form>
        </div>
      ) : (
        <div className="modal">
          <h1 className="text-2xl font-extrabold mb-5">
            Uploading: " {bookTitle} "
          </h1>
          <div className="w-full bg-background h-3 mb-4">
            <div
              className="bg-primary h-3 dark:bg-primary"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}
