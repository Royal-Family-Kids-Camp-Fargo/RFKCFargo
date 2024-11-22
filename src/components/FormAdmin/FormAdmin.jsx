import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';

export default function FormAdmin() {
  const [newForm, setNewForm] = useState({
    name: '',
    default_pipeline_id: ''
  });
  
  const navigate = useNavigate();
  const allForms = useStore(store => store.allForms);
  const pipelines = useStore(store => store.pipelines);
  const fetchForms = useStore(store => store.fetchForms);
  const fetchPipeline = useStore(store => store.fetchPipeline);
  const addForm = useStore(store => store.addForm);
  const deleteForm = useStore(store => store.deleteForm);
  
  useEffect(() => {
    fetchForms();
    fetchPipeline();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addForm({
        name: newForm.name,
        default_pipeline_id: newForm.default_pipeline_id === '' ? null : Number(newForm.default_pipeline_id)
      });
      setNewForm({ name: '', default_pipeline_id: '' });
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const handleDelete = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteForm(formId);
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  return (
    <div className="form-admin">
      <h1>Form Administration</h1>
      <div className="form-creation">
        <h2>Create New Form</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Form Name:</label>
            <input
              type="text"
              id="name"
              value={newForm.name}
              onChange={(e) => setNewForm({...newForm, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor="pipeline">Pipeline:</label>
            <select
              id="pipeline"
              value={newForm.default_pipeline_id}
              onChange={(e) => setNewForm({...newForm, default_pipeline_id: e.target.value})}
            >
              <option value="">None</option>
              {pipelines.map(pipeline => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Create Form</button>
        </form>
      </div>

      {/* List Forms */}
      <div className="forms-list">
        <h2>Existing Forms</h2>
        <div className="forms-grid">
          {allForms.map(form => (
            <div key={form.id} className="form-card">
              <h3>{form.name}</h3>
              {form.default_pipeline_id && <p>Pipeline ID: {form.default_pipeline_id}</p>}
              <div className="form-actions">
                <button 
                  onClick={() => navigate(`/formEdit/${form.id}`)}
                  className="edit-button"
                >
                  Edit Form
                </button>
                <button 
                  onClick={() => handleDelete(form.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 