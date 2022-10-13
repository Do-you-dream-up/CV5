import React, { useCallback, useMemo, useState } from 'react';
import { isDefined } from '../../tools/helpers';
import PropTypes from 'prop-types';
import Field from '../Field';

export default function Select({ fieldInstance }) {
  const [idCurrentOption, setIdCurrentOption] = useState();

  const renderFieldInstanceAsViewComponent = useCallback((field) => {
    const Component = field?.getComponentView();
    return Component ? <Component key={field.getId()} fieldInstance={field} /> : null;
  }, []);

  const currentOptionFieldInstance = useMemo(() => {
    if (!isDefined(idCurrentOption)) return null;
    return fieldInstance.find(idCurrentOption);
  }, [idCurrentOption]);

  const slaveComponent = useMemo(() => {
    return currentOptionFieldInstance?.getSlaves().map(renderFieldInstanceAsViewComponent);
  }, [renderFieldInstanceAsViewComponent, currentOptionFieldInstance]);

  const handleOptionChange = useCallback((event) => {
    event.stopPropagation();
    setIdCurrentOption(event.target.value);
  }, []);

  const options = useMemo(() => {
    return fieldInstance.getChildren().map((field, index) => {
      if (index === 0) setIdCurrentOption(field.getId());
      return renderFieldInstanceAsViewComponent(field);
    });
  }, [renderFieldInstanceAsViewComponent, fieldInstance]);

  const datasetAttributesProps = useMemo(() => {
    return {
      ...fieldInstance.getDataAttributes(),
      'data-value': fieldInstance?.find(idCurrentOption)?.getId(),
    };
  }, [idCurrentOption]);

  return (
    <fieldset {...datasetAttributesProps}>
      <legend>{fieldInstance.getLabel()}</legend>
      <select onChange={handleOptionChange}>{options}</select>
      {slaveComponent}
    </fieldset>
  );
}

Select.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
};
