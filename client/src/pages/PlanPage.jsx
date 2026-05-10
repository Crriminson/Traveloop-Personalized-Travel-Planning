import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import {
  DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CalendarDays, GripVertical, Clock, IndianRupee, Trash2, Edit3,
  Loader2, Plus, X, MapPin, Star, Save,
} from 'lucide-react';
import { getStops } from '../api/stops.api';
import axiosInstance from '../api/axiosInstance';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
};

const getDaysArray = (start, end) => {
  if (!start || !end) return [{ label: 'Day 1', date: null }];
  const days = [];
  const s = new Date(start);
  const e = new Date(end);
  let i = 1;
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    days.push({
      label: `D${i}`,
      date: new Date(d),
      dayIndex: i - 1,
    });
    i++;
  }
  return days.length > 0 ? days : [{ label: 'Day 1', date: null, dayIndex: 0 }];
};

const CAT_COLORS = {
  SIGHTSEEING: 'border-l-amber-400', FOOD: 'border-l-orange-400',
  ADVENTURE: 'border-l-sky-400', CULTURAL: 'border-l-violet-400',
  RELAXATION: 'border-l-emerald-400', SHOPPING: 'border-l-pink-400',
  TRANSPORT: 'border-l-slate-400', OTHER: 'border-l-gray-400',
};

const CAT_EMOJI = {
  SIGHTSEEING: '🏛️', FOOD: '🍜', ADVENTURE: '🏔️', CULTURAL: '🎭',
  RELAXATION: '🧘', SHOPPING: '🛍️', TRANSPORT: '🚌', OTHER: '📌',
};

/* ─── Sortable Activity Card ──────────────────────────────────────────────── */

