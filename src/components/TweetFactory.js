import { dbService, storageService } from "fbase";
import react, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const TweetFactory = ({userObject}) =>{
    const [tweet, setTweet] = useState("");
    const [img, setImg] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        let imgFfileUrl = "";
        if(img !== ""){
            // ref(): Returns a reference for the given path in the default bucket.
            // child(): Returns a reference to a relative path from this reference.
            const imgFileRef = storageService.ref().child(`${userObject.uid}/${uuidv4()}`);
            // putString(): Uploads string data to this reference's location.
            // returns UploadTaskSnapshot if succeeded
            const response = await imgFileRef.putString(img, "data_url");
            // UploadTaskSnapshot.ref.getDownloadURL()
            imgFfileUrl = await response.ref.getDownloadURL();
        }
        const addTweet = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObject.uid,
            imgFfileUrl
        }

        await dbService.collection("tweets").add(addTweet);
        //clean the tweet after adding it.
        setTweet("");
        setImg("");
    }

    const onChange = (event) => {
        // inside the event, inside the target, get the value
        const {target:{value}} = event;
        setTweet(value);
    }
    console.log(userObject);

    const onFileChange = (event) =>{
        const {target:{files}} = event;
        const imgFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(imgFile);
        //This onloadend is triggered each time the reading operation is completed
        reader.onloadend = (finishedEvent) =>{
            const {currentTarget:{result}} = finishedEvent;
            setImg(result);
        }
    }

    const onClearPhoto = () =>{
        setImg("");
    }
    return(
        <form onSubmit={onSubmit}>
            <input value={tweet} onChange={onChange} type="text" placeholder="Write your message" maxLength={120}/>
            <input onChange={onFileChange} type="file" accept="image/*"/>
            <input type="submit" value="Tweet"/>
            {img && 
                <div>
                    <img src={img} width="100px" height="100px" alt="uploaded img" ></img>
                    <button onClick={onClearPhoto}>Clear Photo</button>
                </div>}
        </form>
    )
}

export default TweetFactory;