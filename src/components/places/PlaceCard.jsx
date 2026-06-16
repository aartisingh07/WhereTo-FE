import { useState } from 'react';
import { FiMapPin, FiHeart, FiNavigation, FiCoffee, FiSun, FiWind } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { placeService } from '../../services/placeService';

// Category → emoji + color mapping
const categoryStyle = {
  Cafe:        { emoji: '☕', color: 'from-amber-500/20 to-yellow-500/10', badge: 'bg-amber-500/20 text-amber-300' },
  Restaurant:  { emoji: '🍽️', color: 'from-orange-500/20 to-red-500/10',  badge: 'bg-orange-500/20 text-orange-300' },
  'Fast Food': { emoji: '🍕', color: 'from-red-500/20 to-orange-500/10',   badge: 'bg-red-500/20 text-red-300' },
  'Food Court':{ emoji: '🛒', color: 'from-rose-500/20 to-pink-500/10',    badge: 'bg-rose-500/20 text-rose-300' },
  Park:        { emoji: '🌳', color: 'from-green-500/20 to-emerald-500/10',badge: 'bg-green-500/20 text-green-300' },
  Beach:       { emoji: '🌊', color: 'from-blue-500/20 to-cyan-500/10',    badge: 'bg-blue-500/20 text-blue-300' },
  Viewpoint:   { emoji: '🌅', color: 'from-purple-500/20 to-pink-500/10',  badge: 'bg-purple-500/20 text-purple-300' },
  Attraction:  { emoji: '🎡', color: 'from-primary-500/20 to-accent-500/10', badge: 'bg-primary-500/20 text-primary-300' },
  Library:     { emoji: '📚', color: 'from-indigo-500/20 to-blue-500/10',  badge: 'bg-indigo-500/20 text-indigo-300' },
  'Study Space':{ emoji: '🎓', color: 'from-violet-500/20 to-indigo-500/10',badge: 'bg-violet-500/20 text-violet-300' },
  Bakery:      { emoji: '🥐', color: 'from-yellow-500/20 to-amber-500/10', badge: 'bg-yellow-500/20 text-yellow-300' },
  Sports:      { emoji: '⚽', color: 'from-teal-500/20 to-green-500/10',   badge: 'bg-teal-500/20 text-teal-300' },
  'Lake / Water':{ emoji: '🏞️', color: 'from-cyan-500/20 to-blue-500/10', badge: 'bg-cyan-500/20 text-cyan-300' },
  Place:       { emoji: '📍', color: 'from-primary-500/20 to-accent-500/10', badge: 'bg-primary-500/20 text-primary-300' },
};

const PlaceCard = ({ place, onSave, isSaved = false }) => {
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const style = categoryStyle[place.category] || categoryStyle['Place'];

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.info('Log in to save places 💜');
      return;
    }
    if (saved) return;

    setSaving(true);
    try {
      await placeService.savePlace({
        name: place.name,
        category: place.category,
        lat: place.lat,
        lng: place.lng,
        osmId: place.osmId,
        address: place.address,
      });
      setSaved(true);
      toast.success(`${place.name} saved! ❤️`);
      if (onSave) onSave(place);
    } catch (error) {
      if (error.response?.status === 400) {
        setSaved(true); // Already saved
      } else {
        toast.error('Could not save place. Try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group`}>
      {/* Coloured top bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${style.color.replace('/20', '').replace('/10', '')}`} />

      {/* Card body */}
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{style.emoji}</span>
            <div>
              <h3 className="font-display font-semibold text-white text-base leading-tight line-clamp-1">
                {place.name}
              </h3>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                {place.category}
              </span>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
              ${saved
                ? 'bg-accent-500/20 text-accent-400'
                : 'bg-white/5 text-white/30 hover:bg-accent-500/10 hover:text-accent-400'
              }`}
            title={saved ? 'Saved!' : 'Save place'}
          >
            {saving ? (
              <div className="w-4 h-4 border border-white/30 border-t-white/80 rounded-full animate-spin" />
            ) : (
              <FiHeart size={16} className={saved ? 'fill-current' : ''} />
            )}
          </button>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-1.5 text-white/40 text-sm mb-4">
          <FiMapPin size={13} />
          <span>{place.distance} km away</span>
          {place.address && (
            <>
              <span className="text-white/20">·</span>
              <span className="truncate text-xs">{place.address}</span>
            </>
          )}
        </div>

        {/* Navigate button */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                     bg-gradient-to-r from-primary-500/20 to-accent-500/20
                     border border-primary-500/20 text-primary-300 text-sm font-medium
                     hover:from-primary-500/30 hover:to-accent-500/30 hover:border-primary-500/40
                     transition-all duration-200 group-hover:shadow-glow-purple"
        >
          <FiNavigation size={14} />
          Navigate
        </a>
      </div>
    </div>
  );
};

export default PlaceCard;
