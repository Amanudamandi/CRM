import React from 'react';
import propTypes from 'prop-types';
import './index.css';

const Index = ( { width, height, boxShadowColor, boxColor, boxRoundness, children, display, justifyContent, alignItems, key='' }) => {

    const Styles = {
        containerStyle: { 
            display: display || 'block',
            justifyContent: justifyContent || 'flex-start',
            alignItems: alignItems || 'flex-start',
            width: width || 'auto', 
            height: height || 'auto', 
            boxShadow: `0px 0px 10px ${boxShadowColor}`, 
            backgroundColor: boxColor, 
            borderRadius: boxRoundness, 
            border: '2px solid #AA0B2B' 
        }
    }

    return(
        <div key={key} style={Styles.containerStyle}>
            {children}
        </div>
    );
}

Index.propTypes = {
    width: propTypes.string, 
    height: propTypes.string, 
    boxShadowColor: propTypes.string,
    boxColor: propTypes.string,
    boxRoundness: propTypes.number,
    children: propTypes.node
} 

export default Index;