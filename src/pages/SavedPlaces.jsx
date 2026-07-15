import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeService } from '../services/placeService';
import { FiMapPin, FiNavigation, FiTrash2, FiCompass } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SavedPlaces = () => {
  const navigate = useNavigate();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPlaces = async () => {
    try {
      setLoading(true);
      const places = await placeService.getSavedPlaces();
      setSavedPlaces(places || []);
    } catch (err) {
      console.error('Failed to load saved places:', err);
      toast.error('Failed to load saved places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  const handleDeletePlace = async (id) => {
    if (!window.confirm('Are you sure you want to remove this saved place?')) return;
    try {
      await placeService.deleteSavedPlace(id);
      setSavedPlaces((prev) => prev.filter((p) => p._id !== id));
      toast.success('Place removed successfully');
    } catch (err) {
      toast.error('Could not remove place');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid pt-24 pb-12 px-4 text-left">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-xl bg-dark-800 flex items-center justify-center">
              <FiMapPin className="text-primary-400" size={20} />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Saved Places</h1>
            <p className="text-white/40 text-xs mt-0.5">Explore your favorite destinations and plan routes</p>
          </div>
        </div>

        {/* Saved Places Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-5 h-24 skeleton rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : savedPlaces.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-md mx-auto animate-scale-in">
            <FiMapPin className="text-white/20 mx-auto mb-4" size={40} />
            <h3 className="font-display font-bold text-white text-lg mb-1">Your bucket list is empty</h3>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              Start exploring top cafes, theatres, and sightseeing destinations in Where To? and save them here!
            </p>
            <button 
              onClick={() => navigate('/explore')} 
              className="btn-primary flex items-center gap-2 mx-auto text-sm cursor-pointer"
            >
              <FiCompass size={16} />
              Explore destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
            {savedPlaces.map((place) => (
              <div 
                key={place._id} 
                className="glass-card p-5 flex items-start gap-4 border border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group rounded-2xl relative"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 text-primary-400 group-hover:scale-105 transition-transform">
                  <FiMapPin size={18} />
                </div>
                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="text-white font-bold text-sm truncate">{place.name}</h3>
                  <span className="inline-block text-[10px] font-semibold text-primary-300 bg-primary-500/15 border border-primary-500/10 rounded-full px-2.5 py-0.5 mt-1.5 uppercase tracking-wide">
                    {place.category}
                  </span>
                  <p className="text-white/30 text-[10px] mt-2 truncate font-mono">
                    Coords: {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
                  </p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-300 hover:bg-primary-500/25 transition-colors"
                    title="Get Directions"
                  >
                    <FiNavigation size={14} />
                  </a>
                  <button
                    onClick={() => handleDeletePlace(place._id)}
                    className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
                    title="Remove Location"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SavedPlaces;
