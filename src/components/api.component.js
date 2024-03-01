import React from "react";
import { useState } from "react";
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import CardData from './card.component';
function API() {

    const [data, setData] = useState("");
    const [resp, changeResp] = useState([]);

    const handleClick = (event) => {
        setData(event.target.value);
    }

    const handleSubmit = () => {
        console.log('hello');
        axios.post(`https://fyp-back.herokuapp.com/`,{
            "url": `https://serpapi.com/search.json?q=${data}&hl=en&gl=us&api_key=bc45768bb946080c5d84d5794e0c667a3120c5c55e68b6fe8ab8afb555b70c96`
        })
            .then(response => {
                console.log(response);
                changeResp(response.data.organic_results);
            }).catch(error => console.log(error));
    }
    return (
        <div>


            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Enter text to be searched</label>
                    <input type="text" className="form-control" value={data} onChange={handleClick} /><br />
                    <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
            <Divider />
            {
                resp.map((item) => {
                    return <CardData title={item.title} link={item.link} snippet={item.snippet}/>
                })
            }
        </div>

    );

}

export default API;