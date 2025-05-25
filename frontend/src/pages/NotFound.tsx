
import ActionButtons from "./ActionButtons";

export default function NotFound() {
  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <ActionButtons showHomeButton={true} showAddButton={false} showHistoryButton={false} />
    </div>
  );
}
