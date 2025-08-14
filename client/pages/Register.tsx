import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to signup page
    navigate("/signup", { replace: true });
  }, [navigate]);

  return null;
}
