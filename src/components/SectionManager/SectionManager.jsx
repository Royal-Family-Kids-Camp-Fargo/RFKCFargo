import { useState } from 'react';
import useStore from '../../zustand/store';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

export default function SectionManager({ formId }) {
  const [newSection, setNewSection] = useState({
    name: '',
    description: '',
    order: 0,
  });

  const currentForm = useStore((store) => store.currentForm);
  const createSection = useStore((store) => store.createSection);
  const deleteSection = useStore((store) => store.deleteSection);
  const fetchFormById = useStore((store) => store.fetchFormById);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSection({
        ...newSection,
        form_id: formId,
      });
      // Refresh the form data
      fetchFormById(formId);
      // Reset form
      setNewSection({
        name: '',
        description: '',
        order: 0,
      });
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleDelete = async (sectionId) => {
    try {
      await deleteSection(sectionId);
      fetchFormById(formId);
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  return (
    <div className='section-manager'>
      <h2
        className='h4 mb-4 fw-bold'
        style={{
          color: '#4b0082',
          borderLeft: '4px solid #4b0082',
          paddingLeft: '12px',
        }}
      >
        Manage Sections
      </h2>

      {/* Add New Section Form */}
      <form onSubmit={handleSubmit}>
        <div className='d-flex gap-3'>
          <div style={{ width: '300px' }}>
            <Form.Group>
              <Form.Label className='fw-bold mb-2'>Section Name:</Form.Label>
              <div className='p-1 bg-light rounded'>
                <Form.Control
                  type='text'
                  id='name'
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  required
                  style={{ border: 'none', backgroundColor: 'transparent', padding: '2px 0' }}
                />
              </div>
            </Form.Group>
          </div>

          <div style={{ width: '100px' }}>
            <Form.Group>
              <Form.Label className='fw-bold mb-2'>Order:</Form.Label>
              <div className='p-1 bg-light rounded'>
                <Form.Control
                  type='number'
                  id='order'
                  value={Number(newSection.order)}
                  onChange={(e) => setNewSection({ ...newSection, order: parseInt(e.target.value) })}
                  required
                  style={{ border: 'none', backgroundColor: 'transparent', padding: '2px 0' }}
                />
              </div>
            </Form.Group>
          </div>
        </div>

        <div>
          <Form.Group>
            <Form.Label className='fw-bold mb-2'>Description:</Form.Label>
            <div className='p-2 bg-light rounded'>
              <Form.Control
                as='textarea'
                id='description'
                value={newSection.description}
                onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                style={{ border: 'none', backgroundColor: 'transparent', padding: '0' }}
              />
            </div>
          </Form.Group>
        </div>

        <Button
          variant='primary'
          type='submit'
          className='px-4'
          style={{ backgroundColor: '#4b0082', borderColor: '#4b0082' }}
        >
          Add Section
        </Button>
      </form>

      {/* List Existing Sections */}
      <div className='sections-list mt-5'>
        <h2
          className='h4 mb-4 fw-bold'
          style={{
            color: '#4b0082',
            borderLeft: '4px solid #4b0082',
            paddingLeft: '12px',
          }}
        >
          Current Sections
        </h2>
        {currentForm?.sections
          ?.sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className='section-item'>
              <h4>{section.name}</h4>
              <p>{section.description}</p>
              <p>Order: {section.order}</p>
              <div className='d-flex gap-2 align-items-center'>
                <Button
                  variant='primary'
                  onClick={() => handleDelete(section.id)}
                  size='sm'
                  className='px-3'
                  style={{ backgroundColor: '#cc0000', borderColor: '#cc0000', color: 'white' }}
                >
                  Delete
                </Button>
                <Button
                  variant='outline-secondary'
                  as={Link}
                  to={`/admin/forms/${formId}/section/${section.id}`}
                  size='sm'
                  className='px-3'
                  style={{ borderColor: '#4b0082', color: '#4b0082' }}
                >
                  Manage Questions
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
