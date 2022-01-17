import { authService, dbService } from "fbase";
import react, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Profile = ({userObject, refreshUser}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
    const [newPhotoURL, setNewPhotoURL] = useState(userObject.photoURL);
    
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
            console.log(userObject)
            refreshUser();
        }
        if(userObject.photoURL !== newPhotoURL){
            await userObject.updateProfile({
                displayName: newDisplayName,
            });
            console.log(userObject)
            refreshUser();
        }
    }

    const onChange = (event) =>{
        const {target:{value}} = event;
        setNewDisplayName(value);
    }
    
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" placeholder="Change your name" value={newDisplayName} className="formInput" autoFocus/>
                <input type="submit" value="Update user name" className="formBtn" style={{
                    marginTop: 10,
                }}/>
                <input type="submit" value="Update profile photo" className="formBtn" style={{
                    marginTop: 10,
                }}/>
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
}
export default Profile;