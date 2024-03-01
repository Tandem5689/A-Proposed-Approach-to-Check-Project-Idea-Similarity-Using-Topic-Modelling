import { Divider } from "@mui/material";
import React from "react";

function WhitebookDisplay(props)
{
    console.log(props)
    return(
        <div>
            <br/>
            <h5>Project Name</h5>
            {
               props.data.title
            }
            <br/>
            <br/>
            <br/>
            <h5>Major Keywords</h5>
            {
                (props.data.major_keywords!=undefined)?
                props.data.major_keywords.map((name,index)=>{return(<span key={index}>{name},</span>)}):'no'
            }
            <br/>
            <br/>
            <h5>Feature Phrases</h5>
            <ul>
                {
                    (props.data.major_keywords!=undefined)?
                    props.data.featurePhrases.map((name,index)=>{return <li key={index}>{name}</li>}):'no'
                }
            </ul>
            <br/>
            <br/>
            <h5>Algorithmic Tools</h5>
            <ul>
                {
                    (props.data.major_keywords!=undefined)?
                    props.data.algoTools.map((name,index)=>{return <li key={index}>{name}</li>}):'no'
                }
            </ul>
            <h5>Implementation Phrases</h5>
            <ul>
                {
                    (props.data.major_keywords!=undefined)?
                    props.data.implementationPhrases.map((name,index)=>{return <li key={index}>{name}</li>}):'no'
                }
            </ul>
            <Divider></Divider>
        </div>
    )
}

export default WhitebookDisplay;