import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MyMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const { token, user } = useContext(AuthContext);
  const API_URL = 'https://emis-sh54.onrender.com/api';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/message`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const conversationMap = new Map();

        response.data.forEach((message) => {
          const senderId = typeof message.senderId === "object" ? message.senderId?._id : message.senderId;
          const receiverId = typeof message.receiverId === "object" ? message.receiverId?._id : message.receiverId;
          const bookingId = message.bookingId?._id;

          if (!senderId || !receiverId || !bookingId) {
            console.warn("Skipping malformed message:", message);
            return; // skip bad data
          }

          const isCurrentUserSender = senderId === user._id;
          const otherUserId = isCurrentUserSender ? receiverId : senderId;
          const otherUser = isCurrentUserSender ? message.receiverId : message.senderId;

          const conversationKey = `${bookingId}-${otherUserId}`;

          if (!conversationMap.has(conversationKey)) {
            conversationMap.set(conversationKey, {
              id: conversationKey,
              bookingId,
              booking: message.bookingId,
              otherUser,
              lastMessage: message,
              unreadCount: 0,
            });
          }

          const conversation = conversationMap.get(conversationKey);

          if (new Date(message.time) > new Date(conversation.lastMessage.time)) {
            conversation.lastMessage = message;
          }

          if (!message.isRead && message.receiverId._id === user._id) {
            conversation.unreadCount++;
          }
        });

        const conversationsArray = Array.from(conversationMap.values()).sort(
          (a, b) => new Date(b.lastMessage.time) - new Date(a.lastMessage.time)
        );

        setConversations(conversationsArray);

        if (conversationsArray.length > 0 && !selectedConversation) {
          setSelectedConversation(conversationsArray[0]);
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch conversations.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token, user._id, selectedConversation]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/message/booking/${selectedConversation.bookingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const sortedMessages = (response.data.data || []).sort(
            (a, b) => new Date(a.time) - new Date(b.time)
          );

          setMessages(sortedMessages);

          // Mark as read
          const unreadMessages = sortedMessages.filter(
            (msg) => !msg.isRead && msg.receiverId._id === user._id
          );

          for (const message of unreadMessages) {
            try {
              await axios.put(
                `${API_URL}/message/read/${message._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
            } catch (err) {
              console.error('Failed to mark message as read:', err);
            }
          }
        } catch (err) {
          toast.error('Failed to fetch messages.');
        }
      };

      fetchMessages();
    }
  }, [selectedConversation, token, user._id]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const response = await axios.post(
        `${API_URL}/message`,
        {
          receiverId: selectedConversation.otherUser._id,
          bookingId: selectedConversation.bookingId,
          content: newMessage.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id ? { ...conv, lastMessage: response.data } : conv
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Helper: check if message is from current user
  const isMessageFromCurrentUser = (message) => {
    const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
    return senderId === user._id;
  };

  const formatTime = (date) =>
    new Date(date).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });

  const formatLastMessageTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    }
  };

  return (
    <div>
      <h2 className="text-primary mb-4">
        <i className="bi bi-chat-dots me-2"></i>My Messages
      </h2>

      <div className="row" style={{ height: '70vh' }}>
        {/* Conversations List */}
        <div className="col-md-4">
          <div className="card h-100 shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>Conversations
              </h5>
            </div>
            <div className="card-body p-0" style={{ overflowY: 'auto' }}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : conversations.length > 0 ? (
                <div className="list-group list-group-flush">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${
                        selectedConversation?.id === conversation.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="ms-2 me-auto text-start">
                        <div className="fw-bold">{conversation.otherUser.name}</div>
                        <div className="text-muted small">
                          {conversation.booking.serviceId?.title || 'Service'}
                        </div>
                        <div
                          className="small text-truncate text-muted"
                          style={{ maxWidth: '200px' }}
                        >
                          {conversation.lastMessage.content}
                        </div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">
                          {formatLastMessageTime(conversation.lastMessage.time)}
                        </small>
                        {conversation.unreadCount > 0 && (
                          <div>
                            <span className="badge bg-danger rounded-pill mt-1">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                  <i className="bi bi-chat-x display-1"></i>
                  <p className="mt-3">No conversations found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="col-md-8">
          <div className="card h-100 shadow">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="card-header bg-light d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <i className="bi bi-person"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">{selectedConversation.otherUser.name}</h6>
                      <small className="text-muted">
                        {selectedConversation.booking.serviceId?.title || 'Service'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  className="card-body d-flex flex-column"
                  style={{ overflowY: 'auto', background: '#f5f5f5' }}
                >
                  <div className="flex-grow-1">
                    {messages.map((message) => {
                      const isFromCurrentUser = isMessageFromCurrentUser(message);
                      return (
                        <div
                          key={message._id}
                          className={`d-flex mb-3 ${
                            isFromCurrentUser ? 'justify-content-end' : 'justify-content-start'
                          }`}
                        >
                          <div
                            className={`p-3 shadow-sm ${
                              isFromCurrentUser ? 'bg-primary text-white' : 'bg-white border'
                            }`}
                            style={{
                              maxWidth: '70%',
                              borderRadius: isFromCurrentUser
                                ? '20px 20px 5px 20px'
                                : '20px 20px 20px 5px',
                            }}
                          >
                            <div className="mb-1">{message.content}</div>
                            <div
                              className={`small text-end ${
                                isFromCurrentUser ? 'text-white-50' : 'text-muted'
                              }`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {formatTime(message.time)}
                              {isFromCurrentUser && <i className="bi bi-check2-all ms-1"></i>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="card-footer bg-light">
                  <form onSubmit={handleSendMessage}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sendingMessage}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={sendingMessage || !newMessage.trim()}
                      >
                        {sendingMessage ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          <i className="bi bi-send"></i>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-muted">
                <i className="bi bi-chat-square-text display-1"></i>
                <h5 className="mt-3">Select a conversation</h5>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMessages;
