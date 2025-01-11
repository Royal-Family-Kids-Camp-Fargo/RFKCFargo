import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../zustand/store";
import { Container, Row, Col, Stack, Button, Form } from "react-bootstrap";

export default function FormAdmin() {
  const [newForm, setNewForm] = useState({
    name: "",
    pipeline_id: "",
    location_id: "",
  });

  const navigate = useNavigate();
  const allForms = useStore((store) => store.allForms);
  const pipelines = useStore((store) => store.pipelines);
  const fetchForms = useStore((store) => store.fetchForms);
  const fetchPipeline = useStore((store) => store.fetchPipeline);
  const addForm = useStore((store) => store.addForm);
  const deleteForm = useStore((store) => store.deleteForm);
  const userLocations = useStore((store) => store.user.locations);

  useEffect(() => {
    fetchForms();
    fetchPipeline();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addForm({
        name: newForm.name,
        pipeline_id:
          newForm.pipeline_id === "" ? null : Number(newForm.pipeline_id),
        location_id:
          newForm.location_id === "" ? null : Number(newForm.location_id),
      });
      setNewForm({ name: "", pipeline_id: "", location_id: "" });
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await deleteForm(formId);
      } catch (error) {
        console.error("Error deleting form:", error);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h1
              className="text-center mb-4 fw-bold"
              style={{ color: "#cc0000" }}
            >
              Manage Forms
            </h1>
            <hr
              className="mb-4"
              style={{ borderColor: "#4b0082", opacity: 0.25 }}
            />

            <Stack gap={4}>
              {/* Create New Form Card */}
              <div className="bg-white p-4 rounded shadow-sm">
                <h2
                  className="h4 mb-4 fw-bold"
                  style={{
                    color: "#4b0082",
                    borderLeft: "4px solid #4b0082",
                    paddingLeft: "12px",
                  }}
                >
                  Create A New Form
                </h2>
                <div className="form-creation">
                  <Form onSubmit={handleSubmit}>
                    <Stack gap={3}>
                      <Form.Group>
                        <Form.Label
                          className="fw-bold"
                          style={{ color: "#4b0082" }}
                        >
                          Form Name:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="name"
                          value={newForm.name}
                          onChange={(e) =>
                            setNewForm({ ...newForm, name: e.target.value })
                          }
                          required
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label
                          className="fw-bold"
                          style={{ color: "#4b0082" }}
                        >
                          Pipeline:
                        </Form.Label>
                        <Form.Select
                          id="pipeline"
                          value={newForm.default_pipeline_id}
                          onChange={(e) =>
                            setNewForm({
                              ...newForm,
                              default_pipeline_id: e.target.value,
                            })
                          }
                        >
                          <option value="">None</option>
                          {pipelines.map((pipeline) => (
                            <option key={pipeline.id} value={pipeline.id}>
                              {pipeline.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group>
                        <Form.Label
                          className="fw-bold"
                          style={{ color: "#4b0082" }}
                        >
                          Location:
                        </Form.Label>
                        <Form.Select
                          id="location"
                          value={newForm.location_id}
                          onChange={(e) =>
                            setNewForm({
                              ...newForm,
                              location_id: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select a location</option>
                          {userLocations
                            .filter((location) => location.internal)
                            .map((location) => (
                              <option key={location.id} value={location.id}>
                                {location.name}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="px-4"
                        style={{
                          backgroundColor: "#4b0082",
                          borderColor: "#4b0082",
                        }}
                      >
                        Create Form
                      </Button>
                    </Stack>
                  </Form>
                </div>
              </div>

              {/* Existing Forms Card */}
              <div className="bg-white p-4 rounded shadow-sm">
                <h2
                  className="h4 mb-4 fw-bold"
                  style={{
                    color: "#4b0082",
                    borderLeft: "4px solid #4b0082",
                    paddingLeft: "12px",
                  }}
                >
                  Edit Existing Forms
                </h2>
                <div className="forms-grid">
                  {allForms
                    .filter((form) =>
                      userLocations.some(
                        (location) =>
                          location.id === form.location_id && location.internal
                      )
                    )
                    .map((form) => (
                      <div key={form.id} className="form-card">
                        <div className="d-flex gap-3 mb-4">
                          <Button
                            variant="primary"
                            onClick={() => navigate(`/formEdit/${form.id}`)}
                            className="px-4"
                            style={{
                              backgroundColor: "#4b0082",
                              borderColor: "#4b0082",
                            }}
                          >
                            Edit Form
                          </Button>
                          <Button
                            variant="outline-secondary"
                            onClick={() => handleDelete(form.id)}
                            className="px-4"
                            style={{ borderColor: "#4b0082", color: "#4b0082" }}
                          >
                            Delete
                          </Button>
                        </div>
                        <h3>{form.name}</h3>
                        {form.pipeline_id && (
                          <p>Pipeline ID: {form.pipeline_id}</p>
                        )}
                        {form.location_id && (
                          <p>Location ID: {form.location_id}</p>
                        )}
                        <hr style={{ borderColor: "#4b0082", opacity: 0.25 }} />
                      </div>
                    ))}
                </div>
              </div>
            </Stack>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
