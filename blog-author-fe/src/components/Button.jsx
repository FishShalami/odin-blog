//components/Button.js

import { useNavigate } from "react-router-dom";

const Button = ({ to, label }) => {
  const navigate = useNavigate();

  return (
    <button className="my-button" onClick={() => navigate(`/${to}`)}>
      {label}
    </button>
  );
};

export default Button;
