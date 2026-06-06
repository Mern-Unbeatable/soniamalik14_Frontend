// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Card from './Card';
// import Button from './Button';
// import { MapPin, Calendar, Clock } from 'lucide-react';
// import { FiEdit, FiTrash2 } from 'react-icons/fi';
// import EventModal from './EventModal';
// import DeleteConfirmationModal from './DeleteConfirmationModal';

// const ServiceCard = ({ item = {}, editLink, onEdit, onDelete, className = '' }) => {
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//     const handleEditClick = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (onEdit) {
//             onEdit(item);
//             return;
//         }

//         setIsEditModalOpen(true);
//     };

//     const handleDeleteClick = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDeleteModalOpen(true);
//     };

//     const handleDeleteConfirm = () => {
//         if (onDelete) onDelete(item);
//     };

//     return (
//         <>
//             <Link to={`/provider/service/${item.id}`} state={{ item, from: 'service' }} className="block h-full">
//                 <Card className={`p-4 flex flex-col justify-between rounded-lg overflow-hidden !bg-[#E7F1F180] ${className}`}>
//                     <div className="flex-1">
//                         <div className="relative">
//                             {(item.category || item.tag) && (
//                                 <div className="absolute top-3 left-3 z-10 rounded-md px-3 py-1 text-base font-medium text-[#0F766E] bg-[#E7F1F1]">{item.category || item.tag}</div>
//                             )}

//                             <div className="h-36 bg-gray-200 rounded-md mb-4 overflow-hidden flex items-center justify-center">
//                                 {item.image ? (
//                                     <img src={item.image} alt={item.title} className="w-full h-full  rounded-md" />
//                                 ) : (
//                                     <div className="text-[#000000] bg-[#D9D9D9] rounded-md p-4">Image</div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="h-24 mb-2 overflow-hidden">
//                             <h3 className="text-[#282828] font-semibold text-lg mb-2 ">{item.title}</h3>
//                             <div
//                                 className="text-base text-[#363636]"
//                                 style={{
//                                     display: '-webkit-box',
//                                     WebkitLineClamp: 2,
//                                     WebkitBoxOrient: 'vertical',
//                                     overflow: 'hidden',
//                                 }}
//                             >
//                                 {item.description}
//                             </div>
//                         </div>



//                     </div>

//                     <div className="mt-2" onClick={(e) => e.preventDefault()}>
//                         <div className="flex gap-3">
//                             {editLink ? (
//                                 <Link to={editLink} className="w-1/2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
//                                     <Button className="w-full rounded-lg flex items-center justify-center gap-2" variant="primary">
//                                         <FiEdit className="w-4 h-4" /> <span>Edit</span>
//                                     </Button>
//                                 </Link>
//                             ) : (
//                                 <Button onClick={handleEditClick} className="w-1/2 rounded-lg flex items-center justify-center gap-2" variant="primary">
//                                     <FiEdit className="w-4 h-4" /> <span>Edit</span>
//                                 </Button>
//                             )}

//                             <Button onClick={handleDeleteClick} className="w-1/2 rounded-lg flex items-center justify-center gap-2 !border-2 !border-[#0F766E] !bg-[#B5D5D2] !text-[#0E6B64] hover:!bg-[#a0c4c1]" variant="outline">
//                                 <FiTrash2 className="w-4 h-4" /> <span>Delete</span>
//                             </Button>
//                         </div>
//                     </div>
//                 </Card>
//             </Link>

//             {/* Edit Modal (reuse EventModal for quick demo) */}
//             <EventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialData={item} mode="edit" />

//             {/* Delete Confirmation */}
//             <DeleteConfirmationModal
//                 isOpen={isDeleteModalOpen}
//                 onClose={() => setIsDeleteModalOpen(false)}
//                 onConfirm={handleDeleteConfirm}
//                 title="Delete Service"
//                 message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
//             />
//         </>
//     );
// };

// export default ServiceCard;








import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import EventModal from './EventModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ServiceCard = ({ item = {}, editLink, onEdit, onDelete, className = '' }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) {
            onEdit(item);
            return;
        }
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (onDelete) onDelete(item);
    };

    return (
        <>
            <Link to={`/provider/service/${item.id}`} state={{ item, from: 'service' }} className="block h-full">
                <Card className={`p-4 h-[380px] flex flex-col justify-between rounded-lg overflow-hidden !bg-[#E7F1F180] ${className}`}>
                    <div className="flex flex-col flex-1">
                        {/* Image Section */}
                        <div className="relative">
                            {(item.category || item.tag) && (
                                <div className="absolute top-3 left-3 z-10 rounded-md px-3 py-1 text-xs font-medium text-[#0F766E] bg-[#E7F1F1]">
                                    {item.category || item.tag}
                                </div>
                            )}

                            <div className="h-32 bg-gray-200 rounded-md mb-3 overflow-hidden flex items-center justify-center">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <div className="text-[#000000] bg-[#D9D9D9] w-full h-full flex items-center justify-center">Image</div>
                                )}
                            </div>
                        </div>

                        {/* Title Section with 2-line clamp */}
                        <h3
                            className="text-[#282828] font-bold text-lg mb-1 overflow-hidden"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '3rem' // Maintains space for 2 lines
                            }}
                        >
                            {item.title}
                        </h3>

                        {/* Description Section with 2-line clamp */}
                        <div
                            className="text-sm text-[#363636] mb-1 overflow-hidden"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '1rem' // Maintains space for 2 lines
                            }}
                        >
                            {item.description}
                        </div>
                    </div>

                    {/* Button Section - Always stays at bottom */}
                    <div className="mt-auto" onClick={(e) => e.preventDefault()}>
                        <div className="flex gap-3">
                            {editLink ? (
                                <Link to={editLink} className="w-1/2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <Button className="w-full rounded-lg flex items-center justify-center gap-2" variant="primary">
                                        <FiEdit className="w-4 h-4" /> <span>Edit</span>
                                    </Button>
                                </Link>
                            ) : (
                                <Button onClick={handleEditClick} className="w-1/2 rounded-lg flex items-center justify-center gap-2" variant="primary">
                                    <FiEdit className="w-4 h-4" /> <span>Edit</span>
                                </Button>
                            )}

                            <Button onClick={handleDeleteClick} className="w-1/2 rounded-lg flex items-center justify-center gap-2 !border-2 !border-[#0F766E] !bg-[#B5D5D2] !text-[#0E6B64] hover:!bg-[#a0c4c1]" variant="outline">
                                <FiTrash2 className="w-4 h-4" /> <span>Delete</span>
                            </Button>
                        </div>
                    </div>
                </Card>
            </Link>

            <EventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialData={item} mode="edit" />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Service"
                message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
            />
        </>
    );
};

export default ServiceCard;