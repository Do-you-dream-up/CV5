import PropTypes from 'prop-types';
import React from 'react';
import Styled from 'rsg-components/Styled';


export const styles = ({ color, fontFamily, fontSize }) => ({
  pathline: {
    color: color.light,
    fontFamily: fontFamily.monospace,
    fontSize: fontSize.small,
    wordBreak: 'break-all',
  },
});


export function PathlineRenderer({ classes, children }) {
  return <div children={children} className={classes.pathline} />;
}


PathlineRenderer.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.string,
};


export default Styled(styles)(PathlineRenderer);