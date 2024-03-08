import { CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Loading() {
  return (
    <div className="mt-10">
      <SyncLoader
        color={"#9ca3af"}
        loading={true}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
