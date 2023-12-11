import axios from "axios";
import React from "react";

export default function LoginForm() {
  function handleSubmit(event) {
    const email = event.target[0].value;
    const password = event.target[1].value;
    var to_send = {
      email: email,
      password: password,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    console.log(email);
    axios
      .post("http://localhost:3001/api/user/login-user", to_send, {
        headers,
      })
      .then((res) => {
        console.log(res.headers);
        const token = res.headers["authorization"];
        localStorage.setItem("authorization", token);
        //faire changer de page ici
      })
      .catch((error) => {
        console.log(error);
      });

    event.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" id="email" />
      <br />
      <input type="password" name="password" id="password" />
      <br />

      <button type="submit">Se sonnecter</button>
    </form>
  );
}
