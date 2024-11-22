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
    multiple_choice_answers: []
  });

  const currentForm = useStore(store => store.currentForm);
  const fetchFormById = useStore(store => store.fetchFormById);
  const updateQuestion = useStore(store => store.updateQuestion);
  const archiveQuestion = useStore(store => store.archiveQuestion);

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
      multiple_choice_answers: question.multiple_choice_answers || []
    });
  };

  const handleSave = async () => {
    try {
      await updateQuestion(editingQuestionId, editForm);
      await fetchFormById(formId);
      setEditingQuestionId(null);
    } catch (error) {
      console.error('Error updating question:', error);
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

  return (
    <div className="question-manager">
      <h2>Questions for Section: {currentSection?.name}</h2>
      <div className="questions-list">
        {questions.sort((a,b) => a.order - b.order).map(question => (
          <div key={question.id} className="question-item">
            {editingQuestionId === question.id ? (
              <div className="edit-form">
                <input
                  value={editForm.question}
                  onChange={e => setEditForm({...editForm, question: e.target.value})}
                />
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                />
                <select
                  value={editForm.answer_type}
                  onChange={e => setEditForm({...editForm, answer_type: e.target.value})}
                >
                  <option value="text">Text</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
                <div>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditingQuestionId(null)}>Cancel</button>
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
    </div>
  );
} 