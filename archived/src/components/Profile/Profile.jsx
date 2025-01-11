import { useEffect, useReducer } from "react";
import useStore from "../../zustand/store";
import { useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { FaUserCircle } from "react-icons/fa";

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  // Format as (XXX)XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]})${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

export default function Profile() {
  const { userId } = useParams();

  const { userById, fetchUserById, userActions, fetchUserActions } = useStore(
    (state) => ({
      userById: state.userById,
      fetchUserById: state.fetchUserById,
      userActions: state.userActions,
      fetchUserActions: state.fetchUserActions,
    })
  );

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    fetchUserById(userId);
    fetchUserActions(userId);
  }, [userId]);

  useEffect(() => {
    const handleResize = () => {
      // Force a re-render when window size changes
      forceUpdate({});
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (window.innerWidth < 768) {
      // Mobile format: MM/DD/YYYY
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    // Desktop format: Month DD, YYYY
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1 ps-4">
                  <h1 className="mb-3" style={{ color: "#4b0082" }}>
                    {userById?.first_name} {userById?.last_name}
                  </h1>
                  <div className="mb-2" style={{ fontSize: "1.1rem" }}>
                    {userById?.username}
                  </div>
                  <div>{formatPhoneNumber(userById?.phone_number)}</div>
                </div>
                <div className="ms-4">
                  <FaUserCircle
                    size={window.innerWidth < 768 ? 100 : 160}
                    className="text-secondary d-none d-sm-block"
                  />
                  <FaUserCircle
                    size={60}
                    className="text-secondary d-block d-sm-none"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card
            className="shadow-sm mb-4"
            style={{ borderLeft: "4px solid #4b0082" }}
          >
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Pipeline:</strong> {userById?.pipeline_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Pipeline Status:</strong>{" "}
                  {userById?.pipeline_status_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Location:</strong> {userById?.location_name}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">
                Action History
              </Card.Title>
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="table-light">
                    <tr>
                      <th className="text-nowrap">Type</th>
                      <th>Action Details</th>
                      <th className="text-nowrap">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActions?.map((action) => (
                      <tr key={action.id}>
                        <td>
                          <span
                            className="badge"
                            style={{ backgroundColor: "#4b0082" }}
                          >
                            {action.type}
                          </span>
                        </td>
                        <td>
                          {action.type === "submission" ? (
                            <Link
                              to={`/submission/${action.id}/0`}
                              className="text-decoration-none"
                            >
                              {action.name}
                            </Link>
                          ) : (
                            action.name
                          )}
                        </td>
                        <td className="text-nowrap">
                          {formatDate(action.finished_at)}
                        </td>
                      </tr>
                    ))}
                    {(!userActions || userActions.length === 0) && (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">
                          No actions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
