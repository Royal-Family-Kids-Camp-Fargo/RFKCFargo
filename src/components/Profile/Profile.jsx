import { useEffect } from 'react';
import useStore from '../../zustand/store';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { userId } = useParams();
  
  const { 
    userById, 
    fetchUserById,
    userActions,
    fetchUserActions 
  } = useStore(state => ({
    userById: state.userById,
    fetchUserById: state.fetchUserById,
    userActions: state.userActions,
    fetchUserActions: state.fetchUserActions
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
      minute: '2-digit'
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-info">
        <h1>
          {userById.first_name} {userById.last_name}
        </h1>
        <h2>{userById.username}</h2>
        <h3>{userById.phone_number}</h3>
        <p>
          <strong>Pipeline:</strong> {userById.pipeline_name}
        </p>
        <p>
          <strong>Pipeline Status:</strong> {userById.pipeline_status_name}
        </p>
        <p>
          <strong>Location:</strong> {userById.location_name}
        </p>
      </div>

      <div className="actions-section">
        <h2>Action History</h2>
        <div className="table-container">
          <table className="actions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Started</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {userActions && userActions.map(action => (
                <tr key={`${action.type}-${action.id}`}>
                  <td>
                    <span className={`action-badge ${action.type}`}>
                      {action.type}
                    </span>
                  </td>
                  <td>{action.type === 'submission' ? <Link to={`/submission/${action.id}`}>{action.name}</Link> : action.name}</td>
                  <td>{formatDate(action.started_at)}</td>
                  <td>{formatDate(action.finished_at)}</td>
                </tr>
              ))}
              { userActions && userActions.length === 0 && (
                <tr>
                  <td colSpan="4" className="no-actions">
                    No actions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
