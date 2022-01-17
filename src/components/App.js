import React, { useState, useEffect } from "react";
import { Router } from "react-router-dom";
// used jsconfig.json setting instead of using absolute path
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObject, setUserObject] = useState(null);
  console.log(authService.currentUser);

  useEffect(()=>{
    authService.onAuthStateChanged((user) => {
      if(user){
        // setIsLoggedIn(true);
        setUserObject({
          displayName: user.displayName,
          uid: user.uid,
          // inside user object, there is updateProfile function
          // check Profile.js if you want to see how this function works.
          updateProfile: (args) => user.updateProfile(args),
        });
        console.log(userObject);
      }
      else{
        setUserObject(null);
      }
      // else{
      //   setIsLoggedIn(false);
      // }
      setInit(true);
    });
  }, [])

  // if you simplely pass user object to other components, react won't
  // apply the change(it happened but not applied) cause user object is too big.
  const refreshUser = () =>{
    const user = authService.currentUser; // too big object for noticing subtle change.
    setUserObject({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObject)} userObject={userObject}></AppRouter> : "Please Wait..."}
      <footer>&copy; {new Date().getFullYear()} Simple Tweet </footer>
    </>
  );
}

export default App;
