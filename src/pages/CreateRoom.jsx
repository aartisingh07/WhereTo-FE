import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHash, FiCopy, FiCheck, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { roomService } from '../services/roomService';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const room = await roomService.createRoom(name);
      setCreated(room);
      toast.success('Room created! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create room');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(created.code);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnter = () => {
    navigate(`/room/${created._id}`);
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4 pt-16">
      {/* Glows */}
      <div className="fixed top-20 left-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {!created ? (
          /* Step 1 — Name + Create */
          <div className="glass-card p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🏠</div>
              <h1 className="font-display font-bold text-2xl text-white mb-2">Create a Room</h1>
              <p className="text-white/40 text-sm">
                Get a code, share with friends, vibe together.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/40 mb-2 font-medium">
                  Room name <span className="text-white/20">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Friday Night Plans"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  className="input-field w-full"
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiHash size={18} />
                    Generate Room Code
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2 — Show Code */
          <div className="glass-card p-8 animate-slide-up text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display font-bold text-xl text-white mb-1">Room Created!</h2>
            <p className="text-white/40 text-sm mb-8">Share this code with your squad</p>

            {/* Room Code Display */}
            <div className="bg-dark-800 border border-primary-500/30 rounded-2xl p-6 mb-6">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Room Code</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                {created.code.split('').map((char, i) => (
                  <div
                    key={i}
                    className="w-11 h-14 rounded-xl bg-primary-500/10 border border-primary-500/30
                               flex items-center justify-center text-2xl font-display font-bold text-primary-300"
                  >
                    {char}
                  </div>
                ))}
              </div>
              <p className="text-white/20 text-xs">{created.name}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 text-sm font-medium
                  ${copied
                    ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
              >
                {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>

              <button
                onClick={handleEnter}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
              >
                Enter Room
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoom;
