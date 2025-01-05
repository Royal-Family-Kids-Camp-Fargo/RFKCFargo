import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../../zustand/store';
import { Button, Form, Card } from 'react-bootstrap';
import './QuestionManager.css';

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
          <Card key={question.id} className="question-item mb-3">
            <Card.Body>
              {editingQuestionId === question.id ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Question Order:</Form.Label>
                    <div className="order-controls">
                      <Button 
                        variant="outline-primary"
                        onClick={() => handleOrderChange(editForm.order - 1)}
                        disabled={editForm.order <= 1}
                      >↑</Button>
                      <span>{editForm.order}</span>
                      <Button 
                        variant="outline-primary"
                        onClick={() => handleOrderChange(editForm.order + 1)}
                        disabled={editForm.order >= questions.length}
                      >↓</Button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Question:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editForm.question}
                      onChange={e => setEditForm({...editForm, question: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Description:</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Answer Type:</Form.Label>
                    <Form.Select
                      value={editForm.answer_type}
                      onChange={e => setEditForm({...editForm, answer_type: e.target.value})}
                    >
                      <option value="text">Text</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="multiple_choice">Multiple Choice</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Required"
                      checked={editForm.required}
                      onChange={e => setEditForm({...editForm, required: e.target.checked})}
                    />
                  </Form.Group>

                  {(editForm.answer_type === 'multiple_choice' || editForm.answer_type === 'dropdown') && (
                    <div className="multiple-choice-section">
                      <h4>Multiple Choice Options:</h4>
                      <Form.Group className="mb-3 d-flex gap-2">
                        <Form.Control
                          type="text"
                          value={editForm.newOption}
                          onChange={e => setEditForm({...editForm, newOption: e.target.value})}
                          placeholder="New option"
                        />
                        <Button 
                          variant="outline-primary"
                          onClick={handleAddEditOption}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Add Option
                        </Button>
                      </Form.Group>
                      <ul className="options-list">
                        {editForm.multiple_choice_answers.map(option => (
                          <li key={option.id}>
                            <Form.Control
                              type="text"
                              value={option.answer}
                              onChange={e => handleEditOption(option.id, e.target.value)}
                            />
                            <Button 
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveEditOption(option.id)}
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary"
                      onClick={handleSave}
                      style={{ backgroundColor: '#4b0082', borderColor: '#4b0082' }}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setEditingQuestionId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <h3>{question.question}</h3>
                  <p className="text-muted">{question.description}</p>
                  <p><strong>Type:</strong> {question.answer_type}</p>
                  {question.multiple_choice_answers && (
                    <div>
                      <p><strong>Options:</strong></p>
                      <ul className="list-unstyled">
                        {question.multiple_choice_answers.map(option => (
                          <li key={option.id}>{option.answer}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="d-flex gap-2 mt-3">
                    <Button 
                      variant="outline-primary"
                      onClick={() => handleEdit(question)}
                      style={{ borderColor: '#4b0082', color: '#4b0082' }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={() => handleArchive(question.id)}
                    >
                      Archive
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      <Card className="create-question-form mt-4">
        <Card.Body>
          <h3>Create New Question</h3>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Question:</Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.question}
                onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                placeholder="Question"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description:</Form.Label>
              <Form.Control
                as="textarea"
                value={newQuestion.description}
                onChange={e => setNewQuestion({...newQuestion, description: e.target.value})}
                placeholder="Description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Answer Type:</Form.Label>
              <Form.Select
                value={newQuestion.answer_type}
                onChange={e => setNewQuestion({...newQuestion, answer_type: e.target.value})}
              >
                <option value="text">Text</option>
                <option value="dropdown">Dropdown</option>
                <option value="multiple_choice">Multiple Choice</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Required"
                checked={newQuestion.required}
                onChange={e => setNewQuestion({...newQuestion, required: e.target.checked})}
              />
            </Form.Group>

            {(newQuestion.answer_type === 'multiple_choice' || newQuestion.answer_type === 'dropdown') && (
              <div className="multiple-choice-section">
                <h4>Multiple Choice Options:</h4>
                <Form.Group className="mb-3 d-flex gap-2">
                  <Form.Control
                    type="text"
                    value={newQuestion.newOption}
                    onChange={e => setNewQuestion({...newQuestion, newOption: e.target.value})}
                    placeholder="Enter an option"
                  />
                  <Button 
                    variant="outline-primary"
                    onClick={handleAddNewOption}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Add Option
                  </Button>
                </Form.Group>
                {newQuestion.multiple_choice_options.length > 0 && (
                  <ul className="options-list">
                    {newQuestion.multiple_choice_options.map((option, index) => (
                      <li key={index}>
                        <span>{option}</span>
                        <Button 
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveNewOption(index)}
                          className="remove-option"
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="d-flex gap-2">
              <Button 
                variant="primary"
                type="submit"
                disabled={(newQuestion.answer_type === 'multiple_choice' || newQuestion.answer_type === 'dropdown') && newQuestion.multiple_choice_options.length === 0}
                style={{ backgroundColor: '#4b0082', borderColor: '#4b0082' }}
              >
                Create Question
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
} 