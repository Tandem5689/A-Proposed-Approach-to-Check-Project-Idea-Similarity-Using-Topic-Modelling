import React from "react";
import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import { db } from '../utils/firebase'
import { storage } from "../utils/firebase";
import { Link } from "react-router-dom";
import axios from 'axios';
import WhitebookDisplay from "./WhitebookDisplay";
function File() {
  const [name, setName] = useState("");
  const [mentorname, setMentorname] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sap, setSap] = useState("");
  const [title, setTitle] = useState("");
  const [filedata, changeFiledata] = useState({});
  const [toggle, changeToggle] = useState(false);
  function onFileChange(e) {
    const file = e.target.files[0];

    console.log(file.name);

    console.log(file.size);

    console.log(file.type);
    setSelectedFile(file);
  }
  const handleButtonChange = () => {
    changeToggle(false);
  }
  const handleUpload = async (event) => {
    event.preventDefault();
    console.log(db);
    var obj = {
      "name": name,
      "mentorname": mentorname,
      "sap": sap
    }
    console.log(obj);
    db.collection("FileUpload").add(obj);
    const storageRef = storage.ref("Whitebooks");
    const uploadedFile = selectedFile;
    if (!uploadedFile) return;
    try {
      await storageRef.child(uploadedFile.name).put(uploadedFile).then(uploadedFile => {
        return uploadedFile.ref.getDownloadURL()
      }).then(url => {
        console.log(url);
        axios.get(`http://localhost:5000/extractsections?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)
          .then(response => {
            changeToggle(true);
            console.log(response.data);
            var data = { "title": title, "algoTools": response.data.algoTools, "implementationPhrases": response.data.implementationPhrases, "major_keywords": response.data.major_keywords, "text_major": response.data.text_major, "featurePhrases": response.data.featurePhrases };
            changeFiledata(data);
            db.collection('whitebookvector').add({
              vector: response.data.embeddingVector,
              title: title,
              algoTools: response.data.algoTools,
              featurePhrases: response.data.featurePhrases,
              implementationPhrases: response.data.implementationPhrases,
              major_keywords: response.data.major_keywords,
              text_major: response.data.text_major
            })
          }).catch(error => console.log(error));
      })
      alert("Successfully uploaded");
      setName("");
      setMentorname("");
      setSap("");
      setSelectedFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  const isAdmin = localStorage.getItem('isAdmin')

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" >Project Idea Buddy</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              {isAdmin == "false" ? <li className="nav-item">
                <Link className="nav-link" to={"/API"}>Open Api</Link>
              </li> : <></>}
              <li className="nav-item">
                <Link className="nav-link" to={"/"}>Form</Link>
              </li>
              <li className="nav-item">
                <p className="nav-link" onClick={handleButtonChange}>Reload</p>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/Logout"}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {
        !toggle ? <form onSubmit={handleUpload}>
          <label>Enter name</label>
          <br />
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></input>
          <br />
          <label>Enter Mentor name</label>
          <br />
          <input
            value={mentorname}
            onChange={(event) => {
              setMentorname(event.target.value);
            }}
          ></input>
          <br />
          <label>Enter Sap ID</label>
          <br />
          <input
            value={sap}
            onChange={(event) => {
              setSap(event.target.value);
            }}
          ></input>
          <br />
          <label>Enter Title</label>
          <br />
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          ></input>
          <br />
          <label>Enter file name</label>
          <br />
          <input onChange={onFileChange} type="file" /><br /><br />
          <Button type="submit" variant="outlined">
            Submit
          </Button>
        </form>
          :
          <div>
            <WhitebookDisplay data={filedata} />
          </div>
      }

    </div>
  )
}

export default File;
