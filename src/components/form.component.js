import React from "react";
import { Link } from "react-router-dom";
import { useState } from 'react'
import Logout from "./logout.component";
import { db } from '../utils/firebase'
import axios from 'axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import WhitebookDisplay from './WhitebookDisplay'
import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

function Form() {
    const [firstname, changeFirstName] = useState("");
    const [abstract, changeAbstract] = useState("");
    const [tools, changeTools] = useState("");
    const [algorithms, changeAlgorithms] = useState("");
    const [sapid, changeSapid] = useState("");
    const [rows, changeRows] = useState([]);
    const [page, changePage] = useState(false);
    const [completeData, changeCompleteData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    const [whichAbstract, setWhichAbstract] = useState(1);
    const [abstractCompares, setAbstractCompares] = useState({})
    // const rows = [
    //     { 'whitebookname': 'Frozen yoghurt', 'similarity': 34 },
    //     { 'whitebookname': 'Frozen yoghurt', 'similarity': 34 },
    //     { 'whitebookname': 'Frozen yoghurt', 'similarity': 34 },
    // ];

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'white',
        border: '2px solid #000',
        p: 4,
    };
    const reloadPage = () => {
        changePage(false);
    }
    const firstNameClicked = (event) => {
        changeFirstName(event.target.value);
        console.log(firstname);
    }
    const abstractClicked = (event) => {
        changeAbstract(event.target.value);
    }
    const toolsClicked = (event) => {
        changeTools(event.target.value);
    }
    const algorithmsClicked = (event) => {
        changeAlgorithms(event.target.value);
    }
    const sapidClicked = (event) => {
        changeSapid(event.target.value);
    }
    const onSubmitButton = async (event) => {
        event.preventDefault();
        var data = {
            abstract: encodeURIComponent(abstract)
        }
        db.collection("whitebookvector").get().then(async (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                data[doc.id] = doc.data().vector
            });
        }).then(res => {
            console.log(data);
            axios.post('http://localhost:5000/comparenew', data).then(resp => {
                console.log('hello................')
                console.log(resp.data.results);
                var maxdata = resp.data.results;
                var sortable = [];
                for (var objectid in maxdata) {
                    sortable.push([objectid, maxdata[objectid]]);
                }

                sortable.sort(function (a, b) {
                    return b[1] - a[1];
                });
                var findata = [];
                for (var i = 0; i <= 4; i++)
                    findata.push(sortable[i]);
                console.log(findata);
                var data2 = {
                }
                var files = {}
                db.collection("whitebookvector").get().then(async(querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                        data2[doc.id] = doc.data().title
                        files[doc.id] = doc.data();
                    });
                    console.log('inner.........')
                    console.log(data2);
                    console.log('filess......');
                    console.log(files);
                    console.log('....findata');
                    console.log(findata);
                    var answer = [];
                    var filedata = [];
                    for (var i = 0; i < findata.length; i++) {
                        var id = findata[i][0];
                        var similarity = findata[i][1];
                        for (var name of Object.keys(data2)) {
                            if (name === id) {
                                answer.push({ 'whitebookname': data2[name], 'similarity': similarity });
                                filedata.push(files[name]);
                                break;
                            }
                        }

                    }
                    console.log('...............filedata.............');
                    console.log(filedata);
                    changeRows(answer);
                    changeCompleteData(filedata);
                    let done = 0;
                    await new Promise(resolve => {
                        filedata.forEach((file, index) => {
                            axios.post('http://localhost:5000/detailcomparision', {
                                oldAbstract: encodeURIComponent(file.text_major),
                                newAbstract: encodeURIComponent(file.text_major)
                            }).then(resp => {
                                console.log(resp.data);
                                console.log(resp.data.results)
                                setAbstractCompares((as) => {
                                    const op = (index).toString()
                                    as[op] = resp.data.results
                                    done++;
                                    return as;
                                });
                                // console.log("Abstract Compares: " + abstractCompares[1])
                                // console.log(abstractCompares[1]);
                                if(done == 5){
                                    resolve()
                                }
                            })
                        })
                    }).then(() => {   
                        changePage(true)
                    })
                }).catch(err => console.log(err));
                // changePage(true);

            }
            ).catch(err => console.log(err))
        });

        console.log(firstname, sapid, abstract, tools, algorithms);

    }
    const isAdmin = localStorage.getItem('isAdmin')
    console.log(isAdmin);

    function handleClose() {
        setModalOpen(false)
    }

    return (
        <div>
            <form>

                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        <Link className="navbar-brand" >Project Idea Buddy</Link>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <ul className="navbar-nav ml-auto">
                                {isAdmin == "false" ? <li className="nav-item">
                                    <Link className="nav-link" to={"/API"}>Online Search</Link>
                                </li> : <></>}
                                {isAdmin == "true" ? <li className="nav-item">
                                    <Link className="nav-link" to={"/form"}>Upload Document</Link>
                                </li> : <div></div>}
                                <li className="nav-item">
                                    <p className="nav-link" onClick={reloadPage}>Reload</p>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={"/Logout"}>Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                {
                    !page ?
                        <div>
                            <h3>Form</h3>
                            <form onSubmit={onSubmitButton}>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label>First name</label>
                                        <input required type="text" className="form-control" value={firstname} onChange={firstNameClicked} /></div>

                                    <div className="form-group col-md-6">
                                        <label>Sap Id</label>
                                        <input required id="outlined-required" type="text" className="form-control" value={sapid} onChange={sapidClicked} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label for="exampleFormControlTextarea1">Abstract</label>
                                    <textarea required className="form-control" id="exampleFormControlTextarea1" rows="5" value={abstract} onChange={abstractClicked}></textarea>
                                </div>

                                <div className="form-group">
                                    <label for="exampleFormControlTextarea1">Algorithms</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="2" value={algorithms} onChange={algorithmsClicked}></textarea>
                                </div>


                                <div className="form-group">
                                    <label for="exampleFormControlTextarea1">Tools Used</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="2" value={tools} onChange={toolsClicked}></textarea>
                                </div>

                                <button type="submit" className="btn btn-dark btn-lg btn-block" >Search</button>
                            </form>
                        </div>

                        :
                        <div>
                            <Modal
                                open={modalOpen}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ ...style, width: 800 }}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 120 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Old Abstract</TableCell>
                                                    <TableCell align="right">New Abstract</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {abstractCompares[whichAbstract].map((row, index) => {
                                                    if (index < 7)
                                                        return (
                                                            <TableRow
                                                                key={index}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row">
                                                                    {row[0]}
                                                                </TableCell>
                                                                <TableCell align="right">{row[1]}</TableCell>
                                                            </TableRow>
                                                        )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Modal>
                            <br />
                            <br />
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>White Book Name</TableCell>
                                            <TableCell align="right">Similarity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow onClick={() => {
                                                console.log("Index: " + index);
                                                setModalOpen(true)
                                                setWhichAbstract(index)
                                                console.log(whichAbstract);
                                            }}
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.whitebookname}
                                                </TableCell>
                                                <TableCell align="right">{(row.similarity*100).toFixed(3)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br />
                            <br />
                            <Divider />
                            {/* {
                                rows.map((row,index)=>{
                                    <Link className="nav-link" to={`/whitebook/${}`}
                                })
                            }
                            <Link className="nav-link" to={"/API"}>Open Api</Link> */}
                            {
                                completeData.map((obj, index) => {
                                    return (<WhitebookDisplay key={index} data={obj}></WhitebookDisplay>);
                                })
                            }
                        </div>

                }
            </form>
        </div>
    );
}
export default Form;