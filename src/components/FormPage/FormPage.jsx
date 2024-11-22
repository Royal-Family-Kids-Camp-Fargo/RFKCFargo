import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Section from "./Section";
import { useNavigate } from "react-router-dom";

export default function FormPage({}) {

  const createOrGetSubmissionByFormId = useStore(store => store.createOrGetSubmissionByFormId)
  const currentSubmission = useStore(store => store.currentSubmission);
  const fetchFormById = useStore(store => store.fetchFormById);
  const currentForm = useStore(store => store.currentForm);
  const user = useStore(store => store.user);

  const { formId, sectionIndex } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // fetch submission by form id
    fetchFormById(formId);
    createOrGetSubmissionByFormId(formId);
  }, [user, formId])

  useEffect(() => {
    if (sectionIndex === undefined || isNaN((sectionIndex))) {
      navigate(`/form/${formId}/0`)
    }
  }, [sectionIndex])
  return (
    // Needs to 
    <div>
      <h1>{currentForm && currentForm.name}</h1>
        {currentForm && currentSubmission 
          && <Section 
            currentForm={currentForm}
            currentSubmission={currentSubmission}
            />}
    </div>
  );
}
