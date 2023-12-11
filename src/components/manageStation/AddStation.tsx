import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";

export default function AddStation() {
  let [mac, setMac] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const macAdress = formData.get("macAdress");
    const headers = {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("authorization"),
    };
    var to_send = {
      macAdress: formData.get("macAdress"),
    };
    axios
      .post("http://localhost:3001/api/user/add-station", to_send, { headers })
      .then((res: AxiosResponse) => {
        console.log(res);
        if (res.status === 200) {
          alert("success !");
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 409) {
          // station appartien deja quelqu'un
          alert("station appartien deja quelqu'un");
        }
        if (error.response?.status === 402) {
          //pas connecté ?!
          alert("pas connecté ?!");
        }
        if (error.response?.status === 403) {
          //un petit malin a envoyé les mauvaise données
          alert("veillez a envoyer les bonnes données...");
        }
        if (error.response?.status === 400) {
          //station n'existe pas
          alert("station n'existe pas");
        }
        if (error.response?.status === 500) {
          // probleme venant du serveur (réessayer plus tard)
          alert("probleme venant du serveur (réessayer plus tard)");
        }
      });
    event.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="macAdress" name="macAdress" />
      <button type="submit">Ajouter</button>
    </form>
  );
}
