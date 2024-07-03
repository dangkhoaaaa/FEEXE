import React, { useEffect, useRef, useState } from "react";
import "./MentorMessenger.scss";
import NavMentor from "../../../components/Nav-mentor/NavMentor";
import axiosInstance from "../../../service/AxiosInstance";
import { RYI_URL } from "../../../URL_BE/urlbackend";
import altImg from "../../../assets/image/noImage.png";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import * as signalR from "@microsoft/signalr";
import NavMentee from "../../../components/Nav-mentee/NavMentee";

// const backendURL = process.env.REACT_APP_API_URL;
const backendURL = "https://totevn.azurewebsites.net";

export default function MentorMessenger() {
  const [myChats, setMyChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChatPartnerId, setSelectedChatPartnerId] = useState(null);
  const [chatName, setChatName] = useState({
    chatPartnerPhoto: "",
    chatPartnerName: "",
  });
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeChatPartnerId, setActiveChatPartnerId] = useState(null);
  const [connection, setConnection] = useState(null);
  const selectedChatPartnerIdRef = useRef(selectedChatPartnerId);
  const chatContainerRef = useRef(null);

  const role = localStorage.getItem("role");
  useEffect(() => {
    selectedChatPartnerIdRef.current = selectedChatPartnerId;
  }, [selectedChatPartnerId]);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      //chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatPartnerId]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendURL}/chathub`, {
        withCredentials: true, // Ensure cookies are sent with requests
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !selectedChatPartnerId) return;

    if (connection && connection._connectionStarted) {
      try {
        await connection.send("SendMessage", selectedChatPartnerId, newMessage);
        setNewMessage("");
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  useEffect(() => {
    if (connection) {
      if (connection.state === signalR.HubConnectionState.Disconnected) {
        connection
          .start()
          .then(() => {
            connection.on("ReceiveMessage", (message) => {
              console.log("ReceiveMessage " + selectedChatPartnerIdRef.current);
              if (
                selectedChatPartnerIdRef.current &&
                ((selectedChatPartnerIdRef.current === message.senderId &&
                  message.isSentByCurrentUser === false) ||
                  message.isSentByCurrentUser === true)
              ) {
                setMessages((messages) => [...messages, message]);
              }
            });
          })
          .catch((e) => console.log("Connection failed: ", e));
      }
    }
  }, [connection, selectedChatPartnerId]);

  const fetchMyChats = () => {
    axiosInstance
      .get(`${RYI_URL}/Messages/my-chats`)
      .then((response) => {
        setMyChats(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const fetchMessages = (chatPartnerId) => {
    axiosInstance
      .get(`${RYI_URL}/Messages/messages?ChatPartnerId=${chatPartnerId}`)
      .then((response) => {
        // const sortedMessages = response.data.data.sort(
        //   (a, b) => new Date(a.sentTime) - new Date(b.sentTime)
        // );
        setMessages(response.data.data);
      })
      .catch((error) => {
        console.log("error mess", error);
      });
  };
  useEffect(() => {
    fetchMyChats();
  }, []);

  const handleChatItemClick = (chat) => {
    console.log("chat ", chat);
    setSelectedChatPartnerId(chat.chatPartnerId);
    fetchMessages(chat.chatPartnerId);
    setChatName({
      chatPartnerPhoto: chat.chatPartnerPhoto,
      chatPartnerName: chat.chatPartnerName,
    });
    setSearchQuery("");

    const chatExists = myChats.some(
      (existingChat) => existingChat.chatPartnerId === chat.chatPartnerId
    );

    if (!chatExists) {
      setMyChats((prevChats) => [...prevChats, chat]);
    }
    setActiveChatPartnerId(chat.chatPartnerId); // Set active chat item
    setNewMessage("");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== "") {
      axiosInstance
        .get(`${RYI_URL}/Messages/search-chat?search=${query}`)
        .then((response) => {
          setSearchResults(response.data.data);
        })
        .catch((error) => {
          console.log("Error searching chat", error);
        });
    } else {
      setSearchResults([]);
    }
  };

  function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  return (
    <div>
      {role === "Mentor" ? (
        <NavMentor activePage="messenger" />
      ) : (
        <NavMentee activePage="messenger" />
      )}
      <div className="mentor-messenger-container">
        <div className="chat-box">
          <div className="chat-bar">
            <p className="mess-title">Messages</p>
            <InputGroup className="mb-3">
              <Form.Control
                className="input-search-chat"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>
            <div className="chat-list">
              {searchQuery.trim() !== "" ? (
                searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div
                      className={`chat-item ${activeChatPartnerId === result.chatPartnerId
                          ? "active"
                          : ""
                        }`}
                      key={result.chatPartnerId}
                      onClick={() => handleChatItemClick(result)}
                    >
                      <img
                        className="chat-photo"
                        src={result.chatPartnerPhoto || altImg}
                        alt="chat partner"
                      />
                      <div className="partner-infor">
                        <div className="partnerName-time">
                          <p className="partner-name">
                            <b>{result.chatPartnerName}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No results found</p>
                )
              ) : (
                myChats &&
                myChats.length > 0 &&
                myChats.map((chat) => (
                  <div
                    className={`chat-item ${activeChatPartnerId === chat.chatPartnerId ? "active" : ""
                      }`}
                    key={chat.chatPartnerId}
                    onClick={() => handleChatItemClick(chat)}
                  >
                    <img
                      className="chat-photo"
                      src={chat.chatPartnerPhoto || altImg}
                      alt="chat partner"
                    />
                    <div className="partner-infor">
                      <div className="partnerName-time">
                        <p className="partner-name">
                          <b>{chat.chatPartnerName}</b>
                        </p>
                        <p className="time-chat"></p>
                      </div>
                      {chat.messages && chat.messages.length > 0 && (
                        <p>
                          {chat.messages[0]?.content.slice(0, 30)}
                          {chat.messages[0]?.content.length > 30 ? (
                            <span>...</span>
                          ) : (
                            ""
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mentor-mess">
            <div className="mentor-name-mess">
              <img
                className="img-chat-box"
                src={chatName.chatPartnerPhoto || altImg}
                alt="chat partner"
              />
              <h4>{chatName.chatPartnerName}</h4>
            </div>
            <div className="mess-content" ref={chatContainerRef}>
              {selectedChatPartnerId &&
                messages.map((message, index) => (
                  <div
                    className={`message ${message.isSentByCurrentUser ? "my-mess" : "partner-mess"
                      }`}
                    key={index}
                  >
                    <p>
                      {!message.isSentByCurrentUser && (
                        <div>
                          <img
                            className="img-chat-box"
                            src={
                              message.senderPhotoUrl
                                ? message.senderPhotoUrl
                                : altImg
                            }
                            alt="sender"
                          />
                          <strong>{message.senderName}</strong>
                        </div>
                      )}
                      <p className="partner-mess-item">{message.content}</p>
                    </p>
                    <small
                      style={{ fontSize: "0.8em", color: "#000" }}
                      className="mess-time"
                    >
                      {formatDateTime(message.sentTime)}
                    </small>
                  </div>
                ))}
            </div>
            <div className="message-input">
              <InputGroup className="mb-3 input-mess-container">
                <Form.Control
                  placeholder={`Send message to ${chatName.chatPartnerName}`}
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  className="input-mess"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={sendMessage}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
