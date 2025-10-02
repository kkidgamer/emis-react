// Updated Messages.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

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
          const otherUserId =
            message.senderId._id === user.id ? message.receiverId._id : message.senderId._id;
          const otherUser =
            message.senderId._id === user.id ? message.receiverId : message.senderId;
          const bookingId = message.bookingId._id;
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

          if (!message.isRead && message.receiverId._id === user.id) {
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
          
          const sortedMessages = (response.data.data || []).sort(
            (a, b) => new Date(a.time) - new Date(b.time)
          );
          setMessages(sortedMessages);
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
  }, [selectedConversation, token]);

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
          content: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
      toast.success('Message sent!', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      });
    } catch (err) {
      toast.error('Failed to send message.', {
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

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-white mb-4"></i>
          <p className="text-white text-lg">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full p-2 sm:p-4 space-y-4 md:space-y-0 md:space-x-4">
      {/* Conversations List - Full width on mobile, sidebar on desktop */}
      <div className="md:w-1/3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-y-auto max-h-[60vh] md:max-h-full">
        <div className="p-3 sm:p-4 border-b border-white/10">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <i className="fas fa-inbox mr-2 text-blue-400"></i>
            Conversations
          </h3>
        </div>
        <div className="divide-y divide-white/10">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 sm:p-4 cursor-pointer hover:bg-white/10 transition-colors ${selectedConversation?.id === conv.id ? 'bg-white/20' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user text-white text-sm sm:text-base"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm sm:text-base truncate">{conv.otherUser.name}</p>
                    <p className="text-gray-400 text-xs truncate max-w-[150px] sm:max-w-none">{conv.lastMessage.content}</p>
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-white/10 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                <i className="fas fa-user text-white text-sm sm:text-base"></i>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">{selectedConversation.otherUser.name}</h4>
                <p className="text-gray-400 text-xs">{selectedConversation.booking.title}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => {
                const isFromCurrentUser = message.senderId._id === user.id;
                return (
                  <div key={message._id} className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`p-2 sm:p-3 rounded-2xl max-w-[80%] ${isFromCurrentUser ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-white/5 border border-white/10 text-gray-200'}`}
                      style={{
                        borderRadius: isFromCurrentUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                      }}
                    >
                      <div className="mb-1 text-sm">{message.content}</div>
                      <div className={`text-xs text-right ${isFromCurrentUser ? 'text-white/70' : 'text-gray-400'}`}>
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
            <div className="p-2 sm:p-4 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  className="flex-grow bg-white/5 border border-white/10 rounded-l-lg p-2 sm:p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors duration-300 text-sm min-h-[44px]"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className="group relative px-3 sm:px-6 py-2 sm:py-3 font-semibold text-white rounded-r-lg overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 min-h-[44px] flex items-center justify-center"
                  disabled={sendingMessage || !newMessage.trim()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">
                    {sendingMessage ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                  </span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
            <i className="fas fa-comment-dots text-4xl sm:text-5xl mb-4"></i>
            <h5 className="text-xl sm:text-2xl font-bold mb-2">Select a conversation</h5>
            <p className="text-sm sm:text-base">Choose a conversation from the list to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;