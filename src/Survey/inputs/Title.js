import React from 'react';
import PropTypes from 'prop-types';

export default function Title({ label }) {
  return <h1>{label}</h1>;
}

Title.propTypes = {
  label: PropTypes.string,
};
