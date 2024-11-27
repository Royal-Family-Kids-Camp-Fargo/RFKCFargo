import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import useStore from '../../zustand/store';

export default function PipelineForm() {
  const addPipeline = useStore((state) => state.addPipeline);
  const user = useStore((state) => state.user);
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineType, setPipelineType] = useState('');
  const [locationId, setLocationId] = useState('');
  const [showModal, setShowModal] = useState(false);

  function addNewPipeline(event) {
    event.preventDefault();
    const newPipeline = {
      name: pipelineName,
      type: pipelineType,
      location_id: Number(locationId),
    };

    addPipeline(newPipeline);
    setPipelineName('');
    setPipelineType('');
    setLocationId('');
    setShowModal(false);
  }

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant='success'
        style={{
          boxShadow: 'none',
          backgroundColor: '#4b0082',
          borderColor: '#4b0082',
          color: 'white',
        }}
      >
        Add New Pipeline
      </Button>

      <Modal show={showModal} onHide={closeModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#4b0082' }}>Add New Pipeline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Control
                type='text'
                placeholder='Enter pipeline name'
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                required
              />
            </Form.Group>

            <div className='d-flex gap-3'>
              <Form.Group className='mb-3 flex-grow-1'>
                <Form.Select value={pipelineType} onChange={(e) => setPipelineType(e.target.value)} required>
                  <option value=''>--Select Type--</option>
                  <option value='volunteer'>Volunteer</option>
                  <option value='donor'>Donor</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className='mb-3 flex-grow-1'>
                <Form.Select value={locationId} onChange={(e) => setLocationId(e.target.value)} required>
                  <option value=''>--Select Location--</option>
                  {user.locations?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addNewPipeline} style={{ backgroundColor: '#4b0082', borderColor: '#4b0082' }}>
            Add Pipeline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
