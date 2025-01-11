import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../../zustand/store";
import SubmissionSection from "./SubmissionSection";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <div
            className="bg-white p-4 rounded shadow-sm"
            style={{ backgroundColor: "rgba(255, 192, 203, 0.1) !important" }}
          >
            <h1
              className="text-center mb-2 fw-bold"
              style={{ color: "#cc0000" }}
            >
              Submission Review
            </h1>
            <h2 className="text-center mb-4 h4" style={{ color: "#4b0082" }}>
              {currentForm.name}
            </h2>
            <hr
              className="mb-4"
              style={{ borderColor: "#4b0082", opacity: 0.25 }}
            />
            <SubmissionSection
              currentForm={currentForm}
              currentSubmission={currentSubmission}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
