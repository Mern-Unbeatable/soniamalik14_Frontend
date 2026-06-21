import React from 'react';

const Container = ({ children, className }) => {
    return (
        <div className={`${className} xl:container w-11/12 mx-auto  md:px-4 relative`}>
            {children}
        </div>
    );
};

export default Container;