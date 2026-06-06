import React from 'react';
import Event from '../../shared/event/Event';
import CoachFilter from '../components/CoachFilter';

const CoachEvent = () => {
    return (
        <Event
            filterComponent={CoachFilter}
            detailsRoute="/coach/event"
            useOrganizerApi
        />
    );
};

export default CoachEvent;