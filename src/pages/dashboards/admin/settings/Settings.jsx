import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { ChevronDown } from 'lucide-react';
import AddCategoryModal from './components/AddCategoryModal';
import { fetchSportsCategories, createSportsCategory } from '../../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories, selectSportsCategoriesLoading } from '../../../../features/sportsCategories/sportsCategoriesSlice';

const Settings = () => {
  const dispatch = useDispatch();
  // const [inviteEmail, setInviteEmail] = useState('');
  // const [inviteRole, setInviteRole] = useState('Moderator');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // const handleSendInvite = (e) => {
  //   e.preventDefault();
  //   // Implement invite logic here
  //   console.log(`Inviting ${inviteEmail} as ${inviteRole}`);
  //   setInviteEmail('');
  // };

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
                <svg className="h-4 w-4 animate-spin text-[#0f766e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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
                    className="rounded-full bg-[#0f766e] px-5 py-2.5 text-sm font-medium text-white shadow-sm"
                  >
                    {name}
                  </span>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No sport categories found.</p>
            )}
          </div>
        </section>

        {/* --- Role & Permission Strategy Section --- */}
        {/* <section>
          <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-6">Role & Permission Strategy</h2>

         
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-[700px]">
            <h3 className="text-[26px] font-semibold text-gray-900 mb-2">Invite your team</h3>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
              Easily add new members to a role by entering their email addresses<br className="hidden md:block" />
              below. Once invited, they'll receive an email with a link to join.
            </p>

            <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row items-stretch gap-3">

              <div className="flex-1">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-[#f1f5f9] border-none text-gray-800 text-sm px-4 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 placeholder-gray-400"
                  required
                />
              </div>

   
              <div className="relative">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="appearance-none w-full sm:w-[140px] bg-[#042f2e] text-white text-sm font-medium px-4 py-3.5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e]/50 cursor-pointer"
                >
                  <option value="Moderator">Moderator</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
                <ChevronDown className="w-4 h-4 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

             
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#0f766e] text-white text-sm font-medium rounded-lg hover:bg-teal-800 transition-colors shadow-sm whitespace-nowrap"
              >
                Send Invite
              </button>
            </form>
          </div>
        </section> */}
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCategory}
      />
    </div>
  );
};

export default Settings;