const SortableActivity = ({ activity, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const cat = activity.activity?.category || 'OTHER';
  const name = activity.customName || activity.activity?.name || 'Activity';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 bg-white rounded-xl border-2 border-[#1A1A1A] border-l-4
                 ${CAT_COLORS[cat] || CAT_COLORS.OTHER}
                 px-3 py-2.5 group hover:bg-[#FFFBF0] transition-colors`}
      {...attributes}
    >
      {/* Drag handle */}
      <button {...listeners} className="mt-0.5 cursor-grab active:cursor-grabbing text-[#D1D5DB] hover:text-[#1A1A1A]">
        <GripVertical size={14} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{CAT_EMOJI[cat] || '📌'}</span>
          <p className="text-sm font-bold text-[#1A1A1A] truncate">{name}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#9CA3AF]">
          {activity.startTime && (
            <span className="flex items-center gap-0.5"><Clock size={9} /> {activity.startTime}</span>
          )}
          {activity.cost > 0 && (
            <span className="flex items-center gap-0.5"><IndianRupee size={9} /> ₹{activity.cost}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(activity)} className="p-1 rounded hover:bg-[#F5F0E8]">
          <Edit3 size={12} className="text-[#6B7280]" />
        </button>
        <button onClick={() => onDelete(activity)} className="p-1 rounded hover:bg-red-50">
          <Trash2 size={12} className="text-[#EF4444]" />
        </button>
      </div>
    </div>
  );
};

/* ─── Overlay card (shown while dragging) ─────────────────────────────────── */

const DragOverlayCard = ({ activity }) => {
  const name = activity?.customName || activity?.activity?.name || 'Activity';
  return (
    <div className="bg-[#F5C142] rounded-xl border-2 border-[#1A1A1A] px-4 py-3 shadow-lg w-[220px]"
      style={{ boxShadow: '4px 4px 0px #1A1A1A' }}>
      <p className="text-sm font-black text-[#1A1A1A] truncate">{name}</p>
    </div>
  );
};

/* ─── Edit Floating Panel ─────────────────────────────────────────────────── */

const EditPanel = ({ activity, onSave, onClose }) => {
  const [customName, setCustomName] = useState(activity?.customName || activity?.activity?.name || '');
  const [startTime, setStartTime] = useState(activity?.startTime || '');
  const [endTime, setEndTime] = useState(activity?.endTime || '');
  const [cost, setCost] = useState(activity?.cost || 0);
  const [notes, setNotes] = useState(activity?.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...activity, customName, startTime, endTime, cost: Number(cost), notes });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-3xl border-2 border-[#1A1A1A] p-6 w-[400px] max-w-[90vw] space-y-4"
        style={{ boxShadow: '6px 6px 0px #1A1A1A' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#1A1A1A]">Edit Activity</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F0E8]"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Name</label>
            <input value={customName} onChange={e => setCustomName(e.target.value)}
              className="w-full border-2 border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:border-[#1A1A1A] focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Start Time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                className="w-full border-2 border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:border-[#1A1A1A] focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">End Time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                className="w-full border-2 border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:border-[#1A1A1A] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Cost (₹)</label>
            <input type="number" value={cost} onChange={e => setCost(e.target.value)}
              className="w-full border-2 border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:border-[#1A1A1A] focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full border-2 border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:border-[#1A1A1A] focus:outline-none resize-none" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#F5C142] text-[#1A1A1A] font-black text-sm
                     rounded-xl px-4 py-3 border-2 border-[#1A1A1A] hover:bg-[#E0AE30] transition-colors disabled:opacity-50"
          style={{ boxShadow: '3px 3px 0px #1A1A1A' }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ─── Plan Page ────────────────────────────────────────────────────────────── */

const PlanPage = () => {
  const { id } = useParams();
  const { trip } = useOutletContext();
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesByStop, setActivitiesByStop] = useState({});
  const [editingActivity, setEditingActivity] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const days = useMemo(() => getDaysArray(trip?.startDate, trip?.endDate), [trip]);

  // Load stops + their activities
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStops(id);
        const s = Array.isArray(res.data) ? res.data : (res.data?.stops || []);
        setStops(s);

        // Fetch activities for each stop
        const map = {};
        for (const stop of s) {
          try {
            const actRes = await axiosInstance.get(`/trips/${id}/stops/${stop.id}/activities`);
            const acts = actRes.data?.data || [];
            map[stop.id] = Array.isArray(acts) ? acts : [];
          } catch { map[stop.id] = []; }
        }
        setActivitiesByStop(map);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  // All activities flat (for drag context)
  const allActivities = useMemo(() => {
    return Object.values(activitiesByStop).flat();
  }, [activitiesByStop]);

  // Group activities by dayOffset
  const activitiesByDay = useMemo(() => {
    const map = {};
    days.forEach((_, i) => { map[i] = []; });
    allActivities.forEach(act => {
      const day = act.dayOffset || 0;
      if (!map[day]) map[day] = [];
      map[day].push(act);
    });
    // Sort each day by orderIndex
    Object.keys(map).forEach(k => {
      map[k].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    });
    return map;
  }, [allActivities, days]);

  const handleDragStart = (event) => { setActiveId(event.active.id); };

  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Find which day column the active and over items are in
    // For now, handle reorder within the same list
    const dayKey = Object.keys(activitiesByDay).find(k =>
      activitiesByDay[k].some(a => a.id === active.id)
    );
    if (!dayKey) return;

    const items = [...activitiesByDay[dayKey]];
    const oldIdx = items.findIndex(a => a.id === active.id);
    const newIdx = items.findIndex(a => a.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(items, oldIdx, newIdx);

    // Optimistic update
    setActivitiesByStop(prev => {
      const next = { ...prev };
      // Find which stop these belong to
      for (const stopId of Object.keys(next)) {
        const hasItem = next[stopId].some(a => a.id === active.id);
        if (hasItem) {
          next[stopId] = next[stopId].map(a => {
            const idx = reordered.findIndex(r => r.id === a.id);
            return idx >= 0 ? { ...a, orderIndex: idx } : a;
          });
        }
      }
      return next;
    });

    // Persist reorder on server
    try {
      const stopId = allActivities.find(a => a.id === active.id)?.stopId;
      if (stopId) {
        await axiosInstance.patch(`/trips/${id}/stops/${stopId}/activities/reorder`, {
          items: reordered.map((a, i) => ({ id: a.id, orderIndex: i })),
        });
      }
    } catch { /* revert if needed */ }
  };

  const handleDelete = async (activity) => {
    if (!confirm('Remove this activity?')) return;
    try {
      await axiosInstance.delete(`/trips/${id}/stops/${activity.stopId}/activities/${activity.id}`);
      setActivitiesByStop(prev => {
        const next = { ...prev };
        if (next[activity.stopId]) {
          next[activity.stopId] = next[activity.stopId].filter(a => a.id !== activity.id);
        }
        return next;
      });
    } catch { /* ignore */ }
  };

  const handleEditSave = async (updated) => {
    try {
      await axiosInstance.put(
        `/trips/${id}/stops/${updated.stopId}/activities/${updated.id}`,
        {
          customName: updated.customName,
          startTime: updated.startTime || null,
          endTime: updated.endTime || null,
          cost: updated.cost,
          notes: updated.notes || null,
        }
      );
      setActivitiesByStop(prev => {
        const next = { ...prev };
        if (next[updated.stopId]) {
          next[updated.stopId] = next[updated.stopId].map(a =>
            a.id === updated.id ? { ...a, ...updated } : a
          );
        }
        return next;
      });
    } catch { /* ignore */ }
    setEditingActivity(null);
  };

  const draggedActivity = activeId ? allActivities.find(a => a.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="animate-spin text-[#F5C142]" />
      </div>
    );
  }

  // Compute total budget for the header bar
  const totalCost = allActivities.reduce((s, a) => s + (a.cost || 0), 0);

  return (
    <div className="px-6 py-6 space-y-5 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-[#F5C142]" />
          <div>
            <h1 className="text-2xl font-black text-[#1A1A1A]">Planning Board</h1>
            <p className="text-xs text-[#6B7280]">
              {trip?.name} · {formatDate(trip?.startDate)} — {formatDate(trip?.endDate)}
            </p>
          </div>
        </div>

        {/* Budget bar */}
        <div className="flex items-center gap-3 bg-white rounded-full border-2 border-[#1A1A1A] px-4 py-2"
          style={{ boxShadow: '2px 2px 0px #1A1A1A' }}>
          <IndianRupee size={14} className="text-[#1A1A1A]" />
          <span className="text-sm font-black text-[#1A1A1A]">₹{totalCost.toLocaleString('en-IN')}</span>
          {trip?.totalBudget && (
            <span className="text-xs text-[#6B7280]">/ ₹{trip.totalBudget.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="w-20 h-20 bg-[#F5C142] rounded-full flex items-center justify-center mb-4 border-3 border-[#1A1A1A]"
            style={{ boxShadow: '4px 4px 0px #1A1A1A' }}>
            <CalendarDays size={32} className="text-[#1A1A1A]" />
          </div>
          <h2 className="text-xl font-black text-[#1A1A1A] mb-2">No stops yet</h2>
          <p className="text-sm text-[#6B7280] max-w-sm">
            Add stops to this trip from the <b>Overview</b> tab, then plan your daily itinerary here.
          </p>
        </div>
      ) : (
        /* Day columns — horizontal scroll */
        <DndContext sensors={sensors} collisionDetection={closestCorners}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-4 pb-4 min-h-[400px]" style={{ minWidth: `${days.length * 280}px` }}>
              {days.map((day, dayIdx) => {
                const dayActs = activitiesByDay[dayIdx] || [];
                // Find which stop covers this day
                const dayStop = stops[Math.min(dayIdx, stops.length - 1)];
                const dayCost = dayActs.reduce((s, a) => s + (a.cost || 0), 0);

                return (
                  <div key={dayIdx} className="w-[260px] flex-shrink-0">
                    {/* Day header */}
                    <div className="bg-[#F5C142] rounded-t-2xl border-2 border-[#1A1A1A] px-4 py-3"
                      style={{ boxShadow: '2px 2px 0px #1A1A1A' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#1A1A1A] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                            {day.label}
                          </span>
                          <span className="text-xs font-bold text-[#1A1A1A]">
                            {day.date ? formatDate(day.date) : 'Flexible'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-[#1A1A1A]/70 flex items-center gap-1">
                          <MapPin size={9} /> {dayStop?.city?.name || 'TBD'}
                        </p>
                        <p className="text-[10px] font-bold text-[#1A1A1A]">₹{dayCost.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Activities column */}
                    <div className="bg-white/60 border-2 border-t-0 border-[#1A1A1A] rounded-b-2xl px-2 py-2 min-h-[200px] space-y-2">
                      <SortableContext items={dayActs.map(a => a.id)} strategy={verticalListSortingStrategy}>
                        {dayActs.map(act => (
                          <SortableActivity
                            key={act.id}
                            activity={act}
                            onEdit={setEditingActivity}
                            onDelete={handleDelete}
                          />
                        ))}
                      </SortableContext>

                      {dayActs.length === 0 && (
                        <div className="flex items-center justify-center h-[120px] border-2 border-dashed border-[#D1D5DB] rounded-xl">
                          <p className="text-xs text-[#9CA3AF] font-bold">Drop activities here</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DragOverlay>
            {draggedActivity ? <DragOverlayCard activity={draggedActivity} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Edit panel */}
      {editingActivity && (
        <EditPanel activity={editingActivity} onSave={handleEditSave} onClose={() => setEditingActivity(null)} />
      )}
    </div>
  );
};

export default PlanPage;
