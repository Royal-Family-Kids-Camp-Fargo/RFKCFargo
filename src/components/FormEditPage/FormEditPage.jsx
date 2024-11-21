import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../../zustand/store';
import SectionManager from '../SectionManager/SectionManager';

function FormEditor() {
  const { formId } = useParams();
  const fetchFormById = useStore(store => store.fetchFormById);

  useEffect(() => {
    fetchFormById(formId);
  }, [formId]);

  return (
    <div>
      <h1>Edit Form</h1>
      <SectionManager formId={formId} />
    </div>
  );
}

export default FormEditor