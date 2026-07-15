import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2, X } from 'lucide-react';
import { DELETE, GET } from '../../../../services/httpMethods';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModal, setDetailModal] = useState({ open: false, loading: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, loading: false, item: null });
  const itemsPerPage = 8;

  const fetchBrands = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await GET('/api/brands');
      const payload = response?.data || response;
      const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      setBrands(data);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const totalItems = brands.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentBrands = useMemo(
    () => brands.slice(startIndex, endIndex),
    [brands, startIndex, endIndex]
  );

  const truncateBusinessName = (value = '') => {
    const text = String(value || '').trim();
    if (text.length <= 28) return text || 'N/A';
    return `${text.slice(0, 28)}...`;
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  const openDetailsModal = async (brandId) => {
    if (!brandId) return;
    setDetailModal({ open: true, loading: true, data: null });

    try {
      const response = await GET(`/api/brands/${encodeURIComponent(brandId)}`);
      const payload = response?.data || response;
      const brand = payload?.data || payload || null;
      setDetailModal({ open: true, loading: false, data: brand });
    } catch (err) {
      console.error('Failed to fetch brand details:', err);
      toast.error(err?.response?.data?.message || 'Failed to load brand details.');
      setDetailModal({ open: false, loading: false, data: null });
    }
  };

  const closeDetailsModal = () => {
    if (detailModal.loading) return;
    setDetailModal({ open: false, loading: false, data: null });
  };

  const openDeleteModal = (brand) => {
    setDeleteModal({ open: true, loading: false, item: brand });
  };

  const closeDeleteModal = () => {
    if (deleteModal.loading) return;
    setDeleteModal({ open: false, loading: false, item: null });
  };

  const handleDeleteBrand = async () => {
    const targetId = deleteModal?.item?.id;
    if (!targetId) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await DELETE(`/api/brands/${encodeURIComponent(targetId)}`);
      setBrands((prev) => prev.filter((brand) => brand?.id !== targetId));
      toast.success('Brand deleted successfully.');
      setDeleteModal({ open: false, loading: false, item: null });
    } catch (err) {
      console.error('Failed to delete brand:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete brand.');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner label="Loading brands..." containerClassName="py-0" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
          <p className="mb-4 font-medium text-red-600">Error: {error}</p>
          <button
            onClick={fetchBrands}
            className="rounded-lg bg-[#0f766e] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Brand Applications</h1>
          <p className="mt-1 text-sm text-gray-500">Manage marketplace join requests from partners.</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-[#E7F1F1]">
                  <th className="whitespace-nowrap px-6 py-4 text-base font-semibold text-black">Name</th>
                  <th className="whitespace-nowrap px-6 py-4 text-base font-semibold text-black">Email</th>
                  <th className="whitespace-nowrap px-6 py-4 text-base font-semibold text-black">Phone</th>
                  <th className="whitespace-nowrap px-6 py-4 text-base font-semibold text-black">Postcode</th>
                  <th className="whitespace-nowrap px-6 py-4 text-base font-semibold text-black">Business Name</th>
                  <th className="whitespace-nowrap px-6 py-4 text-center text-base font-semibold text-black">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {currentBrands.length > 0 ? (
                  currentBrands.map((row, idx) => (
                    <tr key={row?.id || idx} className="transition-colors hover:bg-gray-50/70">
                      <td className="whitespace-nowrap px-6 py-5 text-base font-medium text-gray-800">
                        {row?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-5 text-base text-gray-600">{row?.email || 'N/A'}</td>
                      <td className="whitespace-nowrap px-6 py-5 text-base text-gray-600">
                        {row?.phone || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-base text-gray-600">
                        {row?.postCode || 'N/A'}
                      </td>
                      <td className="px-6 py-5 text-base text-gray-600" title={row?.businessname || ''}>
                        {truncateBusinessName(row?.businessname)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDetailsModal(row?.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0f766e]/30 text-[#0f766e] transition-colors hover:bg-[#0f766e]/10"
                            aria-label="View brand details"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(row)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                            aria-label="Delete brand"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-base text-gray-500">
                      No brand applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-5 sm:flex-row">
            <span className="text-sm font-medium text-[#0f766e]">
              Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={validCurrentPage === 1}
                className="rounded-lg border border-[#0f766e] bg-white px-5 py-2 text-sm font-medium text-[#0f766e] transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={validCurrentPage === totalPages}
                className="rounded-lg border border-[#0f766e] bg-white px-5 py-2 text-sm font-medium text-[#0f766e] transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {detailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">Brand Details</h3>
              <button
                type="button"
                onClick={closeDetailsModal}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
                aria-label="Close details modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailModal.loading ? (
              <div className="p-8">
                <LoadingSpinner label="Loading details..." />
              </div>
            ) : (
              <div className="space-y-4 px-6 py-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Name</p>
                    <p className="mt-1 text-sm text-gray-800">{detailModal?.data?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</p>
                    <p className="mt-1 text-sm text-gray-800 break-all">{detailModal?.data?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                    <p className="mt-1 text-sm text-gray-800">{detailModal?.data?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Postcode</p>
                    <p className="mt-1 text-sm text-gray-800">{detailModal?.data?.postCode || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Business Name
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{detailModal?.data?.businessname || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Offer</p>
                  <p className="mt-1 text-sm text-gray-800">{detailModal?.data?.offer || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Social Media Links
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-all text-sm text-gray-800">
                    {detailModal?.data?.socialMediaLinks || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Message</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                    {detailModal?.data?.message || 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Brand?</h3>
            <p className="mt-2 text-sm text-gray-500">
              {`Are you sure you want to delete "${deleteModal?.item?.businessname || deleteModal?.item?.name || 'this brand'}"?`}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteModal.loading}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBrand}
                disabled={deleteModal.loading}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteModal.loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;