import axios from "axios";
import React from "react";

export default function LoginForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    var to_send = {
      email: formData.get("login-email"),
      password: formData.get("login-password"),
    };
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://localhost:3001/api/user/login", to_send, {
        headers,
      })
      .then((res) => {
        const token = res.headers["authorization"];
        localStorage.setItem("authorization", token);
        alert("Success!");
        //faire changer de page ici
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 400) {
          alert("combinaison email + mot de passe fausse");
        }
        if (error.response?.status === 500) {
          alert("probleme venant du serveur (réessayer plus tard)");
        }
      });

    event.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="login-email" id="login-email" />
      <br />
      <input type="password" name="login-password" id="login-password" />
      <br />

      <button type="submit">Se sonnecter</button>
    </form>
  );
}
