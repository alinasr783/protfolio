import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visits'); // 'messages' or 'visits'
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Auto-login from LocalStorage
  useEffect(() => {
    const savedLogin = localStorage.getItem('portfolio_admin_session');
    if (savedLogin) {
      const { email, password, timestamp } = JSON.parse(savedLogin);
      // Session valid for 7 days
      const isExpired = Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000;
      if (!isExpired && email === 'alinasreldin783@gmail.com' && password === 'Alinasr89#') {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('portfolio_admin_session');
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email === 'alinasreldin783@gmail.com' && loginData.password === 'Alinasr89#') {
      setIsLoggedIn(true);
      setError('');
      // Save to LocalStorage
      localStorage.setItem('portfolio_admin_session', JSON.stringify({
        email: loginData.email,
        password: loginData.password,
        timestamp: Date.now()
      }));
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('portfolio_admin_session');
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();

      // Realtime subscription for visits
      const visitsChannel = supabase
        .channel('visits-realtime')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'visits' }, 
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setVisits(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setVisits(prev => prev.map(v => v.id === payload.new.id ? payload.new : v));
              setSelectedVisitor(prev => (prev && prev.id === payload.new.id) ? payload.new : prev);
            }
          }
        )
        .subscribe();

      // Realtime subscription for messages
      const messagesChannel = supabase
        .channel('messages-realtime')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages' }, 
          (payload) => {
            setMessages(prev => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(visitsChannel);
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Messages
    const { data: msgData } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(msgData || []);

    // Fetch Visits
    const { data: visitData } = await supabase
      .from('visits')
      .select('*')
      .order('created_at', { ascending: false });
    setVisits(visitData || []);

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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('visits')}
              className={`px-4 py-2 rounded font-medium ${activeTab === 'visits' ? 'bg-black text-white' : 'bg-white border'}`}
            >
              Visits ({visits.length})
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded font-medium ${activeTab === 'messages' ? 'bg-black text-white' : 'bg-white border'}`}
            >
              Messages ({messages.length})
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-20">Loading data...</p>
        ) : (
          <>
            {activeTab === 'messages' ? (
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
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Visits List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow border overflow-hidden">
                  <div className="p-4 border-b bg-gray-50 font-bold">Recent Visitors</div>
                  <div className="divide-y overflow-y-auto max-h-[70vh]">
                    {visits.map((visit) => (
                      <div 
                        key={visit.id} 
                        onClick={() => setSelectedVisitor(visit)}
                        className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedVisitor?.id === visit.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm">{visit.ip_address}</span>
                          <span className="text-[10px] text-gray-400">{new Date(visit.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{visit.city}, {visit.country}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded capitalize">{visit.device_type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visitor Details */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedVisitor ? (
                    <>
                      <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-xl font-bold mb-6 border-b pb-2">Visitor Deep Profile: {selectedVisitor.ip_address}</h2>
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-3">
                            <p className="flex justify-between"><span className="text-gray-500">Location:</span> <span className="font-medium text-right">{selectedVisitor.city}, {selectedVisitor.region}, {selectedVisitor.country}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Coordinates:</span> <span className="font-medium">{selectedVisitor.latitude}, {selectedVisitor.longitude}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">OS:</span> <span className="font-medium">{selectedVisitor.os}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Browser:</span> <span className="font-medium">{selectedVisitor.browser}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">RAM:</span> <span className="font-medium text-blue-600">{selectedVisitor.ram_size || 'N/A'}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">CPU:</span> <span className="font-medium text-blue-600">{selectedVisitor.cpu_cores || 'N/A'}</span></p>
                          </div>
                          <div className="space-y-3">
                            <p className="flex justify-between"><span className="text-gray-500">Device:</span> <span className="font-medium capitalize">{selectedVisitor.device_type}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Connection:</span> <span className="font-medium text-green-600">{selectedVisitor.connection_type} ({selectedVisitor.connection_speed})</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Battery:</span> <span className={`font-medium ${selectedVisitor.battery_charging ? 'text-green-500' : 'text-orange-500'}`}>{selectedVisitor.battery_level} {selectedVisitor.battery_charging ? '(Charging⚡)' : '(Discharging)'}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Resolution:</span> <span className="font-medium">{selectedVisitor.screen_resolution}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Referrer:</span> <span className="font-medium text-xs truncate max-w-[150px]" title={selectedVisitor.referrer}>{selectedVisitor.referrer || 'Direct'}</span></p>
                            <p className="flex justify-between"><span className="text-gray-500">Full URL:</span> <span className="font-medium text-xs truncate max-w-[150px]" title={selectedVisitor.full_url}>{selectedVisitor.full_url}</span></p>
                          </div>
                        </div>
                        <div className="mt-6 p-3 bg-gray-50 rounded text-[10px] font-mono break-all text-gray-400">
                          {selectedVisitor.user_agent}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-xl font-bold mb-4">Activity Timeline</h2>
                        <div className="space-y-4">
                          {selectedVisitor.actions?.map((action, i) => (
                            <div key={i} className="flex gap-4 border-l-2 border-gray-100 pl-4 relative">
                              <div className="absolute w-3 h-3 bg-black rounded-full -left-[7px] top-1"></div>
                              <div>
                                <p className="text-sm font-bold capitalize">{action.type.replace('_', ' ')}</p>
                                {action.section && <p className="text-xs text-blue-600">Viewed section: {action.section}</p>}
                                {action.target && <p className="text-xs text-green-600">Clicked nav: {action.target}</p>}
                                {action.page && <p className="text-xs text-gray-500">URL: {action.page}</p>}
                                <p className="text-[10px] text-gray-400 mt-1">{new Date(action.timestamp).toLocaleTimeString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-dashed text-gray-400 p-20 text-center">
                      Select a visitor from the list to see full details and tracking history
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
