import React, { useState } from "react";
import { login } from "../lib/auth";

type LoginFormProps = {
  onLogin: (user: string) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    const user = await login(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError(true);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="message is-danger">
              <p className="message-body">Login failed</p>
            </div>
          )}
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-link">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
