import { useParams, Link } from 'react-router-dom';

const ReadOnlyAnswer = ({ question, answer }) => {
  if (question.answer_type === 'text') {
    return <p>{answer || 'No answer provided'}</p>;
  } else if (question.answer_type === 'dropdown') {
    return <p>{answer || 'No selection made'}</p>;
  } else if (question.answer_type === 'multiple_choice') {
    const selectedAnswers = answer ? answer.split('|') : [];
    return (
      <ul>
        {selectedAnswers.map((answer, i) => (
          <li key={i}>{answer}</li>
        ))}
      </ul>
    );
  } else {
    return <p>Unknown question type: {question.answer_type}</p>;
  }
};

export default function SubmissionSection({ currentForm, currentSubmission }) {
  const sectionIndex = useParams().sectionIndex || 0;

  const currentSection = currentForm.sections.sort((a, b) => a.order - b.order)[Number(sectionIndex)];
  const isLastSection = Number(sectionIndex) + 1 >= currentForm.sections.length;
  const isFirstSection = Number(sectionIndex) === 0;

  return (
    <div>
      <h1>{currentSection.name}</h1>
      <h2>{currentSection.description}</h2>
      <h3>
        Section {Number(sectionIndex) + 1} of {currentForm.sections.length}
      </h3>

      <div className='section-navigation'>
        {!isFirstSection && (
          <Link to={`/submission/${currentSubmission.id}/${Number(sectionIndex) - 1}`}>← Previous Section</Link>
        )}
        {!isLastSection && (
          <Link to={`/submission/${currentSubmission.id}/${Number(sectionIndex) + 1}`}>Next Section →</Link>
        )}
      </div>

      <div className='questions'>
        {currentSection.questions
          .sort((a, b) => a.order - b.order)
          .map((question) => {
            const submissionAnswer = currentSubmission.answers.find(
              (a) => String(a.question_id) === String(question.id)
            );

            return (
              <div key={question.id} className='question-container'>
                <h3>{question.question}</h3>
                <h4>{question.description}</h4>
                <ReadOnlyAnswer question={question} answer={submissionAnswer?.answer} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
