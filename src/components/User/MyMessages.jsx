// Updated MyMessages.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

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
        toast.error(err.response?.data?.message || 'Failed to fetch conversations.', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        });
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
          toast.error('Failed to fetch messages.', {
            style: {
              background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
              color: 'white',
              borderRadius: '16px',
            },
          });
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
      toast.error(err.response?.data?.message || 'Failed to send message.', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #c0392b 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const isMessageFromCurrentUser = (message) => {
    return message.senderId._id === user._id || message.senderId === user._id;
  };

  const formatTime = (date) =>
    new Date(date).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

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
      {/* Header */}
      <h2 className="text-4xl sm:text-5xl font-black mb-8 text-white">
        <i className="fas fa-envelope text-blue-400 mr-2"></i>
        My Messages
      </h2>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" style={{ height: '70vh' }}>
        {/* Conversations List */}
        <div className="md:col-span-4">
          <div className="group relative h-full p-4 rounded-3xl transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-users text-white text-base"></i>
                </div>
                <h5 className="text-xl font-bold text-white">Conversations</h5>
              </div>
              <div className="flex-grow overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4">
                    <i className="fas fa-spinner fa-spin text-2xl text-white"></i>
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left p-3 rounded-xl mb-2 transition-all duration-300 hover:bg-white/10 ${
                        selectedConversation?.id === conversation.id ? 'bg-white/20' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="me-auto text-start">
                          <div className="font-bold text-white">{conversation.otherUser.name}</div>
                          <div className="text-gray-400 small">
                            {conversation.booking.serviceId?.title || 'Service'}
                          </div>
                          <div className="small text-gray-300 truncate" style={{ maxWidth: '200px' }}>
                            {conversation.lastMessage.content}
                          </div>
                        </div>
                        <div className="text-end">
                          <small className="text-gray-400">
                            {formatLastMessageTime(conversation.lastMessage.time)}
                          </small>
                          {conversation.unreadCount > 0 && (
                            <div>
                              <span className="badge inline-block px-2 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-500 text-white mt-1">
                                {conversation.unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-column justify-content-center align-items-center h-full text-gray-400">
                    <i className="fas fa-envelope-open-text text-5xl mb-4"></i>
                    <p className="text-lg">No conversations found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="md:col-span-8">
          <div className="group relative h-full rounded-3xl transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300"></div>
            <div className="absolute inset-0 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-3xl transition-all duration-300"></div>
            <div className="relative z-10 h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-user text-white text-lg"></i>
                      </div>
                      <div>
                        <h6 className="font-bold text-white mb-0">{selectedConversation.otherUser.name}</h6>
                        <small className="text-gray-400">
                          {selectedConversation.booking.serviceId?.title || 'Service'}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-grow p-4 overflow-y-auto" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {messages.map((message) => {
                      const isFromCurrentUser = isMessageFromCurrentUser(message);
                      return (
                        <div
                          key={message._id}
                          className={`flex mb-4 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`p-3 rounded-2xl max-w-[70%] ${
                              isFromCurrentUser
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-200'
                            }`}
                            style={{
                              borderRadius: isFromCurrentUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                            }}
                          >
                            <div className="mb-1">{message.content}</div>
                            <div className={`small text-end text-xs ${isFromCurrentUser ? 'text-white/70' : 'text-gray-400'}`}>
                              {formatTime(message.time)}
                              {isFromCurrentUser && <i className="fas fa-check-double ml-1"></i>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-white/10">
                    <form onSubmit={handleSendMessage}>
                      <div className="flex">
                        <input
                          type="text"
                          className="flex-grow bg-white/5 border border-white/10 rounded-l-lg p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          disabled={sendingMessage}
                        />
                        <button
                          type="submit"
                          className="group relative px-6 py-3 font-semibold text-white rounded-r-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50"
                          disabled={sendingMessage || !newMessage.trim()}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10">
                            {sendingMessage ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-column justify-content-center align-items-center h-full text-gray-400">
                  <i className="fas fa-comment-dots text-5xl mb-4"></i>
                  <h5 className="text-2xl font-bold mb-2">Select a conversation</h5>
                  <p className="text-lg">Choose a conversation from the list to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMessages;