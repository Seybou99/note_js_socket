import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  // Déclaration des états
  const [name, setName] = useState('anonymous');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]); // Utilisation d'un tableau pour les utilisateurs

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('userCount', (userTotal) => {
      setUserCount(userTotal);
    });

    socket.on('users', (usersList) => {
      setUsers(usersList); // Mise à jour de l'état des utilisateurs
    });

    socket.on('typing', (user) => {
      setFeedback(`${user.name} is typing...`);
    });

    socket.on('stopTyping', () => {
      setFeedback('');
    });

    return () => {
      socket.off('message');
      socket.off('userCount');
      socket.off('users');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
    socket.emit('setUsername', e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    socket.emit('typing', { name });
  };

  const handleMessageSend = (e) => {
    e.preventDefault();
    const newMessage = {
      text: message,
      author: name,
      date: new Date().toLocaleString(),
      senderId: socket.id,
    };
    socket.emit('message', newMessage);
    setMessage('');
    socket.emit('stopTyping');
  };

  return (
    <>
      <h1 className='title'>iChat</h1>
      <div className="mainChat">
        <div className="flex">
          <div className="userList">
            <h3>Users : {userCount}</h3>
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
          <div className="chat">
            <div className="name">
              <span className="nameForm">
                <FontAwesomeIcon icon={faUser} />
                <input 
                  type="text"
                  className="nameInput"
                  id="nameInput"
                  value={name}
                  onChange={handleNameChange}
                  maxLength="20"
                />
              </span>
            </div>
            <ul className="conversation">
              {messages.map((msg, index) => (
                <li key={index} className={msg.senderId === socket.id ? 'messageRight' : 'messageLeft'}>
                  <p className="message">{msg.text}</p>
                  <span>{msg.author} - {msg.date}</span>
                </li>
              ))}
              {feedback && (
                <li className="messageFeedback">
                  <p className="feedback">{feedback}</p>
                </li>
              )}
            </ul>
            <form className="messageForm" onSubmit={handleMessageSend}>
              <input 
                type="text"
                name="message"
                className='messageInput'
                value={message}
                onKeyUp={() => {
                  if (!message) {
                    socket.emit('stopTyping');
                  }
                }}
                onChange={handleMessageChange}
              />
              <div className="vDivider"></div>
              <button type="submit" className='sendButton'>Send <FontAwesomeIcon icon={faPaperPlane} /></button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
