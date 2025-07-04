import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#0077cc", color: "white" }}>
      <Link to="/" style={{ marginRight: "20px", color: "white" }}>Home</Link>
      <Link to="/diagnose" style={{ color: "white" }}>Diagnose</Link>
    </nav>
  );
}
