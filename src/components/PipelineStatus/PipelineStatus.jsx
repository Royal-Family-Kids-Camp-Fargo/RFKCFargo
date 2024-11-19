import UserStatus from '../UserStatus/UserStatus';

export default function PipelineStatus({ status }) {
  return (
    <div>
      {status?.applicants?.map((person) => (
        <UserStatus key={person.id} person={person} />
      ))}
    </div>
  );
}
