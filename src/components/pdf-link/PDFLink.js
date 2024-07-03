import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const PDFLink = ({ url }) => {
    return (
        <a className='download-cv' href={url} target="_blank" rel="noopener noreferrer">Dowload CV <FontAwesomeIcon icon={faCloudArrowDown} /></a>
    );
};

export default PDFLink;
