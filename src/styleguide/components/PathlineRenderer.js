import Styled from 'rsg-components/Styled';
import PropTypes from 'prop-types';
import React from 'react';


export const styles = ({ color, fontFamily, fontSize }) => ({
  pathline: {
    color: color.light,
    fontFamily: fontFamily.monospace,
    fontSize: fontSize.small,
    wordBreak: 'break-all',
  },
});


export function PathlineRenderer({ children, classes }) {
  return <div children={children} className={classes.pathline} />;
}


PathlineRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.string,
};


export default Styled(styles)(PathlineRenderer);
