import React from 'react';

const Title = ({ children, className }) => {
    return (
         <h2 className={`${className} sectiontitle`}>
            {children}
        </h2>
    );
};

export default Title;