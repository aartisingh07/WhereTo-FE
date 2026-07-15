import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHash, FiArrowRight, FiCompass, FiLock, FiUsers, FiMessageSquare, FiSend, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { roomService } from '../services/roomService';

const JoinRoom = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Tab State: 'code' or 'public'
  const [activeTab, setActiveTab] = useState('code');
  
  // Join Code States
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [joiningCode, setJoiningCode] = useState(false);
  const inputs = useRef([]);

  // Public Lobbies States
  const [publicRooms, setPublicRooms] = useState([]);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  
  // Note Overlay States
  const [requestRoomId, setRequestRoomId] = useState(null);
  const [requestNote, setRequestNote] = useState('');

  // Recent My Rooms States
  const [activeRooms, setActiveRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Fetch recent user rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await roomService.getMyRooms();
        setActiveRooms(rooms || []);
      } catch (err) {
        console.error('Failed to fetch user rooms:', err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  // Fetch public active rooms
  const fetchPublicRooms = useCallback(async () => {
    setLoadingPublic(true);
    try {
      const rooms = await roomService.getActiveRooms();
      setPublicRooms(rooms || []);
    } catch (err) {
      console.error('Failed to fetch active rooms:', err);
    } finally {
      setLoadingPublic(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'public') {
      fetchPublicRooms();
    }
  }, [activeTab, fetchPublicRooms]);

  // Code input handlers
  const handleChange = (index, value) => {
    const v = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!v && !code[index]) return;

    const newCode = [...code];
    newCode[index] = v.slice(-1);
    setCode(newCode);

    if (v && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const newCode = [...code];
    pasted.split('').forEach((char, i) => { newCode[i] = char; });
    setCode(newCode);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleJoinByCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      toast.error('Enter the full 6-digit code');
      return;
    }

    setJoiningCode(true);
    try {
      const room = await roomService.joinRoom(fullCode);
      toast.success(`Joined ${room.name || 'room'}! 🎉`);
      navigate(`/room/${room._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
      setJoiningCode(false);
    }
  };

  // Submit Join Request
  const handleSubmitJoinRequest = async (e) => {
    e.preventDefault();
    if (!requestRoomId) return;

    setSubmittingRequest(true);
    try {
      await roomService.requestJoinRoom(requestRoomId, requestNote);
      toast.success('Join request sent successfully! ✈️');
      setRequestRoomId(null);
      setRequestNote('');
      fetchPublicRooms(); // Refresh states
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4 pt-24 pb-12 text-left">
      <div className="fixed top-20 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 left-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        
        {/* Main Card */}
        <div className="glass-card p-6 sm:p-8 animate-slide-up relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏠</div>
            <h1 className="font-display font-bold text-2xl text-white">Hangout Rooms</h1>
            <p className="text-white/40 text-xs mt-1">Join a travel hangout or explore active lobbies</p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-8">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer
                ${activeTab === 'code' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-white/50 hover:text-white'}`}
            >
              <FiLock size={14} />
              Join with Code
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer
                ${activeTab === 'public' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-white/50 hover:text-white'}`}
            >
              <FiCompass size={14} />
              Public Lobbies
            </button>
          </div>

          {/* TAB 1: Join with Code */}
          {activeTab === 'code' && (
            <div className="animate-fade-in text-center">
              <p className="text-white/40 text-xs mb-6">
                Enter the 6-character code shared by your friend
              </p>

              {/* OTP Code fields */}
              <div className="flex justify-center gap-2 mb-8" onPaste={handlePaste}>
                {code.map((char, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl text-center text-lg sm:text-xl font-display font-bold
                      bg-dark-800 border-2 text-white outline-none transition-all duration-200
                      ${char ? 'border-primary-500 text-primary-300' : 'border-white/10 focus:border-primary-500/50'}`}
                  />
                ))}
              </div>

              <button
                onClick={handleJoinByCode}
                disabled={joiningCode || code.join('').length < 6}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm cursor-pointer"
              >
                {joiningCode ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiHash size={16} />
                    Join Room
                    <FiArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-white/20 text-[10px] mt-4">
                The code is case-insensitive. Letters and numbers only.
              </p>
            </div>
          )}

          {/* TAB 2: Public Lobbies */}
          {activeTab === 'public' && (
            <div className="animate-fade-in space-y-4">
              <p className="text-white/40 text-xs mb-4 text-center">
                Explore active lobbies and request to join hosts directly
              </p>

              {loadingPublic ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 skeleton rounded-xl animate-pulse bg-white/5" />
                  ))}
                </div>
              ) : publicRooms.length === 0 ? (
                <div className="text-center py-8">
                  <FiCompass className="text-white/20 mx-auto mb-2 animate-bounce" size={28} />
                  <p className="text-white/30 text-xs">No other active public lobbies found right now</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {publicRooms.map((room) => {
                    const hostName = room.host?.name || room.host?.username || 'Unknown Host';
                    
                    // Locate current user's request status
                    const myRequest = room.joinRequests?.find(
                      (r) => (r.user?._id || r.user) === user?._id
                    );

                    return (
                      <div 
                        key={room._id}
                        className="bg-white/3 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 transition-all hover:bg-white/5 hover:border-white/10"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display font-semibold text-white text-sm truncate">{room.name}</h4>
                          <p className="text-[10px] text-white/30 mt-1 truncate">
                            Host: <span className="font-medium text-white/50">{hostName}</span>
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          {myRequest ? (
                            myRequest.status === 'accepted' ? (
                              <button
                                onClick={() => navigate(`/room/${room._id}`)}
                                className="px-3 py-1.5 rounded-lg bg-neon-green/20 text-neon-green hover:bg-neon-green/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <FiCheck size={13} />
                                Join Room
                              </button>
                            ) : myRequest.status === 'pending' ? (
                              <span className="inline-block px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs font-semibold cursor-not-allowed">
                                Pending Approval
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold cursor-not-allowed">
                                Request Declined
                              </span>
                            )
                          ) : (
                            <button
                              onClick={() => {
                                setRequestRoomId(room._id);
                                setRequestNote('');
                              }}
                              className="btn-primary !px-3.5 !py-1.5 text-xs flex items-center gap-1 cursor-pointer"
                            >
                              Request
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Recent My Rooms Section */}
          {!loadingRooms && activeRooms.length > 0 && (
            <div className="mt-8 border-t border-white/5 pt-6 text-left">
              <h3 className="font-display font-semibold text-white/50 text-xs uppercase tracking-wider mb-4 pl-1 flex items-center gap-1.5">
                <span>🏠</span> Your active lobbies
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {activeRooms.map((room) => (
                  <button
                    key={room._id}
                    onClick={() => navigate(`/room/${room._id}`)}
                    className="w-full text-left bg-white/3 border border-white/5 p-3.5 rounded-xl hover:border-primary-500/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-display font-semibold text-white text-xs truncate">
                        {room.name}
                      </p>
                      <p className="text-white/30 text-[10px] mt-1 truncate">
                        Code: <span className="font-mono text-primary-300 font-bold">{room.code}</span> · Host: {room.host?.username || 'You'}
                      </p>
                    </div>
                    <FiArrowRight
                      className="text-white/20 group-hover:text-primary-300 group-hover:translate-x-1 transition-all flex-shrink-0"
                      size={14}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* REQUEST NOTE DIALOG OVERLAY */}
      {requestRoomId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-sm p-6 animate-scale-in relative border border-white/10 shadow-2xl bg-dark-900 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <h3 className="font-display font-bold text-white text-sm">Send Join Request</h3>
              <button 
                onClick={() => setRequestRoomId(null)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitJoinRequest} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-white/50 mb-2 uppercase tracking-wider">
                  Add a note to why you want to join (optional)
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Hey, can I join your group outing lobby? I want to tag along..."
                  rows={3}
                  maxLength={200}
                  className="input-field py-2 resize-none text-xs"
                />
                <span className="block text-[9px] text-white/30 text-right mt-1.5">
                  {requestNote.length} / 200 characters
                </span>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setRequestRoomId(null)}
                  className="flex-1 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="flex-1 btn-primary py-2 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  {submittingRequest ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend size={12} />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JoinRoom;
