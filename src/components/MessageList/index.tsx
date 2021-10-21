import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { api } from '../../services/api';

import styles from './styles.module.scss';

import logoImage from '../../assets/logo.svg';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(previousState => [
          messagesQueue[0],
          previousState[0],
          previousState[1],
        ].filter(Boolean));

        // Need to remove the oldest message after setMessages to clear queue
        messagesQueue.shift();
      }
    }, 3000)
  }, [])

  // API call and loading lastest messages
  useEffect(() => {
    api.get<Message[]>('messages/recent').then(response => {
      setMessages(response.data);
    })
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImage} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          );
        })}

      </ul>
    </div>
  )
}