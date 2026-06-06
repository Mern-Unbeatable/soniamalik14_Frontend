import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import DeleteConfirmationModal from '../../../../components/ui/DeleteConfirmationModal';

const RecruitmentCard = ({ item = {}, editLink, onEdit, onDelete, className = '' }) => {

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) onEdit(item);

    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (onDelete) {
            await onDelete(item);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <Link to={`/coach/recruitment/${item.id}`} state={{ item, from: 'recruitment' }} className="block">
                <Card className={`p-4 h-full flex flex-col justify-between rounded-lg  bg-[#E7F1F180]! ${className}`}>
                    <div>
                        <div className="relative">
                            {item.tag && (
                                <div className="absolute top-3 left-3 z-10 rounded-md px-3 py-1 text-base font-medium text-[#0F766E] bg-[#E7F1F1]">{item.tag}</div>
                            )}

                            <div className="h-36 bg-gray-200 rounded-md mb-4 overflow-hidden flex items-center justify-center">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full  rounded-md" />
                                ) : (
                                    <div className="text-[#000000] bg-[#D9D9D9] rounded-md p-4">Image</div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-[#282828] font-semibold text-lg mb-2">{item.title}</h3>
                        <div className="text-base text-[#363636] mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#363636]" />
                            <span className="text-base">{item.location || "Dhaka"} </span>
                        </div>
                        <div className="text-base text-[#363636] mb-2 flex items-start gap-2 flex-col">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#363636]" /> <span className="text-base">{item.days || item.availableDays || "N/A"}</span></div>
                        </div>
                        <div className="text-base text-[#363636] mb-3 flex items-start gap-2 flex-col">
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#363636]" /> <span className="text-base">{item.time || item.timeSlots || "N/A"}</span></div>
                        </div>


                    </div>

                    <div className="mt-2" onClick={(e) => e.preventDefault()}>
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

                            <Button onClick={handleDeleteClick} className="w-1/2 rounded-lg flex items-center justify-center gap-2 border-2! border-[#0F766E]! bg-[#B5D5D2]! text-[#0E6B64]! hover:bg-[#a0c4c1]!" variant="outline">
                                <FiTrash2 className="w-4 h-4" /> <span>Delete</span>
                            </Button>
                        </div>
                    </div>
                </Card>
            </Link>



            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Recruitment"
                message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
            />
        </>
    );
};

export default RecruitmentCard;
