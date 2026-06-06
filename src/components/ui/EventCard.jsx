import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const EventCard = ({
    item = {},
    editLink,
    onEdit,
    onDelete,
    className = '',
    detailsRoute = '/coach/event',
    filter = {},
    currentPage = 1,
}) => {
    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) {
            onEdit(item);
        }
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) onDelete(item);
    };

    return (
        <>
            <Link to={`${detailsRoute}/${item.id}`} state={{ item, from: 'event', filter, currentPage }} className="block">
                <Card
                    className={`p-4 h-full flex flex-col  justify-between rounded-lg border bg-white ${className}`}
                    style={{ borderColor: '#B5D5D2' }}
                >
                    <div>
                        <div className="relative">
                            {(item.status || item.type) && (() => {
                                const raw = (item.status || item.type || '').toString();
                                const key = raw.toLowerCase();
                                const isPending = key === 'pending';
                                const badgeClasses = `absolute top-3 left-3 z-10 rounded-md px-3 py-1 text-base font-medium capitalize ${isPending ? 'bg-[#FFDAB9] text-[#FF7700] border border-[#FFDAB9]' : 'bg-[#E9F7F5] text-[#0F766E] border border-[#B5D5D2]'}`;
                                return <div className={badgeClasses}>{raw}</div>;
                            })()}

                            <div className="h-44 bg-gray-200 rounded-md mb-4 overflow-hidden flex items-center justify-center">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <div className="text-[#000000] bg-[#D9D9D9] rounded-md p-4">Image</div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-[#282828] font-semibold text-lg mb-2 min-h-12">{item.title}</h3>

                        <div className="text-base text-[#363636] mb-3 flex items-start gap-2 flex-col">
                            {(() => {
                                const dateText = item.day || item.date || item.startDate || '';
                                // Format date if it's in ISO format
                                const formattedDate = dateText.includes('-')
                                    ? new Date(dateText).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : dateText;
                                return (
                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#363636]" /> <span className="text-base">{formattedDate}</span></div>
                                );
                            })()}
                        </div>

                        <div className="text-base text-[#363636] mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#363636]" />
                            <span className="text-base">{item.location || item.fullAddress || item.venueName || ''}</span>
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


            {/* Delete confirmation is handled by parent to avoid duplicate modals */}
        </>
    );
};

export default EventCard;
