import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [name, setName] = useState('anonymous');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('All');

  useEffect(() => {
    socket.emit('setUsername', name);

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('updateUserList', (users) => {
      setUserList(users);
    });

    socket.on('userCount', (userTotal) => {
      setUserCount(userTotal);
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
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('updateUserList');
    };
  }, [messages, feedback, userList]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    socket.emit('setUsername', e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    socket.emit('typing', { name, recipientId: selectedUser });
  };

  const handleMessageSend = (e) => {
    e.preventDefault();
    const newMessage = {
      text: message,
      author: name,
      date: new Date().toLocaleString(),
      senderId: socket.id,
      recipientId: selectedUser === 'All' ? null : selectedUser,
    };
    if (selectedUser === 'All') {
      socket.emit('message', newMessage);
    } else {
      socket.emit('privateMessage', newMessage);
    }
    setMessage('');
    socket.emit('stopTyping', selectedUser === 'All' ? null : selectedUser);
  };

  return (
    <>
      <h1 className='title'>iChat</h1>
      <div className="mainChat">
        <div className="flex">
          <div className="userList">
            <h3>Users: {userCount}</h3>
            <ul>
              <li onClick={() => setSelectedUser('All')} className={selectedUser === 'All' ? 'selected' : ''}>All</li>
              {Object.keys(userList).map((user, index) => (
                <li key={index} onClick={() => setSelectedUser(user)} className={selectedUser === user ? 'selected' : ''}>
                    {userList[user]}
                </li>
              ))}
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
              {messages
                .filter(msg => (selectedUser === 'All' && !msg.recipientId) || (msg.senderId === selectedUser || msg.recipientId === selectedUser))
                .map((msg, index) => (
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
              <input type="text"
                name="message"
                className='messageInput'
                value={message}
                onKeyUp={() => {
                  if (!message) {
                    socket.emit('stopTyping', selectedUser === 'All' ? null : selectedUser);
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
