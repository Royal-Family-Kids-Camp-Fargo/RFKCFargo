import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../../zustand/store';

export default function QuestionManager() {
  const { formId, sectionId } = useParams();
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editForm, setEditForm] = useState({
    question: '',
    description: '',
    answer_type: '',
    required: false,
    order: 0,
    multiple_choice_answers: [],
    newOption: ''
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    description: '',
    answer_type: 'text',
    required: false,
    order: 0,
    multiple_choice_options: [],
    newOption: ''
  });

  const currentForm = useStore(store => store.currentForm);
  const fetchFormById = useStore(store => store.fetchFormById);
  const updateQuestion = useStore(store => store.updateQuestion);
  const archiveQuestion = useStore(store => store.archiveQuestion);
  const createQuestion = useStore(store => store.createQuestion);

  useEffect(() => {
    fetchFormById(formId);
  }, [formId]);

  const currentSection = currentForm?.sections?.find(s => s.id === Number(sectionId));
  const questions = currentSection?.questions || [];

  const handleEdit = (question) => {
    setEditingQuestionId(question.id);
    setEditForm({
      question: question.question,
      description: question.description,
      answer_type: question.answer_type,
      required: question.required,
      order: question.order,
      multiple_choice_answers: question.multiple_choice_answers?.filter(a => a !== null) || [],
      newOption: ''
    });
  };

  const handleSave = async () => {
    try {
      await updateQuestion(editingQuestionId, {
        ...editForm,
        multiple_choice_options: editForm.multiple_choice_answers.map(a => a.answer)
      });
      await fetchFormById(formId);
      setEditingQuestionId(null);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleAddEditOption = (e) => {
    e.preventDefault();
    if (editForm.newOption.trim()) {
      setEditForm({
        ...editForm,
        multiple_choice_answers: [
          ...editForm.multiple_choice_answers,
          { id: `temp-${Date.now()}`, answer: editForm.newOption.trim() }
        ],
        newOption: ''
      });
    }
  };

  const handleRemoveEditOption = (optionId) => {
    setEditForm({
      ...editForm,
      multiple_choice_answers: editForm.multiple_choice_answers.filter(
        option => option.id !== optionId
      )
    });
  };

  const handleEditOption = (optionId, newValue) => {
    setEditForm({
      ...editForm,
      multiple_choice_answers: editForm.multiple_choice_answers.map(option =>
        option.id === optionId ? { ...option, answer: newValue } : option
      )
    });
  };

  const handleOrderChange = (newOrder) => {
    if (newOrder > 0 && newOrder <= questions.length) {
      setEditForm({
        ...editForm,
        order: newOrder
      });
    }
  };

  const handleArchive = async (questionId) => {
    try {
      await archiveQuestion(questionId);
      await fetchFormById(formId);
    } catch (error) {
      console.error('Error archiving question:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createQuestion({
        ...newQuestion,
        section_id: Number(sectionId),
        order: (questions.length || 0) + 1
      });
      await fetchFormById(formId);
      setNewQuestion({
        question: '',
        description: '',
        answer_type: 'text',
        required: false,
        order: 0,
        multiple_choice_options: [],
        newOption: ''
      });
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleAddNewOption = (e) => {
    e.preventDefault();
    if (newQuestion.newOption.trim()) {
      setNewQuestion({
        ...newQuestion,
        multiple_choice_options: [...newQuestion.multiple_choice_options, newQuestion.newOption.trim()],
        newOption: ''
      });
    }
  };

  const handleRemoveNewOption = (indexToRemove) => {
    setNewQuestion({
      ...newQuestion,
      multiple_choice_options: newQuestion.multiple_choice_options.filter((_, index) => index !== indexToRemove)
    });
  };

  return (
    <div className="question-manager">
      <h2>Questions for Section: {currentSection?.name}</h2>
      <div className="questions-list">
        {questions.sort((a,b) => a.order - b.order).map(question => (
          <div key={question.id} className="question-item">
            {editingQuestionId === question.id ? (
              <div className="edit-form">
                <div>
                  <label>Question Order:</label>
                  <div className="order-controls">
                    <button 
                      type="button"
                      onClick={() => handleOrderChange(editForm.order - 1)}
                      disabled={editForm.order <= 1}
                    >
                      ↑
                    </button>
                    <span>{editForm.order}</span>
                    <button 
                      type="button"
                      onClick={() => handleOrderChange(editForm.order + 1)}
                      disabled={editForm.order >= questions.length}
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <div>
                  <label>Question:</label>
                  <input
                    value={editForm.question}
                    onChange={e => setEditForm({...editForm, question: e.target.value})}
                  />
                </div>

                <div>
                  <label>Description:</label>
                  <textarea
                    value={editForm.description}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>

                <div>
                  <label>Answer Type:</label>
                  <select
                    value={editForm.answer_type}
                    onChange={e => setEditForm({...editForm, answer_type: e.target.value})}
                  >
                    <option value="text">Text</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="multiple_choice">Multiple Choice</option>
                  </select>
                </div>

                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={editForm.required}
                      onChange={e => setEditForm({...editForm, required: e.target.checked})}
                    />
                    Required
                  </label>
                </div>

                {(editForm.answer_type === 'multiple_choice' || editForm.answer_type === 'dropdown') && (
                  <div className="multiple-choice-section">
                    <h4>Multiple Choice Options:</h4>
                    <div className="add-option">
                      <input
                        type="text"
                        value={editForm.newOption}
                        onChange={e => setEditForm({...editForm, newOption: e.target.value})}
                        placeholder="New option"
                      />
                      <button type="button" onClick={handleAddEditOption}>Add Option</button>
                    </div>
                    <ul className="options-list">
                      {editForm.multiple_choice_answers.map(option => (
                        <li key={option.id}>
                          <input
                            type="text"
                            value={option.answer}
                            onChange={e => handleEditOption(option.id, e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={() => handleRemoveEditOption(option.id)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="edit-actions">
                  <button type="button" onClick={handleSave}>Save</button>
                  <button type="button" onClick={() => setEditingQuestionId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3>{question.question}</h3>
                <p>{question.description}</p>
                <p>Type: {question.answer_type}</p>
                {question.multiple_choice_answers && (
                  <div>
                    <p>Options:</p>
                    <ul>
                      {question.multiple_choice_answers.map(option => (
                        <li key={option.id}>{option.answer}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <button onClick={() => handleEdit(question)}>Edit</button>
                  <button onClick={() => handleArchive(question.id)}>Archive</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="create-question-form">
        <h3>Create New Question</h3>
        <form onSubmit={handleCreate}>
          <div>
            <label htmlFor="question">Question:</label>
            <input
              id="question"
              value={newQuestion.question}
              onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
              placeholder="Question"
              required
            />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={newQuestion.description}
              onChange={e => setNewQuestion({...newQuestion, description: e.target.value})}
              placeholder="Description"
            />
          </div>

          <div>
            <label htmlFor="answer_type">Answer Type:</label>
            <select
              id="answer_type"
              value={newQuestion.answer_type}
              onChange={e => setNewQuestion({...newQuestion, answer_type: e.target.value})}
            >
              <option value="text">Text</option>
              <option value="dropdown">Dropdown</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={newQuestion.required}
                onChange={e => setNewQuestion({...newQuestion, required: e.target.checked})}
              />
              Required
            </label>
          </div>

          {(newQuestion.answer_type === 'multiple_choice' || newQuestion.answer_type === 'dropdown') && (
            <div className="multiple-choice-section">
              <h4>Multiple Choice Options:</h4>
              <div className="add-option">
                <input
                  type="text"
                  value={newQuestion.newOption}
                  onChange={e => setNewQuestion({...newQuestion, newOption: e.target.value})}
                  placeholder="Enter an option"
                />
                <button type="button" onClick={handleAddNewOption}>Add Option</button>
              </div>
              {newQuestion.multiple_choice_options.length > 0 && (
                <ul className="options-list">
                  {newQuestion.multiple_choice_options.map((option, index) => (
                    <li key={index}>
                      <span>{option}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveNewOption(index)}
                        className="remove-option"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit"
              disabled={(newQuestion.answer_type === 'multiple_choice' || newQuestion.answer_type === 'dropdown') && newQuestion.multiple_choice_options.length === 0}
            >
              Create Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 