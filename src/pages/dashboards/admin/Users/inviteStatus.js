export const getInviteStatus = (row) => {
    if (!row?.invitedAt) return null;
    return row?.termsAcceptedAt ? 'joined' : 'pending';
};
