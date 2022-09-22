import React, { useRef, useMemo, useEffect } from 'react';

import { useSurvey } from './SurveyProvider';
import { isDefined } from '../tools/helpers';

export default function SurveyForm() {
  const formRef = useRef();
  const { fields, setForm, formName, formTitle, formDescription } = useSurvey();

  useEffect(() => {
    if (isDefined(formRef.current)) setForm(formRef.current);
  }, [setForm]);

  const inputs = useMemo(() => {
    return fields?.map((field) => {
      const FieldComponent = field.getComponentView();
      return !isDefined(FieldComponent) ? null : <FieldComponent key={field.getId()} fieldInstance={field} />;
    });
  }, [fields]);

  const headerProps = useMemo(
    () => ({
      name: formName,
      title: formTitle,
      description: formDescription,
    }),
    [formName, formTitle, formDescription],
  );

  return (
    <>
      <FormHeader {...headerProps} />
      <form ref={formRef}>
        {inputs}
        <div>
          <button>Soumettre</button>
        </div>
      </form>
    </>
  );
}

const _FormHeader = ({ name, title, description }) => (
  <>
    <h1>{name}</h1>
    <h2>{title}</h2>
    <p>{description}</p>
  </>
);

const FormHeader = React.memo(_FormHeader);
