import React, { useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import FieldRegister from "./FieldRegister";

export default function RegisterForm() {
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [repeatPassword, setRepeatPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    var to_send = {
      username: formData.get("userName"),
      email: formData.get("email"),
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      password: formData.get("password"),
      repeatPassword: formData.get("repeatPassword"),
    };
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://localhost:3001/api/user/register", to_send, {
        headers,
      })
      .then((res: AxiosResponse) => {
        console.log(res);
        if (res.status === 20) {
          alert("success !");
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 409) {
          // email utilisé
          alert("email deja utilisé");
        }
        if (error.response?.status === 403) {
          //un petit malin a envoyé les mauvaise données
          alert("veillez a envoyer les bonnes données...");
        }
        if (error.response?.status === 400) {
          //mot de passe et repeter mot de passe differents
          alert("mot de passe et repeter mot de passe differents");
        }
        if (error.response?.status === 500) {
          // probleme venant du serveur (réessayer plus tard)
          alert("probleme venant du serveur (réessayer plus tard)");
        }
      });

    event.preventDefault();
  }
  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="inscription-form w-2/5 m-24 flex flex-col"
    >
      <FieldRegister
        type="text"
        name="userName"
        id="userName"
        value={userName}
        onChange={setUserName}
        placeholder="Nom d'utilisateur"
        boolean={false}
        errorText="Nom d'utilisateur trop long"
      />
      <FieldRegister
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={setFirstName}
        placeholder="Prenom"
        boolean={false}
        errorText="Prénom trop long"
      />
      <FieldRegister
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={setLastName}
        placeholder="Nom de famille"
        boolean={false}
        errorText="Nom de famille trop long"
      />
      <p className="text-red-500 text-xs italic">
        {false ? "Cet email est deja utilisé" : <br />}
      </p>
      <FieldRegister
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={setEmail}
        placeholder="Email"
        boolean={false}
        errorText="Entrez une adresse mail valide"
      />

      <FieldRegister
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={setPassword}
        placeholder="Mot de passe"
        boolean={false}
        errorText="Le mot de passe doit contenir au moins 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spécial (!?,.;/:*) et faire 10 caractères minimum"
      />
      <FieldRegister
        type="password"
        name="repeatPassword"
        id="repeatPassword"
        value={repeatPassword}
        onChange={setRepeatPassword}
        placeholder="Répéter mot de passe"
        boolean={false}
        errorText="Les mots de passe doivent être similaires"
      />
      <div className="flex items-center justify-between">
        <button
          className="bg-[#310046] hover:bg-[#470863] text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Inscription
        </button>
      </div>
    </form>
  );
}
