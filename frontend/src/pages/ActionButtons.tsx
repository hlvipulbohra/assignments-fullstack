import { Link } from "react-router-dom";

const styles = {
  Link: {
    textDecoration: "none",
    marginRight: 20,
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: 5,
  },
};

interface ActionButtonsProps {
  showAddButton?: boolean;
  showHistoryButton?: boolean;
  showHomeButton?: boolean;
}

export default function ActionButtons({
  showAddButton = true,
  showHistoryButton = true,
  showHomeButton = false,
}: ActionButtonsProps) {
  return (
    <>
      {showAddButton && (
        <Link to="/" style={styles.Link}>
          Add Another Resume
        </Link>
      )}

      {showHistoryButton && (
        <Link to="/history" style={styles.Link}>
          View All Resumes
        </Link>
      )}

      {showHomeButton && (
        <Link to="/" style={styles.Link}>
          Go to Home Page
        </Link>
      )}
      
    </>
  );
}
