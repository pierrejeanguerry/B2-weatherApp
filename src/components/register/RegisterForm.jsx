import React, { useState } from "react";
import axios from "axios";
import FieldRegister from "./FieldRegister";
export default function RegisterForm() {
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [repeatPassword, setRepeatPassword] = useState("");
  let [passIsWrong, setPassIsWrong] = useState(false);
  let [repeatPassIsWrong, setRepeatPassIsWrong] = useState(false);
  let [emailIsWrong, setEmailIsWrong] = useState(false);
  let [userNameIsWrong, setUserNameIsWrong] = useState(false);
  let [firstNameIsWrong, setFirstNameIsWrong] = useState(false);
  let [lastNameIsWrong, setLastNameIsWrong] = useState(false);
  let [emailUsed, setEmailUsed] = useState(false);

  function handleSubmit(event) {
    const firstName = event.target[0].value;
    const lastName = event.target[1].value;
    const userName = event.target[2].value;
    const email = event.target[3].value;
    const password = event.target[4].value;
    const repeatPassword = event.target[5].value;
    const regexEmail =
      /^(?=[\s\S]{1,300}$)[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!?,.;/:*])[A-Za-z\d!?,.;/:*]{10,1024}$/;
    setPassIsWrong(!regexPassword.test(password));
    setEmailIsWrong(!regexEmail.test(email));
    setRepeatPassIsWrong(password !== repeatPassword);
    setUserNameIsWrong(userName.length > 50);
    setFirstNameIsWrong(firstName.length > 50);
    setLastNameIsWrong(lastName.length > 50);
    if (
      !(
        repeatPassIsWrong ||
        emailIsWrong ||
        userNameIsWrong ||
        passIsWrong ||
        firstNameIsWrong ||
        lastNameIsWrong
      )
    ) {
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
        .then((res) => {
          console.log(res);
          // if (res.status === 200) {
          //   navigate("/login");
          // }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data === "NOT_ALL_DATA") {
            setPassIsWrong(!regexPassword.test(password));
            setEmailIsWrong(!regexEmail.test(email));
            setUserNameIsWrong(userName.length > 50);
            setFirstNameIsWrong(firstName.length > 50);
            setLastNameIsWrong(lastName.length > 50);
          }
          if (error.response.data === "PASSWORD_IS_NOT_EQUIVALENT") {
            setRepeatPassIsWrong(true);
          }
          if (error.response.data === "INTERNAL_ERROR") {
            setEmailUsed(true);
          }
        });
    }
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
        boolean={userNameIsWrong}
        errorText="Nom d'utilisateur trop long"
      />
      <FieldRegister
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={setFirstName}
        placeholder="Prenom"
        boolean={firstNameIsWrong}
        errorText="Prénom trop long"
      />
      <FieldRegister
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={setLastName}
        placeholder="Nom de famille"
        boolean={lastNameIsWrong}
        errorText="Nom de famille trop long"
      />
      <p className="text-red-500 text-xs italic">
        {emailUsed ? "Cet email est deja utilisé" : <br />}
      </p>
      <FieldRegister
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={setEmail}
        placeholder="Email"
        boolean={emailIsWrong}
        errorText="Entrez une adresse mail valide"
      />

      <FieldRegister
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={setPassword}
        placeholder="Mot de passe"
        boolean={passIsWrong}
        errorText="Le mot de passe doit contenir au moins 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spécial (!?,.;/:*) et faire 10 caractères minimum"
      />
      <FieldRegister
        type="password"
        name="repeatPassword"
        id="repeatPassword"
        value={repeatPassword}
        onChange={setRepeatPassword}
        placeholder="Répéter mot de passe"
        boolean={repeatPassIsWrong}
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
