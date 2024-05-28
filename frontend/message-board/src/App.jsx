import { useState, useEffect } from 'react'
import './App.css'
import { Button, TextField } from '@mui/material';
import axios from 'axios';

function App() {
  
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [currMessages, setCurrMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editMode, setEditMode] = useState(null);

  // fetching current messages
  const fetchData = async () => {
    const response = await axios.get("http://localhost:8000/posts")
    console.log("response", response.data);
    setCurrMessages(response.data);
  }

  useEffect(() => {
    fetchData();
  }, [])

  // adding new messages
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: name,
      message: message,
    };
    const response = await axios.post("http://localhost:8000/users", body);
    console.log("user message: ", response.data);
    fetchData();
    setName("");
    setMessage("");
  }

  // update given message
  const updateMessage = async (id) => {
    const response = await axios.put(`http://localhost:8000/posts/${id}`, {
            currentMessage: newMessage,
    });
    fetchData();
    setEditMode(null); // 
  }

  // delete given message
  const deleteMessage = async (id) => {
    console.log("deleting user with id", id);
    await axios.delete(`http://localhost:8000/users/${id}`)
    fetchData();
    
  }


  return (
    <>
      <h1 align="center" className="header"> Message Board </h1>
      <form className="form" onSubmit={handleSubmit}> 
        <label> Name: </label>
        <TextField placeholder="Enter Name" value={name} type="text" onChange={(e) => setName(e.target.value)}></TextField>
        <br/>
        <label> Message: </label>
        <TextField placeholder="Enter Message" multiline value={message} type="text" onChange={(e) => setMessage(e.target.value)}></TextField>
        <br/>
        <Button variant="contained" color="success" type="submit"> Submit </Button>
      </form>
      <div className="board"> 
        <h2 style={{color: "#556B2F"}}> Previous Responses: </h2>
        {currMessages.map((response) => (
          <div key={response.id}>
            {editMode === response.id ? (
              <>
                <TextField
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  multiline
                />
                <Button color="success" onClick={() => updateMessage(response.id)}>Save</Button>
                <Button color="error" onClick={() => setEditMode(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <h4> {response.name}: {response.message} </h4>
                <Button color="secondary" onClick={() => {
                  setEditMode(response.id);
                  setNewMessage(response.message);
                }}>Edit</Button>
                <Button color="error" onClick={() => deleteMessage(response.id)}>Remove</Button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
