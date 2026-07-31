import React, { useState } from 'react';
import './Lap.css';
function Lap({name, age, description}) {

    const [joker, setJoker] = useState(0);
    const [follow, setFollow] = useState(false);

    function handleClick (){
        setJoker(joker + 1);
        console.log(joker);
    }    
    function handleFollow(){
        setFollow(!follow);

    }
    return(
        <div className="lap-card">
            <h1>{name}</h1>
            <h2>{age}</h2>
            <h5>{description}</h5>

            <button onClick={handleClick}>🤡{joker}</button>
            <button onClick={handleFollow}>{follow ? 'follow pannitala poda' : 'Follow pandra'}</button>


        </div>
    )
}
export default Lap;
