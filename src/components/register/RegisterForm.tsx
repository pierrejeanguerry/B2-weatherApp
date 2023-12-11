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
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const userName = formData.get("userName");
    const email = formData.get("email");
    const password = formData.get("password");
    const repeatPassword = formData.get("repeatPassword");

    var to_send = {
      username: userName,
      email: email,
      first_name: firstName,
      second_name: lastName,
      password: password,
      repeatPassword: repeatPassword,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://localhost:3001/api/user/create-user", to_send, {
        headers,
      })
      .then((res: AxiosResponse) => {
        console.log(res);
        // if (res.status === 200) {
        //   navigate("/login");
        // }
      })
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.message === "NOT_ALL_DATA") {
        }
        if (error.message === "PASSWORD_IS_NOT_EQUIVALENT") {
        }
        if (error.message === "INTERNAL_ERROR") {
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
