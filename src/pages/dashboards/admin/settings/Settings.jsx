import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import AddCategoryModal from './components/AddCategoryModal';
import {
  fetchSportsCategories,
  createSportsCategory,
  updateSportsCategory,
  deleteSportsCategory,
} from '../../../../features/sportsCategories/sportsCategoriesAPI';
import {
  selectSportsCategories,
  selectSportsCategoriesLoading,
} from '../../../../features/sportsCategories/sportsCategoriesSlice';

const Settings = () => {
  const dispatch = useDispatch();
  // const [inviteEmail, setInviteEmail] = useState('');
  // const [inviteRole, setInviteRole] = useState('Moderator');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const sportsCategories = useSelector(selectSportsCategories);
  const isLoadingCategories = useSelector(selectSportsCategoriesLoading);

  useEffect(() => {
    dispatch(fetchSportsCategories());
  }, [dispatch]);

  const handleAddCategory = async (sportName) => {
    try {
      await dispatch(createSportsCategory({ name: sportName })).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      // Keep modal open so the user can see the error toast and correct the input
    }
  };

  const handleEditCategory = async (sportName) => {
    try {
      if (editingCategory?.id) {
        await dispatch(updateSportsCategory({ id: editingCategory.id, name: sportName })).unwrap();
        setEditingCategory(null);
      }
    } catch (err) {
      // Keep modal open on error
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteSportsCategory(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  return (
    <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
      <div className="space-y-8">
        {/* --- Sport Categories Section --- */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Sport Categories</h1>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                Manage the sport types available on your platform.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-btn-primary flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-teal-700 sm:px-6 sm:py-3 sm:text-base"
            >
              Add Category
            </button>
          </div>

          {/* Tags Container */}
          <div className="mt-6 flex flex-wrap gap-3">
            {isLoadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="h-4 w-4 animate-spin text-[#0f766e]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading categories...
              </div>
            ) : sportsCategories.length > 0 ? (
              sportsCategories.map((sport, index) => {
                const name = typeof sport === 'object' ? sport.name : sport;
                return (
                  <span
                    key={sport?.id || index}
                    className="flex items-center gap-2 rounded-full bg-[#0f766e] pl-5 pr-3 py-2 text-sm font-medium text-white shadow-sm"
                  >
                    <span>{name}</span>
                    {sport?.id && (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => setEditingCategory(sport)}
                          className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(sport.id)}
                          className="rounded-full p-1 text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </span>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No sport categories found.</p>
            )}
          </div>
        </section>
      </div>

      <AddCategoryModal
        isOpen={isModalOpen || !!editingCategory}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={editingCategory ? handleEditCategory : handleAddCategory}
        initialName={editingCategory ? editingCategory.name : ''}
      />
    </div>
  );
};

export default Settings;
