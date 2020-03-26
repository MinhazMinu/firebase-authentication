import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../src/firebase.config";
firebase.initializeApp(firebaseConfig);

function App() {
  const [checked, setChecked] = useState(false);

  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    password: ""
  });

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        setUser({
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        setUser({
          isSignedIn: false,
          name: "",
          email: "",
          photo: "",
          error: ""
        });
      })
      .catch(function(error) {
        console.log(error.message);
      });
  };

  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const is_valid_password = pass =>
    /^(?=.*[0-9])(?=.*[@#$%^&*])[a-zA-Z0-9@#$%^&*]{7,15}$/.test(pass);

  const handleChange = e => {
    let is_valid = true;
    if (e.target.name === "email") {
      is_valid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      is_valid = is_valid_password(e.target.value);
    }

    const newUser = { ...user, [e.target.name]: e.target.value };
    newUser.isValid = is_valid;
    setUser(newUser);
  };

  const createAccount = e => {
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const creatUser = { ...user };
          creatUser.isSignedIn = true;
          creatUser.error = "";
          setUser(creatUser);
        })
        .catch(function(error) {
          const creatUser = { ...user };
          creatUser.isSignedIn = false;
          creatUser.error = error.message;
          setUser(creatUser);
          // ...
        });
    } else {
      console.log("notvalid");
    }
    e.preventDefault();
    e.target.reset();
  };

  const signIn = e => {
    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const creatUser = { ...user };
          creatUser.isSignedIn = true;
          creatUser.error = "";
          setUser(creatUser);
        })
        .catch(function(error) {
          const creatUser = { ...user };
          creatUser.isSignedIn = false;
          creatUser.error = error.message;
          setUser(creatUser);
          // ...
        });
    } else {
      console.log("notvalid");
    }
    e.preventDefault();
    e.target.reset();
  };

  return (
    <div className="App my-5">
      <h1 className="p-1">Sign in with Google</h1>
      {user.isSignedIn ? (
        <button className="btn btn-danger" onClick={handleSignOut}>
          Sign Out
        </button>
      ) : (
        <button className="btn btn-success" onClick={handleSignIn}>
          Sign In
        </button>
      )}
      <div>
        {user.isSignedIn && (
          <div className="d-flex justify-content-center">
            {user.photo ? (
              <img
                src={user.photo}
                alt="pic"
                className="img-fluid img-thumbnail  max-height: 10%"
              />
            ) : (
              ""
            )}
            <div>
              <p>Welcome {user.name} !</p>
              <p>Email: {user.email} </p>
            </div>
          </div>
        )}
      </div>
      <label htmlFor="chk" className="text-danger mt-5 pt-5">
        Already A User?{" "}
      </label>{" "}
      &nbsp;
      <input
        type="checkbox"
        name="switchForm"
        id="chk"
        onClick={() => setChecked(!checked)}
      />
      {checked ? (
        <>
          <h1 className="p-1 ">Sign in Using your email</h1>
          <form onSubmit={signIn}>
            <input
              type="text"
              name="email"
              placeholder="Your Email"
              onBlur={e => handleChange(e)}
              required
            />{" "}
            <br /> <br />
            <input
              type="password"
              name="password"
              placeholder=" password"
              onBlur={e => handleChange(e)}
              required
            />{" "}
            <br />
            <input
              type="submit"
              className="btn btn-primary my-5"
              value="Sign In"
            />
          </form>{" "}
        </>
      ) : (
        <>
          <h1 className="p-1">Sign Up Using your email</h1>
          <form onSubmit={createAccount}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onBlur={e => handleChange(e)}
              required
            />{" "}
            <br /> <br />
            <input
              type="text"
              name="email"
              placeholder="Your Email"
              onBlur={e => handleChange(e)}
              required
            />{" "}
            <br /> <br />
            <input
              type="password"
              name="password"
              placeholder=" password"
              onBlur={e => handleChange(e)}
              required
            />{" "}
            <br />
            <input
              type="submit"
              className="btn btn-primary my-5"
              value="Sign Up"
            />
          </form>
        </>
      )}
      {user.error ? <p className="text-danger">{user.error}</p> : ""}
    </div>
  );
}

export default App;
