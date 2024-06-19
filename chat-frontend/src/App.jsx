import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function App() {

  const [name, setName] = useState('anonymous');
  const [message, setMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }


  return (
    <>
      <h1 className='title'>iChat</h1>
      <div className="mainChat">
        <div className="sidebar">
          <div className="userCount">
            <h3>Nombre de users connectés: 10</h3>
          </div>
          <div className="userList">
            <h3>Users connectés:</h3>
            <ul>
              <li>Lorem ipsum 1</li>
              <li>Lorem ipsum 2</li>
              <li>Lorem ipsum 3</li>
              <li>Lorem ipsum 4</li>
              <li>Lorem ipsum 5</li>
            </ul>
          </div>
        </div>
        <div className="name">
          <span>
            <FontAwesomeIcon icon={faUser} />
            <input type="text"
              className="nameInput"
              id="nameInput"
              maxLength="20"
              value={name}
              onChange={handleNameChange}
            />
          </span>
        </div>
        <ul className="conversation">
          <li className="messageLeft">
            <p className="message">Bonjour tout le monde !</p>
            <span>author - 18 juin 2024</span>
          </li>
          <li className="messageRight">
            <p className="message">Ca va?</p>
            <span>author - 18 juin 2024</span>
          </li>
          <li className="messageFeedback">
            <p className="feedback">Toto is typing...</p>
          </li>
        </ul>
        <form className="messageForm">
          <input type="text" name="message" className='messageInput' value={message} onChange={handleMessageChange} />
          <div className="vDivider"></div>
          <button type="submit">Send <FontAwesomeIcon icon={faPaperPlane}/></button>
        </form>
      </div>
    </>
  )
}

export default App
