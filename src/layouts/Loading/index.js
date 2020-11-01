import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = {
    display: 'block',
    left: '40%',
    top: '30%',
    zIndex: '999'
};

export default function Loading(props){
    return (
        <div className="sweet-loading" style={{'display': (props.loading)? 'block' : 'none'}}>
            <PacmanLoader
                css={override}
                size={100}
                color={"#555555"}
                loading={props.loading}
            />
        </div>
    );
}