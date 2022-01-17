import { authService, dbService } from "fbase";
import react, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Profile = ({userObject, refreshUser}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
    
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    // to see only your tweets
    const getMyTweets = async() =>{
        const tweets = await dbService.collection("tweets").where("creatorId", "==", userObject.uid).orderBy("createdAt", "desc").get();
        console.log(tweets.docs.map(doc => doc.data()));
    }

    useEffect(() => {
        getMyTweets();
    }, []);

    const onSubmit = async (event) =>{
        event.preventDefault();
        if(userObject.displayName !== newDisplayName){
            await userObject.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    }

    const onChange = (event) =>{
        const {target:{value}} = event;
        setNewDisplayName(value);
    }
    
    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Change your name" value={newDisplayName}/>
                <input type="submit" value="Update profile"/>
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}
export default Profile;