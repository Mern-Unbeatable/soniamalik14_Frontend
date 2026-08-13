import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Edit3, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from '../../../../components/ui/Pagination';
import DeleteConfirmationModal from '../../../../components/ui/DeleteConfirmationModal';
import CreateRecruitmentModal from '../../../../components/ui/CreateRecruitmentModal';
import EventModal from '../../../../components/ui/EventModal';
import { fetchProviderListings, deleteProviderListing } from '../../../../features/providerListing/providerListingAPI';
import { selectProviderListings } from '../../../../features/providerListing/providerListingSlice';
import {
  handleImageLoadError,
  pickImageSource,
  resolveImageUrl,
} from '../../../../utils/resolveImageUrl';

const LISTING_PLACEHOLDER = '/discover-placeholder.png';

const AddListing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingService, setEditingService] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const reduxServices = useSelector(selectProviderListings);
  console.log('AddListing loaded services from Redux:', reduxServices);

  useEffect(() => {
    dispatch(fetchProviderListings());
  }, [dispatch]);

  const listingSource = useMemo(
    () => (Array.isArray(reduxServices) ? reduxServices : []),
    [reduxServices]
  );

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(listingSource.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedServices = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return listingSource.slice(startIndex, startIndex + itemsPerPage);
  }, [listingSource, safeCurrentPage]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setModalMode('edit');
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await dispatch(deleteProviderListing(deleteItem.id)).unwrap();
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
    setDeleteItem(null);
  };

  const handleModalSuccess = () => {
    dispatch(fetchProviderListings());
    setCurrentPage(1);
  };

  return (
    <div className="dashboardPy">
      <div className="rounded-lg bg-[#F8FAFC] ">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1D1D1D]">Manage Your Services</h1>
            <p className="mt-1 text-base text-[#585858]">
              This is where you manage all the services you provide to the women's sports community.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d655d]"
          >
            <Plus className="h-4 w-4" />
            Create Service
          </button>
        </div>

        {listingSource.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center">
            <p className="text-base text-gray-600">No listing available yet. Create your first service listing.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 rounded-md bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d655d]"
            >
              Create Service
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 ">
              {paginatedServices.map((service) => (
                <article
                  key={service.id}
                  onClick={() =>
                    navigate(`/provider/add-listing/${service.id}`, {
                      state: { item: service, from: 'add-listing' },
                    })
                  }
                  className="flex h-full min-h-88.75 flex-col rounded-lg border border-[#DDE8E8] bg-[#E7F1F180] p-3 shadow-sm cursor-pointer"
                >
                  <div className="relative mb-3 h-40 overflow-hidden rounded-md bg-[#D9D9D9] ">
                    <img
                      src={resolveImageUrl(
                        pickImageSource(service.logo, service.image, service.thumbnail),
                        LISTING_PLACEHOLDER
                      )}
                      alt={service.listingHeadline || service.title || 'Listing'}
                      className="h-full w-full object-cover"
                      onError={(e) => handleImageLoadError(e, LISTING_PLACEHOLDER)}
                    />
                    {(service.category || service.tag) && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#E7F1F1] px-2 py-1 text-xs text-[#0F766E]">
                        {service.category || service.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex min-h-30 flex-col">
                    <h3 className="line-clamp-2 text-2xl font-semibold leading-[1.2] text-[#323232]">
                      {service.listingHeadline || service.title || 'Untitled service'}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-base text-[#4B5563]">
                      {service.description || 'No description available.'}
                    </p>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(service);
                      }}
                      className="inline-flex items-center justify-center gap-1 rounded-md bg-[#0F766E] px-3 py-2 text-sm font-medium text-white hover:bg-[#0d655d]"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteItem(service);
                      }}
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-[#6FAAA5] bg-[#B5D5D2] px-3 py-2 text-sm font-medium text-[#0E6B64] hover:bg-[#a0c4c1]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {listingSource.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  page={safeCurrentPage}
                  total={totalPages}
                  onChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
                />
              </div>
            )}

            {listingSource.length > itemsPerPage && (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
                <ChevronLeft className="h-4 w-4" />
                <span>
                  Showing {(safeCurrentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(safeCurrentPage * itemsPerPage, listingSource.length)} of {listingSource.length}
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </>
        )}
      </div>

      <CreateRecruitmentModal
        key={`${modalMode}-${editingService?.id ?? 'new'}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={editingService}
        onSuccess={handleModalSuccess}
        onSwitchToEvent={() => setIsEventModalOpen(true)}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        mode="create"
        useOrganizerApi
        onSuccess={handleModalSuccess}
        onSwitchToSession={() => {
          setModalMode('create');
          setEditingService(null);
          setIsModalOpen(true);
        }}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteItem?.listingHeadline || deleteItem?.title || 'this service'}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AddListing;
