import { dbService, storageService } from "fbase";
import react, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
            text: newTweet
        })
        setEditing(false);
    }
    console.log("is owner:" + isOwner)

    return (
        <div className="nweet">
            {
                editing ? 
                <>
                    {isOwner && <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input onChange={onChange} type="text" value={newTweet} required autoFocus className="formInput"></input>
                            <input type="submit" value="Update Tweet" className="formBtn" />
                        </form> 
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                    </>}
                </>
                :
                <>
                    <h4>{tweetObject.text}</h4>
                    {tweetObject.imgFileUrl && <img alt="attached file" src={tweetObject.imgFileUrl} />}
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            }
        </div>
    );
}

export default Tweet;