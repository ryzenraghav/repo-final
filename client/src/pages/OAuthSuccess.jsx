import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OAuthSuccess mounted");
    console.log("OAuthSuccess URL:", window.location.href);

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("Token from URL:", token);

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    // ✅ store token
    sessionStorage.setItem("token", token);
    console.log("Saved token:", sessionStorage.getItem("token"));

    // ✅ small delay avoids redirect race
    setTimeout(() => {
      navigate("/report", { replace: true });
    }, 100);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in…
    </div>
  );
}
