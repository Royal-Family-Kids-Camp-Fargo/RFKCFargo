import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';
import SubmissionSection from './SubmissionSection';

export default function SubmissionView() {
  const { submissionId, sectionIndex } = useParams();
  const navigate = useNavigate();

  const fetchFormById = useStore((store) => store.fetchFormById);
  const fetchSubmissionById = useStore((store) => store.fetchSubmissionById);
  const currentForm = useStore((store) => store.currentForm);
  const currentSubmission = useStore((store) => store.currentSubmission);

  useEffect(() => {
    if (submissionId) {
      fetchSubmissionById(submissionId);
    }
  }, [submissionId]);

  useEffect(() => {
    if (currentSubmission?.form_id) {
      fetchFormById(currentSubmission.form_id);
    }
  }, [currentSubmission]);

  useEffect(() => {
    if (sectionIndex === undefined || isNaN(sectionIndex)) {
      navigate(`/submission/${submissionId}/0`, { replace: true });
    }
  }, [sectionIndex]);

  if (!currentForm || !currentSubmission) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Submission Review - {currentForm.name}</h1>
      <SubmissionSection currentForm={currentForm} currentSubmission={currentSubmission} />
    </div>
  );
}
