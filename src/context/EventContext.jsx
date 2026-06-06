import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import eventsData from '../data/eventsData.json';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize events from JSON data
    useEffect(() => {
        setEvents(eventsData || []);
    }, []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Simulate async call with local data
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const eventsList = eventsData || [];
            setEvents(eventsList);
            return { success: true, events: eventsList };
        } catch (err) {
            console.error('Error fetching events:', err);
            const message = err?.message || 'Failed to fetch events';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch single event details
    const fetchEventById = useCallback(async (eventId) => {
        if (!eventId) {
            toast.error('Event ID is required');
            return { success: false, message: 'Event ID is required' };
        }

        setLoading(true);
        setError(null);
        try {
            // Simulate async call with local data
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const event = (eventsData || []).find(e => e.id === eventId);
            if (!event) {
                throw new Error('Event not found');
            }
            return { success: true, event };
        } catch (err) {
            const message = err?.message || 'Failed to fetch event details';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new event (uses local state)
    const createEvent = useCallback(async (eventData) => {
        setCreateLoading(true);
        setError(null);
        try {
            // Simulate async call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Generate new ID based on max existing ID
            const maxId = Math.max(...events.map(e => e.id || 0), 0);
            const newEvent = {
                ...eventData,
                id: maxId + 1,
                status: eventData.status || 'Pending'
            };

            setEvents(prev => [...prev, newEvent]);
            toast.success('Event created successfully!');

            return { success: true, event: newEvent };
        } catch (err) {
            const message = err?.message || 'Failed to create event';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setCreateLoading(false);
        }
    }, [events]);

    // Update event
    const updateEvent = useCallback(async (eventId, eventData) => {
        if (!eventId) {
            toast.error('Event ID is required');
            return { success: false, message: 'Event ID is required' };
        }

        setUpdateLoading(true);
        setError(null);
        try {
            // Simulate async call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const updatedEvent = { ...eventData, id: eventId };
            
            setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event));
            toast.success('Event updated successfully!');

            return { success: true, event: updatedEvent };
        } catch (err) {
            const message = err?.message || 'Failed to update event';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setUpdateLoading(false);
        }
    }, []);

    // Delete event
    const deleteEvent = useCallback(async (eventId) => {
        if (!eventId) {
            toast.error('Event ID is required');
            return { success: false, message: 'Event ID is required' };
        }

        setDeleteLoading(true);
        setError(null);
        try {
            // Simulate async call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setEvents((prev) => prev.filter((event) => event.id !== eventId));
            toast.success('Event deleted successfully!');

            return { success: true };
        } catch (err) {
            const message = err?.message || 'Failed to delete event';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setDeleteLoading(false);
        }
    }, []);

    // Approve event
    const approveEvent = useCallback(async (eventId) => {
        if (!eventId) {
            toast.error('Event ID is required');
            return { success: false, message: 'Event ID is required' };
        }

        setUpdateLoading(true);
        setError(null);
        try {
            // Simulate async call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setEvents(prev => prev.map(event => 
                event.id === eventId ? { ...event, status: 'Approved' } : event
            ));

            toast.success('Event approved successfully!');

            return { success: true, data: { status: 'Approved' } };
        } catch (err) {
            const message = err?.message || 'Failed to approve event';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setUpdateLoading(false);
        }
    }, []);

    // Reject event
    const rejectEvent = useCallback(async (eventId, rejectionReason) => {
        if (!eventId) {
            toast.error('Event ID is required');
            return { success: false, message: 'Event ID is required' };
        }

        if (!rejectionReason || rejectionReason.trim() === '') {
            toast.error('Rejection reason is required');
            return { success: false, message: 'Rejection reason is required' };
        }

        setUpdateLoading(true);
        setError(null);
        try {
            // Simulate async call
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setEvents(prev => prev.map(event => 
                event.id === eventId ? { ...event, status: 'Rejected', rejectionReason: rejectionReason.trim() } : event
            ));

            toast.success('Event rejected successfully!');

            return { success: true, data: { status: 'Rejected', rejectionReason } };
        } catch (err) {
            const message = err?.message || 'Failed to reject event';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setUpdateLoading(false);
        }
    }, []);

    const value = {
        events,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        error,
        fetchEvents,
        fetchEventById,
        createEvent,
        updateEvent,
        deleteEvent,
        approveEvent,
        rejectEvent,
    };

    return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvent = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};
