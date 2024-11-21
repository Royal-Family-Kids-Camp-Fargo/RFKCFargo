import { useState } from 'react';
import useStore from '../../zustand/store';

export default function SectionManager({ formId }) {
  const [newSection, setNewSection] = useState({
    name: '',
    description: '',
    order: 0
  });
  
  const currentForm = useStore(store => store.currentForm);
  const createSection = useStore(store => store.createSection);
  const deleteSection = useStore(store => store.deleteSection);
  const fetchFormById = useStore(store => store.fetchFormById);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSection({
        ...newSection,
        form_id: formId
      });
      // Refresh the form data
      fetchFormById(formId);
      // Reset form
      setNewSection({
        name: '',
        description: '',
        order: 0
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
    <div className="section-manager">
      <h2>Manage Sections</h2>
      
      {/* Add New Section Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Section Name:</label>
          <input
            type="text"
            id="name"
            value={newSection.name}
            onChange={(e) => setNewSection({...newSection, name: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={newSection.description}
            onChange={(e) => setNewSection({...newSection, description: e.target.value})}
          />
        </div>
        
        <div>
          <label htmlFor="order">Order:</label>
          <input
            type="number"
            id="order"
            value={newSection.order}
            onChange={(e) => setNewSection({...newSection, order: parseInt(e.target.value)})}
            required
          />
        </div>
        
        <button type="submit">Add Section</button>
      </form>

      {/* List Existing Sections */}
      <div className="sections-list">
        <h3>Current Sections</h3>
        {currentForm?.sections?.sort((a,b) => a.order - b.order).map((section) => (
          <div key={section.id} className="section-item">
            <h4>{section.name}</h4>
            <p>{section.description}</p>
            <p>Order: {section.order}</p>
            <button onClick={() => handleDelete(section.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
} 