import React, { useMemo } from 'react';
import Interface from './Interface';

export default function Survey({ configuration }) {
  const title = useMemo(() => configuration?.title, [configuration?.title]);

  return (
    <>
      <h1>survey</h1>
      <h2>{title}</h2>
    </>
  );
}

Survey.propTypes = {
  configuration: Interface.configuration,
};
