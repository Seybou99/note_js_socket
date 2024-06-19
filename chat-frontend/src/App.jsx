import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function App() {
  // On déclare 2 states, donc, l'equivalent des variables, qui me permettront de conserver, 
  // le name ainsi que le message
  const [name, setName] = useState('anonymous');
  const [message, setMessage] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value); // Ici on prend la valeur de l'input qui vient d'etre modifiée, et on utilise SetName pour changer la valeur du name
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Ici on prend la valeur de l'input qui vient d'etre modifiée, et on utilise SetName pour changer la valeur du name
  }

  return (
    <>
      <h1 className='title'>iChat</h1>
      <div className="mainChat">
        <div className="flex">
          <div className="userList">
            <h3>Users : 0</h3>
            <ul>
              <li>All</li>
              <li>Toto</li>
              <li>Bob</li>
              <li>Alice</li>
            </ul>
          </div>
          <div className="chat">
            <div className="name">
            <span className="nameForm">
              <FontAwesomeIcon icon={faUser} />
              <input type="text"
                className="nameInput"
                id="nameInput"
                value={name}
                onChange={handleNameChange}
                maxLength="20"
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
            <input type="text" 
              name="message" 
              className='messageInput' 
              value={message}
              onChange={handleMessageChange} 
            />
            <div className="vDivider"></div>
            <button type="submit" className='sendButton'>Send <FontAwesomeIcon icon={faPaperPlane}/></button>
          </form>
          </div>
        </div>

      </div>
    </>
  )
}

export default App
