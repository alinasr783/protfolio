import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email === 'alinasreldin783@gmail.com' && loginData.password === 'Alinasr89#') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages();
    }
  }, [isLoggedIn]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center">Admin Login</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          <button type="submit" className="w-full bg-black text-white p-3 rounded font-bold hover:bg-gray-800 transition-all">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 lg:p-10 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Messages Dashboard</h1>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <p>Loading messages...</p>
        ) : (
          <div className="grid gap-6">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{msg.name}</h3>
                      <p className="text-gray-600">{msg.email}</p>
                      {msg.website && <p className="text-blue-500 text-sm">{msg.website}</p>}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-4 bg-gray-50 p-4 rounded">{msg.message}</p>
                  
                  {msg.metadata && (
                    <div className="text-xs text-gray-500 grid grid-cols-2 md:grid-cols-4 gap-2 border-t pt-4">
                      <p><strong>Browser:</strong> {msg.metadata.userAgent.split(' ')[0]}</p>
                      <p><strong>Language:</strong> {msg.metadata.language}</p>
                      <p><strong>Screen:</strong> {msg.metadata.screenResolution}</p>
                      <p><strong>Timezone:</strong> {msg.metadata.timezone}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
