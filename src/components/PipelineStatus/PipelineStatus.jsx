import { Card } from 'react-bootstrap';
import UserStatus from '../UserStatus/UserStatus';

export default function PipelineStatus({ status }) {
  return (
    <Card>
      <Card.Header>{status.status}</Card.Header>
      <Card.Body>
        {status?.applicants?.map((person) => (
          <UserStatus key={person.id} person={person} />
        ))}
      </Card.Body>
    </Card>
  );
}
