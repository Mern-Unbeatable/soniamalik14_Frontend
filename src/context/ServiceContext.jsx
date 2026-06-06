import React, { createContext, useContext, useState, useCallback } from 'react';
import { GET, POST, PUT, PATCH, DELETE } from '../services/httpMethods';
import { ENDPOINT } from '../services/httpEndpoint';
import { toast } from 'react-toastify';

const ServiceContext = createContext(null);

export const ServiceProvider = ({ children }) => {
    const [approvedServices, setApprovedServices] = useState([]);
    const [providerServices, setProviderServices] = useState([]);
    const [pendingServices, setPendingServices] = useState([]);
    const [allServices, setAllServices] = useState([]);

    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatServiceValidationError = useCallback((err, fallbackMessage) => {
        const responseData = err?.response?.data;
        const fallback = fallbackMessage || err?.message || 'Request failed';

        if (!Array.isArray(responseData?.errors) || responseData.errors.length === 0) {
            return fallback;
        }

        const details = responseData.errors
            .map((entry) => {
                if (typeof entry === 'string') return entry;

                const field = entry?.path || entry?.field || entry?.param || entry?.name;
                const message = entry?.msg || entry?.message || entry?.error;

                if (field && message) return `${field}: ${message}`;
                return message || field || null;
            })
            .filter(Boolean)
            .join(' | ');

        return details ? `${responseData?.message || 'Validation error'}: ${details}` : fallback;
    }, []);

    // Fetch approved services (public)
    const fetchApprovedServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET(ENDPOINT.SERVICES.APPROVED);
            // Backend returns: { success: true, data: [...services] }
            let services = [];
            if (response?.data) {
                if (Array.isArray(response.data)) {
                    services = response.data;
                } else if (response.data.services && Array.isArray(response.data.services)) {
                    services = response.data.services;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    services = response.data.data;
                }
            }
            setApprovedServices(services);
            return { success: true, services };
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch approved services';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch provider's own services (uses authenticated token)
    const fetchProviderServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET(ENDPOINT.SERVICES.LIST);
            // Backend returns: { success: true, data: [...services] }
            let services = [];
            if (response?.data) {
                // If data is array directly
                if (Array.isArray(response.data)) {
                    services = response.data;
                }
                // If data has services property
                else if (response.data.services && Array.isArray(response.data.services)) {
                    services = response.data.services;
                }
                // If data property itself is the array
                else if (response.data.data && Array.isArray(response.data.data)) {
                    services = response.data.data;
                }
            }
            setProviderServices(services);
            return { success: true, services };
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch provider services';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch pending services (admin only)
    const fetchPendingServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET(ENDPOINT.SERVICES.PENDING);
            // Backend returns: { success: true, data: [...services] }
            let services = [];
            if (response?.data) {
                if (Array.isArray(response.data)) {
                    services = response.data;
                } else if (response.data.services && Array.isArray(response.data.services)) {
                    services = response.data.services;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    services = response.data.data;
                }
            }
            setPendingServices(services);
            return { success: true, services };
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch pending services';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch all services (admin - no filters)
    const fetchAllServices = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET(ENDPOINT.SERVICES.LIST);
            let services = [];
            if (response?.data) {
                if (Array.isArray(response.data)) {
                    services = response.data;
                } else if (response.data.services && Array.isArray(response.data.services)) {
                    services = response.data.services;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    services = response.data.data;
                }
            }
            setAllServices(services);
            return { success: true, services };
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch services';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new service (uses authenticated token to identify provider)
    const createService = useCallback(async (serviceData) => {
        setCreateLoading(true);
        setError(null);
        try {
            const response = await POST(ENDPOINT.SERVICES.CREATE, serviceData);

            // Handle different response structures
            let newService = null;
            if (response?.data) {
                if (response.data.service) {
                    newService = response.data.service;
                } else if (response.data.data) {
                    newService = response.data.data;
                } else {
                    newService = response.data;
                }
            } else {
                newService = response;
            }

            toast.success('Service created successfully! Waiting for admin approval.');

            // Refetch provider services to get complete data from backend
            await fetchProviderServices();

            return { success: true, service: newService };
        } catch (err) {
            const message = formatServiceValidationError(err, 'Failed to create service');
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setCreateLoading(false);
        }
    }, [fetchProviderServices, formatServiceValidationError]);

    // Update service
    const updateService = useCallback(async (serviceId, serviceData) => {
        if (!serviceId) {
            const msg = 'Service ID is required';
            toast.error(msg);
            return { success: false, message: msg };
        }

        setUpdateLoading(true);
        setError(null);
        try {
            const response = await PUT(ENDPOINT.SERVICES.UPDATE(serviceId), serviceData);
            const updatedService = response?.data?.service || response?.data || response;

            toast.success('Service updated successfully!');

            // Refetch provider services to get complete updated data from backend
            await fetchProviderServices();

            return { success: true, service: updatedService };
        } catch (err) {
            const message = formatServiceValidationError(err, 'Failed to update service');
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setUpdateLoading(false);
        }
    }, [fetchProviderServices, formatServiceValidationError]);

    // Delete service
    const deleteService = useCallback(async (serviceId) => {
        if (!serviceId) {
            const msg = 'Service ID is required';
            toast.error(msg);
            return { success: false, message: msg };
        }

        setDeleteLoading(true);
        setError(null);
        try {
            try {
                await DELETE(ENDPOINT.SERVICES.DELETE(serviceId));
            } catch (err) {
                // Some backends restrict delete to provider-scoped routes.
                if (err?.response?.status === 403) {
                    let fallbackSuccess = false;
                    const fallbackUrls = [
                        `/api/services/provider/my/${serviceId}`,
                        `/api/services/provider/${serviceId}`,
                    ];

                    for (const url of fallbackUrls) {
                        try {
                            await DELETE(url);
                            fallbackSuccess = true;
                            break;
                        } catch (fallbackErr) {
                            if (fallbackErr?.response?.status === 403 || fallbackErr?.response?.status === 404) {
                                continue;
                            }
                            throw fallbackErr;
                        }
                    }

                    if (!fallbackSuccess) {
                        throw err;
                    }
                } else {
                    throw err;
                }
            }

            // Remove from all lists
            setProviderServices(prev => prev.filter(s => s.id !== serviceId));
            setApprovedServices(prev => prev.filter(s => s.id !== serviceId));
            setPendingServices(prev => prev.filter(s => s.id !== serviceId));

            toast.success('Service deleted successfully!');
            return { success: true };
        } catch (err) {
            const responseMessage = err?.response?.data?.message;
            const message = err?.response?.status === 403
                ? responseMessage || 'You do not have permission to delete this service.'
                : responseMessage || err?.message || 'Failed to delete service';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setDeleteLoading(false);
        }
    }, []);

    // Approve service (admin only) - uses PATCH /api/services/{id}/approval-status
    const approveService = useCallback(async (serviceId) => {
        if (!serviceId) {
            const msg = 'Service ID is required';
            toast.error(msg);
            return { success: false, message: msg };
        }

        setLoading(true);
        setError(null);
        try {
            const payload = { action: 'approve' };
            const response = await PATCH(ENDPOINT.SERVICES.APPROVAL_STATUS(serviceId), payload);
            const approvedService = response?.data?.service || response?.data || response;

            // Update local lists
            setPendingServices(prev => prev.filter(s => s.id !== serviceId));
            setApprovedServices(prev => [approvedService, ...prev]);
            setAllServices(prev => prev.map(s => (s.id === serviceId ? approvedService : s)));

            toast.success('Service approved successfully!');
            return { success: true, service: approvedService };
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Failed to approve service';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Reject service (admin only) - uses PATCH /api/services/{id}/approval-status with reason
    const rejectService = useCallback(async (serviceId, reason = '') => {
        if (!serviceId) {
            const msg = 'Service ID is required';
            toast.error(msg);
            return { success: false, message: msg };
        }

        setLoading(true);
        setError(null);
        try {
            const payload = { action: 'reject', reason };
            const response = await PATCH(ENDPOINT.SERVICES.APPROVAL_STATUS(serviceId), payload);
            const rejectedService = response?.data?.service || response?.data || response;

            // Update local lists
            setPendingServices(prev => prev.filter(s => s.id !== serviceId));
            setAllServices(prev => prev.map(s => (s.id === serviceId ? rejectedService : s)));

            toast.success('Service rejected!');
            return { success: true, service: rejectedService };
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Failed to reject service';
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        // State
        approvedServices,
        providerServices,
        pendingServices,
        allServices,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        error,

        // Actions
        fetchApprovedServices,
        fetchProviderServices,
        fetchPendingServices,
        fetchAllServices,
        createService,
        updateService,
        deleteService,
        approveService,
        rejectService,
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const ctx = useContext(ServiceContext);
    if (!ctx) throw new Error('useService must be used within ServiceProvider');
    return ctx;
};

export default ServiceContext;
