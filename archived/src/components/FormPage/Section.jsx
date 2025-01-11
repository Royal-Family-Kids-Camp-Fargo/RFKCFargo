/*
    This component is responsible for drawing the questions for a given section,
    which are passed in via props.

    Each section has a 'save' button that save progress and push the user to the
    next step.
*/
import { useState, useEffect } from "react";
import useStore from "../../zustand/store";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import ProgressBar from "react-bootstrap/ProgressBar";

const Checkbox = ({ label, value, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

export default function Section({ currentForm, currentSubmission }) {
  const saveSubmissionProgress = useStore(
    (store) => store.saveSubmissionProgress
  );
  const finishSubmission = useStore((store) => store.finishSubmission);
  const { submissionId, sectionIndex } = useParams();
  const navigate = useNavigate();

  const currentSection = currentForm.sections.sort((a, b) => a.order - b.order)[
    Number(sectionIndex)
  ];
  const isLastSection = Number(sectionIndex) + 1 >= currentForm.sections.length;

  // Generates a default state like {5: {question_id: 5, answer: '', answer_id: 10}}
  const [answers, setAnswers] = useState({});

  console.log(`Questions State:`, answers);
  const updateQuestions = (question_id, answer) => {
    setAnswers({
      ...answers,
      [question_id]: {
        ...answers[question_id],
        answer,
      },
    });
  };

  useEffect(() => {
    // Build a place for every questions's answers, accounting for answers
    // that have already been saved by the user.
    setAnswers(
      currentSection.questions.reduce((prev, question) => {
        const foundAnswer = currentSubmission.answers.find(
          (a) => String(a.question_id) === String(question.id)
        );
        return {
          ...prev,
          [question.id]: {
            question_id: question.id,
            answer: foundAnswer?.answer || "",
            // look for existing answer in the submission's answer array
            answer_id: foundAnswer?.answer_id, // backend will UPDATE instead of INSERT if `answer_id` is present
          },
        };
      }, {})
    );
  }, [currentSection, currentSubmission]);

  const submitForm = (event) => {
    event.preventDefault();
    // Object.values returns an array of all dict values (we don't need the keys)
    saveSubmissionProgress(currentSubmission.id, Object.values(answers));

    if (event.nativeEvent.submitter.name === "final") {
      // this was the final step
      finishSubmission(currentSubmission.id);
      // navigate user to somewhere else?
      navigate("/finish");
      // TO DO: If form has a pipeline id, add the user to a pipeline automatically once they submit the form.
      // @jenny
    } else if (event.nativeEvent.submitter.name === "next") {
      const nextSectionIndex = Number(sectionIndex) + 1;
      navigate(`/form/${currentForm.id}/${nextSectionIndex}`);
    } else if (event.nativeEvent.submitter.name === "prev") {
      const nextSectionIndex = Number(sectionIndex) - 1;
      navigate(`/form/${currentForm.id}/${nextSectionIndex}`);
    }
  };

  const FormInput = (question) => {
    if (question.answer_type === "text") {
      return (
        <div className="p-3 bg-light rounded">
          <Form.Control
            value={answers[question.id]?.answer || ""}
            onChange={(e) => updateQuestions(question.id, e.target.value)}
            required={question.required}
            style={{
              border: "none",
              backgroundColor: "transparent",
              padding: "0",
            }}
          />
        </div>
      );
    } else if (question.answer_type === "dropdown") {
      return (
        <div className="p-3 bg-light rounded">
          <Form.Select
            value={answers[question.id]?.answer || ""}
            onChange={(e) => updateQuestions(question.id, e.target.value)}
            required={question.required}
            style={{
              border: "none",
              backgroundColor: "transparent",
              padding: "0",
            }}
          >
            <option disabled value="">
              {" "}
              -- select an option --{" "}
            </option>
            {question.multiple_choice_answers.map((MCAnswer) => (
              <option key={MCAnswer.id} value={MCAnswer.answer}>
                {MCAnswer.answer}
              </option>
            ))}
          </Form.Select>
        </div>
      );
    } else if (question.answer_type === "multiple_choice") {
      const thisAnswer = answers[question.id]?.answer || "";
      return (
        <div className="p-3 bg-light rounded">
          {question.multiple_choice_answers.map((MCAnswer, i) => (
            <Form.Check
              key={i}
              type="checkbox"
              label={MCAnswer.answer}
              checked={thisAnswer
                .split("|")
                .some((ans) => ans.trim() === MCAnswer.answer.trim())}
              onChange={(e) => {
                const currentSelection = [
                  ...thisAnswer
                    .split("|")
                    .filter((a) => a !== MCAnswer.answer && a !== ""),
                  ...(e.target.checked ? [MCAnswer.answer] : []),
                ];
                updateQuestions(question.id, currentSelection.join("|"));
              }}
            />
          ))}
        </div>
      );
    } else {
      return <div>Unknown question type {question.answer_type}</div>;
    }
  };
  return (
    <div>
      <h2
        className="h4 mb-4 fw-bold"
        style={{
          color: "#4b0082",
          borderLeft: "4px solid #4b0082",
          paddingLeft: "12px",
        }}
      >
        {currentSection.name}
      </h2>

      <ProgressBar
        now={((Number(sectionIndex) + 1) / currentForm.sections.length) * 100}
        className="mb-4"
        label={`Step ${Number(sectionIndex) + 1} of ${
          currentForm.sections.length
        }`}
        variant="success"
      />

      <Form onSubmit={submitForm}>
        <Stack gap={4}>
          {currentSection.questions
            .sort((a, b) => a.order - b.order)
            .map((question, i) => (
              <div key={i} className="question-container">
                <Form.Group>
                  <Form.Label className="fw-bold mb-2">
                    {question.question}
                  </Form.Label>
                  {question.description && (
                    <Form.Text className="text-muted d-block mb-2">
                      {question.description}
                    </Form.Text>
                  )}
                  {FormInput(question)}
                </Form.Group>
              </div>
            ))}
        </Stack>

        <div className="d-flex gap-2 justify-content-between mt-4">
          {Number(sectionIndex) > 0 && (
            <Button
              variant="outline-secondary"
              name="prev"
              type="submit"
              className="px-4"
              style={{ borderColor: "#4b0082", color: "#4b0082" }}
            >
              Previous Step
            </Button>
          )}
          <Button
            variant="primary"
            name={isLastSection ? "final" : "next"}
            type="submit"
            className="ms-auto px-4"
            style={{ backgroundColor: "#4b0082", borderColor: "#4b0082" }}
          >
            {isLastSection ? "Submit Form" : "Continue"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
