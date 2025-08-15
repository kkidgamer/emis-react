import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const { token, user } = useContext(AuthContext);
  const API_URL = 'https://emis-sh54.onrender.com/api';

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all messages and group by conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/message`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Group messages by booking and other user
        const conversationMap = new Map();
        
        response.data.forEach(message => {
          const otherUserId = message.senderId._id === user.id ? message.receiverId._id : message.senderId._id;
          const otherUser = message.senderId._id === user.id ? message.receiverId : message.senderId;
          const bookingId = message.bookingId._id;
          const conversationKey = `${bookingId}-${otherUserId}`;
          
          if (!conversationMap.has(conversationKey)) {
            conversationMap.set(conversationKey, {
              id: conversationKey,
              bookingId: bookingId,
              booking: message.bookingId,
              otherUser: otherUser,
              lastMessage: message,
              unreadCount: 0,
              messages: []
            });
          }
          
          const conversation = conversationMap.get(conversationKey);
          
          // Update last message if this one is newer
          if (new Date(message.time) > new Date(conversation.lastMessage.time)) {
            conversation.lastMessage = message;
          }
          
          // Count unread messages
          if (!message.isRead && message.receiverId._id === user.id) {
            conversation.unreadCount++;
          }
        });
        
        // Convert map to array and sort by last message time
        const conversationsArray = Array.from(conversationMap.values())
          .sort((a, b) => new Date(b.lastMessage.time) - new Date(a.lastMessage.time));
        
        setConversations(conversationsArray);
        
        if (conversationsArray.length > 0 && !selectedConversation) {
          setSelectedConversation(conversationsArray[0]);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch conversations.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [token, user.id, selectedConversation]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/message/booking/${selectedConversation.bookingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages(response.data.data || []);
          
          // Mark messages as read
          const unreadMessages = response.data.data.filter(
            msg => !msg.isRead && msg.receiverId._id === user.id
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
  }, [selectedConversation, token, user.id]);

  // Send new message
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
          content: newMessage.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the new message to the current messages
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Update the conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: response.data }
            : conv
        )
      );
      
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatLastMessageTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      });
    }
  };

  return (
    <div>
      <h2 className="text-success mb-4">
        <i className="bi bi-chat-dots me-2"></i>Messages
      </h2>
      
      <div className="row" style={{ height: '70vh' }}>
        {/* Conversations List */}
        <div className="col-md-4">
          <div className="card h-100 shadow">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>Conversations
              </h5>
            </div>
            <div className="card-body p-0" style={{ overflowY: 'auto' }}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-success" role="status">
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
                        <div className="fw-bold">
                          {conversation.otherUser.name}
                        </div>
                        <div className="text-muted small">
                          {conversation.booking.serviceId?.title || 'Service'}
                        </div>
                        <div className="small text-truncate" style={{ maxWidth: '200px' }}>
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
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '40px', height: '40px' }}>
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
                <div className="card-body d-flex flex-column" style={{ overflowY: 'auto', height: '400px' }}>
                  <div className="flex-grow-1">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`d-flex mb-3 ${
                          message.senderId._id === user.id ? 'justify-content-end' : 'justify-content-start'
                        }`}
                      >
                        <div
                          className={`max-w-75 p-3 rounded ${
                            message.senderId._id === user.id
                              ? 'bg-success text-white'
                              : 'bg-light text-dark'
                          }`}
                          style={{ maxWidth: '75%' }}
                        >
                          <div className="mb-1">{message.content}</div>
                          <small
                            className={`${
                              message.senderId._id === user.id ? 'text-white-50' : 'text-muted'
                            }`}
                          >
                            {formatTime(message.time)}
                          </small>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="card-footer">
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
                        className="btn btn-success"
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

export default Messages;