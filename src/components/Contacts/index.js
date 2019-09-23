import React from 'react';
import useStyles from './styles';


/**
 * Current dummy placeholder for a secondary tab.
 */
export default function Contacts() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <p>Contacts.</p>
    </div>
  );
}
