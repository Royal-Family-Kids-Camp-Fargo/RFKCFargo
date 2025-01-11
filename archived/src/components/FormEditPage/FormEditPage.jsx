import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useStore from "../../zustand/store";
import SectionManager from "../SectionManager/SectionManager";
import { Container, Row, Col } from "react-bootstrap";

function FormEditor() {
  const { formId } = useParams();
  const fetchFormById = useStore((store) => store.fetchFormById);
  const currentForm = useStore((store) => store.currentForm);

  useEffect(() => {
    fetchFormById(formId);
  }, [formId]);

  if (!currentForm) {
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
        <Col md={10}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h1
              className="text-center mb-2 fw-bold"
              style={{ color: "#cc0000" }}
            >
              Edit Form
            </h1>
            <h2 className="text-center mb-4 h4" style={{ color: "#4b0082" }}>
              {currentForm.name}
            </h2>
            <hr
              className="mb-4"
              style={{ borderColor: "#4b0082", opacity: 0.25 }}
            />
            <SectionManager formId={formId} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default FormEditor;
