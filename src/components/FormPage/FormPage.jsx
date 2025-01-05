import useStore from '../../zustand/store';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Section from './Section';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function FormPage() {
  const createOrGetSubmissionByFormId = useStore((store) => store.createOrGetSubmissionByFormId);
  const currentSubmission = useStore((store) => store.currentSubmission);
  const fetchFormById = useStore((store) => store.fetchFormById);
  const currentForm = useStore((store) => store.currentForm);
  const user = useStore((store) => store.user);

  const { formId, sectionIndex } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFormById(formId);
    createOrGetSubmissionByFormId(formId);
  }, [user, formId]);

  useEffect(() => {
    if (sectionIndex === undefined || isNaN(sectionIndex)) {
      navigate(`/form/${formId}/0`);
    }
  }, [sectionIndex]);

  if (!currentForm || !currentSubmission) {
    return (
      <Container className='text-center py-5'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col md={8}>
          <div
            className='bg-white p-4 rounded shadow-sm'
            style={{ backgroundColor: 'rgba(255, 192, 203, 0.1) !important' }}
          >
            <h1 className='text-center mb-4 fw-bold' style={{ color: '#cc0000' }}>
              Moorhead New Volunteer Form
            </h1>
            <hr className='mb-4' style={{ borderColor: '#4b0082', opacity: 0.25 }} />
            <Section currentForm={currentForm} currentSubmission={currentSubmission} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
