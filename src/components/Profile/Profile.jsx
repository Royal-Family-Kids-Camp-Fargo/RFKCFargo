import { useEffect } from 'react';
import useStore from '../../zustand/store';
import { useParams, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

export default function Profile() {
  const { userId } = useParams();

  const { userById, fetchUserById, userActions, fetchUserActions } = useStore((state) => ({
    userById: state.userById,
    fetchUserById: state.fetchUserById,
    userActions: state.userActions,
    fetchUserActions: state.fetchUserActions,
  }));

  useEffect(() => {
    fetchUserById(userId);
    fetchUserActions(userId);
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container className='py-4'>
      <Row className='justify-content-center'>
        <Col md={8}>
          <Card className='shadow-sm mb-4'>
            <Card.Body>
              <Card.Title as='h1' className='mb-4'>
                {userById.first_name} {userById.last_name}
              </Card.Title>

              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <strong>Username:</strong> {userById.username}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Phone:</strong> {userById.phone_number}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Pipeline:</strong> {userById.pipeline_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Pipeline Status:</strong> {userById.pipeline_status_name}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Location:</strong> {userById.location_name}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className='shadow-sm'>
            <Card.Body>
              <Card.Title as='h2' className='mb-4'>
                Action History
              </Card.Title>
              <div className='table-responsive'>
                <Table hover bordered>
                  <thead className='table-light'>
                    <tr>
                      <th className='text-nowrap'>Type</th>
                      <th>Name</th>
                      <th className='text-nowrap'>Started</th>
                      <th className='text-nowrap'>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActions?.map((action) => (
                      <tr key={action.id}>
                        <td>
                          <span className='badge bg-secondary text-white'>{action.type}</span>
                        </td>
                        <td>
                          {action.type === 'submission' ? (
                            <Link to={`/submission/${action.id}/0`} className='text-decoration-none'>
                              {action.name}
                            </Link>
                          ) : (
                            action.name
                          )}
                        </td>
                        <td className='text-nowrap'>{formatDate(action.started_at)}</td>
                        <td className='text-nowrap'>{formatDate(action.finished_at)}</td>
                      </tr>
                    ))}
                    {(!userActions || userActions.length === 0) && (
                      <tr>
                        <td colSpan='4' className='text-center text-muted py-4'>
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
