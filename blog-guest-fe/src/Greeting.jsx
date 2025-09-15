import Button from "./components/Button";

function Greeting() {
  return (
    <div>
      <h1>Let's get started</h1>
      <Button to="login" label="Login" />
      <Button to="signup" label="Signup" />
    </div>
  );
}

export default Greeting;
