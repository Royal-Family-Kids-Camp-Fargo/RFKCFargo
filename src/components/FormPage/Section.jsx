/*
    This component is responsible for drawing the questions for a given section,
    which are passed in via props.

    Each section has a 'save' button that save progress and push the user to the
    next step.
*/
import { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useNavigate, useParams } from "react-router-dom";

const Checkbox = ({ label, value, onChange }) => {
    return (
        <label>
            <input type="checkbox" checked={value} onChange={onChange} />
            {label}
        </label>
    );
};

export default function Section({ currentForm, currentSubmission }) {
    const saveSubmissionProgress = useStore(store => store.saveSubmissionProgress);
    const finishSubmission = useStore(store => store.finishSubmission);
    const { submissionId, sectionIndex } = useParams();
    const navigate = useNavigate();

    const currentSection = currentForm.sections[Number(sectionIndex)];
    const isLastSection = Number(sectionIndex) + 1 >= currentForm.sections.length;

    // Generates a default state like {5: {question_id: 5, answer: '', answer_id: 10}}
    const [answers, setAnswers] = useState({});


    console.log(`Questions State:`, answers);
    const updateQuestions = (question_id, answer) => {
        setAnswers({
            ...answers,
            [question_id]: {
                ...answers[question_id],
                answer
            }
        })
    }

    useEffect(() => {
        setAnswers(currentSection.questions.reduce((prev, question) => (
            {
                ...prev,
                [question.id]: {
                    question_id: question.id,
                    answer: currentSubmission.answers.find(a => String(a.question_id) === String(question.id))?.answer || '',
                    // look for existing answer in the submission's answer array
                    answer_id: currentSubmission.answers.find(a => String(a.question_id) === String(question.id))?.answer_id
                }
            }), {})
        );
    }, [currentSection, currentSubmission])

    const submitForm = event => {
        event.preventDefault();
        // Object.values returns an array of all dict values (we don't need the keys)
        saveSubmissionProgress(currentSubmission.id, Object.values(answers));

        if (event.nativeEvent.submitter.name === "final") {
            // this was the final step
            finishSubmission(currentSubmission.id);
            // navigate user to somewhere else?
        } else if (event.nativeEvent.submitter.name === "next") {
            const nextSectionIndex = Number(sectionIndex) + 1;
            navigate(`/form/${currentForm.id}/${nextSectionIndex}`);
        } else if (event.nativeEvent.submitter.name === "prev") {
            const nextSectionIndex = Number(sectionIndex) - 1;
            navigate(`/form/${currentForm.id}/${nextSectionIndex}`);
        }
    }

    const FormInput = (question) => {
        if (question.answer_type === 'text') {
            return (
                <input value={answers[question.id]?.answer || ''} onChange={e => updateQuestions(question.id, e.target.value)} />
            )
        } else if (question.answer_type === 'dropdown') {
            return (
                <select name={question.question} id={question.id} value={answers[question.id]?.answer || ''} onChange={e => updateQuestions(question.id, e.target.value)}>
                    <option disabled value=''> -- select an option -- </option>
                    {question.multiple_choice_answers.map((MCAnswer) => (
                        <option key={MCAnswer.id} value={MCAnswer.answer}>{MCAnswer.answer}</option>
                    ))}
                </select>
            )
        } else if (question.answer_type === 'multiple_choice') {
            const allOptions = question.multiple_choice_answers.map(a => a.answer); // ["gluten free", "vegan", "none"]
            const thisAnswer = answers[question.id]?.answer || ''; // string, comma separated like "gluten free|vegan"
            console.log('this answer: ', thisAnswer);
            return (
                <div>
                    {
                        question.multiple_choice_answers.map((MCAnswer, i) =>
                            <Checkbox
                                label={MCAnswer.answer}
                                value={thisAnswer.split('|').some(ans => (ans.trim() === MCAnswer.answer.trim()))}
                                onChange={e => {
                                    // when checked, build an answer string that contains only checked values
                                    // filter out existing selection if it exists
                                    // note: .split on an empty string returns [''] so we need to filter it out
                                    const currentSelection = [
                                        // filtering out the selection
                                        ...thisAnswer.split('|').filter(a => a !== MCAnswer.answer && a !== ''),
                                        // adding the answer if we are CHECKING a box
                                        ...(e.target.checked ? [MCAnswer.answer] : [])
                                    ]
                                    updateQuestions(question.id, currentSelection.join('|'));
                                }}
                            />
                        )
                    }
                </div>
            )
        } else {
            return (<div>Unknown question type {question.answer_type}</div>)
        }
    }
    return (
        <div>
            <h1>{currentSection.name}</h1>
            <h2>{currentSection.description}</h2>
            <h3>Step {Number(sectionIndex) + 1} of {currentForm.sections.length}</h3>
            <form onSubmit={submitForm}>
                {currentSection.questions.map((question, i) => (
                    <div key={i}>
                        <h3>{question.question}</h3>
                        <h4>{question.description}</h4>
                        {FormInput(question)}
                    </div>
                ))}
                {Number(sectionIndex) > 0 && <button name="prev">Save Progress and Go To Previous Step</button>}
                {isLastSection
                    ? <button name="final">Submit Form</button>
                    : <button name="next">Save Progress and Continue</button>
                }
            </form>
        </div>
    )
}