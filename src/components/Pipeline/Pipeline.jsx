import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import PipelineStatus from '../PipelineStatus/PipelineStatus';
import PipelineForm from '../PipelineForm/PipelineForm';

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const selectedPipelineWithData = useStore((state) => state.selectedPipeline);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  const fetchPipelineById = useStore((state) => state.fetchPipelineById);
  const foundUsers = useStore((state) => state.foundUsers);
  const searchingApplicant = useStore((state) => state.searchingApplicant);
  const setSelectedUserId = useStore((state) => state.setSelectedUserId);
  const selectedUserId = useStore((state) => state.selectedUserId);
  const addUserStatus = useStore((state) => state.addUserStatus);

  const [pipelineId, setPipelineId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const loadPipeline = () => {
    fetchPipelineById(pipelineId);
  };

  const searchQuery = () => {
    console.log('build the search query', searchString);
    searchingApplicant(searchString);
  };

  const addUserToPipeline = () => {
    //build up the object with userId, and pipeline_status_id (from the pipeline that was selected)
    // {user_id: selectedUser.id, pipeline_status_id: "need further work for this"
    // }

    // MUST PROTECT against empty or not selected data
    if (!selectedPipelineWithData || Object.keys(selectedPipelineWithData).length === 0) {
      alert('please select pipeline');
      return;
    }

    console.log('user', selectedUserId);
    console.log('selectedPipeline status Id: ', selectedPipelineWithData.statuses[0].pipeline_status_id);

    // zustand function post maybe upsert???? the object {pipeline_id: selectedPipelineWithData.pipeline_id ,user_id: selectedUserId, pipeline_status_id: selectedPipelineWithData.statuses[0].pipeline_status_id}
    const newUserStatus = {
      pipeline_id: selectedPipelineWithData.pipeline_id,
      user_id: selectedUserId,
      pipeline_status_id: selectedPipelineWithData.statuses[0].pipeline_status_id,
    };
    addUserStatus(newUserStatus);
  };

  console.log('found users', foundUsers);
  return (
    <>
      <div>
        <h1>Pipeline page!</h1>
      </div>
      <button onClick={() => setShowModal(!showModal)}>Show Modal</button>
      <div>
        <label>Search</label>
        <input onChange={(event) => setSearchString(event.target.value)} value={searchString} />
        <button onClick={searchQuery}>Search</button>
      </div>
      <div>
        <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
          <option>Select User</option>
          {foundUsers?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={addUserToPipeline}>Add User to Pipeline</button>

      <div>
        <label htmlFor='pipelines'>Choose pipeline</label>
        <select value={pipelineId} onChange={(event) => setPipelineId(Number(event.target.value))}>
          <option>Select Pipeline</option>
          {pipelines.map((pipeline) => (
            <option key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </option>
          ))}
        </select>
        <button onClick={loadPipeline}>Load Pipeline</button>
      </div>
      <div>
        {selectedPipelineWithData?.statuses?.length > 0 &&
          selectedPipelineWithData?.statuses?.map((status, index) => (
            <div key={index}>
              {status.status}
              <PipelineStatus status={status} />
            </div>
          ))}
      </div>
      {showModal && <PipelineForm setShowModal={setShowModal} />}
    </>
  );
}
