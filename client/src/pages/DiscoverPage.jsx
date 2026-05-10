import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import {
  Compass, Star, MapPin, Clock, IndianRupee, Loader2,
  Heart, Bookmark, X, Plus, Filter,
} from 'lucide-react';
import { getStops } from '../api/stops.api';
import { getCityActivities } from '../api/search.api';
import axiosInstance from '../api/axiosInstance';

const CATEGORIES = [
  'ALL', 'SIGHTSEEING', 'FOOD', 'ADVENTURE', 'CULTURAL', 'RELAXATION', 'SHOPPING',
];

const CAT_COLORS = {
  SIGHTSEEING: 'bg-amber-100 text-amber-800',
  FOOD: 'bg-orange-100 text-orange-800',
  ADVENTURE: 'bg-sky-100 text-sky-800',
  CULTURAL: 'bg-violet-100 text-violet-800',
  RELAXATION: 'bg-emerald-100 text-emerald-800',
  SHOPPING: 'bg-pink-100 text-pink-800',
  TRANSPORT: 'bg-slate-100 text-slate-800',
  ACCOMMODATION: 'bg-indigo-100 text-indigo-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const CAT_EMOJI = {
  SIGHTSEEING: '🏛️', FOOD: '🍜', ADVENTURE: '🏔️', CULTURAL: '🎭',
  RELAXATION: '🧘', SHOPPING: '🛍️', TRANSPORT: '🚌', ACCOMMODATION: '🏨', OTHER: '📌',
};

const DiscoverPage = () => {
  const { id } = useParams();
  const { trip } = useOutletContext();
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  // Load stops for this trip
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStops(id);
        const s = Array.isArray(res.data) ? res.data : (res.data?.stops || []);
        setStops(s);
        if (s.length > 0) setSelectedStop(s[0]);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  // Load activities when stop or category changes
  useEffect(() => {
    if (!selectedStop?.city?.id) return;
    const load = async () => {
      setActivitiesLoading(true);
      try {
        const res = await getCityActivities(
          selectedStop.city.id,
          activeCategory === 'ALL' ? undefined : activeCategory
        );
        setActivities(res.data?.activities || []);
      } catch { setActivities([]); }
      finally { setActivitiesLoading(false); }
    };
    load();
  }, [selectedStop, activeCategory]);

  // Add activity to stop
  const handleAddToItinerary = async (activity) => {
    if (!selectedStop) return;
    setAddingId(activity.id);
    try {
      await axiosInstance.post(`/trips/${id}/stops/${selectedStop.id}/activities`, {
        activityId: activity.id,
        cost: activity.costPerPerson || 0,
      });
      setAddedIds(prev => new Set(prev).add(activity.id));
    } catch (err) {
      console.error('Failed to add activity', err);
    }
    setAddingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="animate-spin text-[#F5C142]" />
      </div>
    );
  }

  if (stops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-20 h-20 bg-[#F5C142] rounded-full flex items-center justify-center mb-4 border-3 border-[#1A1A1A]"
          style={{ boxShadow: '4px 4px 0px #1A1A1A' }}>
          <Compass size={32} className="text-[#1A1A1A]" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A] mb-2">No stops added yet</h2>
        <p className="text-sm text-[#6B7280] max-w-sm">
          Add stops to your trip first using the <b>Plan</b> tab, then come back here to discover activities.
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Compass size={22} className="text-[#F5C142]" />
          <h1 className="text-2xl font-black text-[#1A1A1A]">Activity Discovery</h1>
        </div>
        <p className="text-sm text-[#6B7280]">
          Explore activities at your destinations and add them to your itinerary.
        </p>
      </div>

      {/* Stop selector pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {stops.map((stop) => (
          <button
            key={stop.id}
            onClick={() => { setSelectedStop(stop); setActiveCategory('ALL'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold
                       border-2 transition-all duration-150
                       ${selectedStop?.id === stop.id
                         ? 'bg-[#F5C142] text-[#1A1A1A] border-[#1A1A1A]'
                         : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#1A1A1A]'
                       }`}
            style={selectedStop?.id === stop.id ? { boxShadow: '2px 2px 0px #1A1A1A' } : {}}
          >
            <MapPin size={12} />
            {stop.city?.name || 'Stop'}
          </button>
        ))}
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-[#9CA3AF]" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-150
                       ${activeCategory === cat
                         ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                         : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#1A1A1A]'
                       }`}
          >
            {cat === 'ALL' ? '🌐 All' : `${CAT_EMOJI[cat] || ''} ${cat.charAt(0) + cat.slice(1).toLowerCase()}`}
          </button>
        ))}
      </div>

      {/* Activity count */}
      <p className="text-xs text-[#6B7280] font-bold">
        {activitiesLoading ? 'Loading...' : `${activities.length} activities found`}
      </p>

      {/* Activity grid */}
      {activitiesLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#F5C142]" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#6B7280] font-bold">No activities found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {activities.map((act) => {
            const isAdded = addedIds.has(act.id);
            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border-2 border-[#1A1A1A] overflow-hidden
                           hover:-translate-y-1 transition-transform duration-150"
                style={{ boxShadow: '4px 4px 0px #1A1A1A' }}
              >
                {/* Category badge header */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${CAT_COLORS[act.category] || CAT_COLORS.OTHER}`}>
                    {act.category}
                  </span>
                  {act.isFree && (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      Free
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="px-4 pb-4">
                  <h3 className="text-base font-black text-[#1A1A1A] leading-snug mb-1">{act.name}</h3>
                  {act.description && (
                    <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">{act.description}</p>
                  )}

                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} /> {selectedStop?.city?.name}
                    </div>
                    {act.durationMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock size={11} /> {act.durationMinutes >= 60 ? `${(act.durationMinutes / 60).toFixed(1)}h` : `${act.durationMinutes}m`}
                      </div>
                    )}
                    {act.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-[#F5C142] fill-[#F5C142]" /> {act.rating}
                      </div>
                    )}
                  </div>

                  {/* Cost & actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#F5F0E8]">
                    <div className="flex items-center gap-0.5 text-sm font-black text-[#1A1A1A]">
                      <IndianRupee size={13} />
                      {act.isFree ? 'Free' : `${act.costPerPerson}/person`}
                    </div>
                    <button
                      onClick={() => handleAddToItinerary(act)}
                      disabled={isAdded || addingId === act.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black
                                 border-2 transition-all duration-150
                                 ${isAdded
                                   ? 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-default'
                                   : 'bg-[#F5C142] text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#E0AE30]'
                                 }`}
                      style={!isAdded ? { boxShadow: '2px 2px 0px #1A1A1A' } : {}}
                    >
                      {addingId === act.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : isAdded ? (
                        <><Bookmark size={12} /> Added</>
                      ) : (
                        <><Plus size={12} strokeWidth={3} /> Add</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
