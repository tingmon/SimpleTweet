import { dbService, storageService } from "fbase";
import react, { useState } from "react";

const Tweet = ({tweetObject, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObject.text);

    const onDeleteClick = async () =>{
        const ok = window.confirm("Are you sure?");
        if(ok){
            // doc = documentReference
            // it is like path on the file system(explorer)
            await dbService.doc(`tweets/${tweetObject.id}`).delete();
            if(tweetObject.imgFfileUrl !== "")
            {
                await storageService.refFromURL(tweetObject.imgFfileUrl).delete();
            }

        }
    }

    const toggleEditing = () => setEditing(prev => !prev);

    const onChange = (event) =>{
        const {target:{value}} = event;
        setNewTweet(value);
    }

    const onSubmit = async (event) =>{
        event.preventDefault();
        console.log(tweetObject.text, newTweet);
        // A DocumentReference refers to a document location in a Firestore database
        // go to your firestore, you can see the location
        // ex) /tweets/6x3GyJ3AnvvxmwsClP2t
        dbService.doc(`tweets/${tweetObject.id}`).update({
            text:newTweet
        })
        setEditing(false);
    }
    console.log("is owner:" + isOwner)

    return (
        <div>
            {
                editing ? 
                <>
                    {isOwner && <>
                        <form onSubmit={onSubmit}>
                            <input onChange={onChange} type="text" value={newTweet} required></input>
                            <input type="submit" value="Update"></input>
                        </form> 
                        <button onClick={toggleEditing}>Cancel</button>
                    </>}
                </>
                :
                <>
                    <h4>{tweetObject.text}</h4>
                    {tweetObject.imgFfileUrl && <img src={tweetObject.imgFfileUrl} width="50px" height="50px" alt="imageaa"></img>}
                    {isOwner && <>
                        <button onClick={onDeleteClick}>Delete Tweet</button>
                        <button onClick={toggleEditing}>Edit Tweet</button>
                    </>}
                </>

            }

        </div>
    );
}

export default Tweet;