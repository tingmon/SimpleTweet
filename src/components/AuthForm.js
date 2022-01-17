import { authService } from "fbase";
import react, { useState } from "react";

const AuthForm =() => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);

    const onChange = (event) =>{
        console.log(event.target.name);
        // console.log(event.target.value);
        const {target: {name, value}} = event;
        console.log(value);
        if(name === "email"){
            setEmail(value)
        }
        else if(name === "password"){
            setPassword(value);
        }
    }
    
    const onSubmit = async (event) =>{
        event.preventDefault();
        try{
            let data;
            if(newAccount){
                // create account
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                );
            }
            else{
                // login
                data = await authService.signInWithEmailAndPassword(
                    email, password
                );
            }
            console.log(data);
        }
        catch(error){
            setError(error.message);
        }
    }
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return(
    <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} name="email" type="email" placeholder="Email" required value={email}></input>
            <input onChange={onChange} name="password" type="password" placeholder="Password" required value={password}></input>
            <input type="submit" value={newAccount ? "Create Account" : "Sign In"}></input>
            {error}
        </form>
        <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
    </>
    )
}

export default AuthForm;