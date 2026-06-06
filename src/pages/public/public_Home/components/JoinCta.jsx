import React from 'react';
import CallToAction from '../../../../components/ui/CallToAction';

const JoinCta = () => {
    const handleJoinClick = () => {
        console.log('Join ESSA Hub clicked');
    };

    return (
        <CallToAction
            title="Your Journey in Women's Sport Starts Here"
            description="ESSA Hub helps you find training, teams, events, and a supportive community â€” so you can take your first confident step and grow alongside women who share your passion for sport."
            buttonText="Join ESSA Hub"
            onButtonClick={handleJoinClick}
            backgroundImage="/ctaBg.png"
            showArrow={true}
        />
    );
};

export default JoinCta;