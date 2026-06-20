import { useEffect, useRef, useState } from 'react';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TRACKS = [
  {
    title: 'Autumn Chill',
    artist: 'Lofi Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=60',
  },
  {
    title: 'Rainy Cafe',
    artist: 'Jazz Ambient',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60',
  },
  {
    title: 'Midnight Study',
    artist: 'Relaxing Piano',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&auto=format&fit=crop&q=60',
  },
  {
    title: 'Lofi Dreams',
    artist: 'Dreamy Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60',
  },
  {
    title: 'Sunny Beat',
    artist: 'Morning Coffee',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover: 'https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=300&auto=format&fit=crop&q=60',
  },
];

const MusicPlayer = ({ socket, roomId, isHost }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Local control states
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // Setup audio ref on mount
  useEffect(() => {
    const audio = new Audio();
    audio.src = TRACKS[0].url;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
    };
  }, []);

  // Listen to socket sync events
  useEffect(() => {
    if (!socket) return;

    const handleStateChange = (musicState) => {
      const { isPlaying: newPlaying, trackIndex: newIndex, seekTime, lastUpdated } = musicState;
      const audio = audioRef.current;
      if (!audio) return;

      let targetTime = seekTime;
      if (newPlaying) {
        const elapsed = (Date.now() - new Date(lastUpdated).getTime()) / 1000;
        targetTime += elapsed;
      }

      const isTrackChanged = audio.src !== TRACKS[newIndex].url;
      if (isTrackChanged) {
        audio.src = TRACKS[newIndex].url;
        setTrackIndex(newIndex);
      }

      setIsPlaying(newPlaying);

      const drift = Math.abs(audio.currentTime - targetTime);
      if (isTrackChanged || drift > 1.5) {
        audio.currentTime = targetTime;
      }

      if (newPlaying) {
        audio.play().catch((err) => {
          console.log('Playback blocked by browser auto-play policy:', err);
        });
      } else {
        audio.pause();
      }
    };

    socket.on('music-state-changed', handleStateChange);

    return () => {
      socket.off('music-state-changed', handleStateChange);
    };
  }, [socket]);

  // Handle local volume modifications
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Host Action handlers
  const emitMusicState = (newPlaying, newIndex, newSeekTime) => {
    if (!socket || !roomId) return;
    socket.emit('update-music-state', {
      roomId,
      isPlaying: newPlaying,
      trackIndex: newIndex,
      seekTime: newSeekTime,
    });
  };

  const handlePlayPause = () => {
    if (!isHost) return;
    emitMusicState(!isPlaying, trackIndex, currentTime);
  };

  const handleNext = () => {
    if (!isHost) return;
    const nextIndex = (trackIndex + 1) % TRACKS.length;
    emitMusicState(isPlaying, nextIndex, 0);
  };

  const handlePrev = () => {
    if (!isHost) return;
    const prevIndex = (trackIndex - 1 + TRACKS.length) % TRACKS.length;
    emitMusicState(isPlaying, prevIndex, 0);
  };

  const handleSeekChange = (e) => {
    if (!isHost) return;
    const newSeekTime = parseFloat(e.target.value);
    emitMusicState(isPlaying, trackIndex, newSeekTime);
  };

  const handleTrackSelect = (e) => {
    if (!isHost) return;
    const selectedIndex = parseInt(e.target.value);
    emitMusicState(isPlaying, selectedIndex, 0);
  };

  // Helper formats
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const activeTrack = TRACKS[trackIndex];

  return (
    <div className="glass-card p-6 border-primary-500/20 shadow-glow-purple/10 max-w-sm w-full relative overflow-hidden animate-slide-up flex flex-col items-center">
      {/* Vinyl record spinning / cover artwork */}
      <div className="relative mb-6">
        <div
          className={`w-32 h-32 rounded-full border-4 border-dark-800 shadow-glow-purple-sm overflow-hidden flex items-center justify-center transition-all duration-1000
            ${isPlaying ? 'animate-spin-slow scale-105 ring-4 ring-primary-500/20' : 'opacity-85'}`}
        >
          <img src={activeTrack.cover} alt={activeTrack.title} className="w-full h-full object-cover" />
        </div>
        {/* Record center pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-dark-900 border border-white/20" />
      </div>

      <h3 className="font-display font-bold text-white text-base truncate max-w-xs">{activeTrack.title}</h3>
      <p className="text-white/40 text-xs font-semibold mt-0.5">{activeTrack.artist}</p>

      {/* Track progress bar */}
      <div className="w-full mt-6 space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeekChange}
          disabled={!isHost}
          className={`w-full accent-primary-500 bg-white/10 h-1.5 rounded-full outline-none
            ${isHost ? 'cursor-pointer hover:accent-primary-400' : 'cursor-not-allowed opacity-60'}`}
        />
        <div className="flex justify-between text-[10px] text-white/30 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-6 mt-4">
        <button
          onClick={handlePrev}
          disabled={!isHost}
          className={`p-2.5 rounded-xl border border-white/5 bg-white/3 text-white transition-all
            ${isHost ? 'hover:bg-white/8 hover:border-white/10 active:scale-95' : 'opacity-40 cursor-not-allowed'}`}
          title="Previous Track"
        >
          <FiSkipBack size={16} />
        </button>

        <button
          onClick={handlePlayPause}
          disabled={!isHost}
          className={`p-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow-purple transition-all active:scale-95
            ${isHost ? 'hover:brightness-110' : 'opacity-40 cursor-not-allowed'}`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="translate-x-0.5" />}
        </button>

        <button
          onClick={handleNext}
          disabled={!isHost}
          className={`p-2.5 rounded-xl border border-white/5 bg-white/3 text-white transition-all
            ${isHost ? 'hover:bg-white/8 hover:border-white/10 active:scale-95' : 'opacity-40 cursor-not-allowed'}`}
          title="Next Track"
        >
          <FiSkipForward size={16} />
        </button>
      </div>

      {/* Host Playlist Selector */}
      {isHost ? (
        <div className="w-full mt-5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/30 block mb-1">Playlist Selector</label>
          <select
            value={trackIndex}
            onChange={handleTrackSelect}
            className="w-full bg-white/5 border border-white/10 text-white/80 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary-500/40 focus:bg-white/8 transition-all"
          >
            {TRACKS.map((t, index) => (
              <option key={index} value={index} className="bg-dark-800 text-white">
                🎵 {t.title} - {t.artist}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-[10px] text-white/30 italic mt-4">
          🎵 Host is controlling the vibe
        </p>
      )}

      {/* Local Volume Controls */}
      <div className="w-full flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-white/60 hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="flex-1 accent-white/60 bg-white/10 h-1 rounded-full outline-none cursor-pointer"
        />
        <span className="text-[9px] text-white/40 font-mono">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
      </div>
    </div>
  );
};

export default MusicPlayer;
