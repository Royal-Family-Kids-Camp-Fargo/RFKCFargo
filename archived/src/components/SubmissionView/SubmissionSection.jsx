import { useParams, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

const ReadOnlyAnswer = ({ question, answer }) => {
  if (question.answer_type === "text") {
    if (question.question.toLowerCase().includes("phone")) {
      return (
        <div className="p-3 bg-light rounded">
          <p className="mb-0">
            {formatPhoneNumber(answer) || "No answer provided"}
          </p>
        </div>
      );
    }
    return (
      <div className="p-3 bg-light rounded">
        <p className="mb-0">{answer || "No answer provided"}</p>
      </div>
    );
  } else if (question.answer_type === "dropdown") {
    return (
      <div className="p-3 bg-light rounded">
        <p className="mb-0">{answer || "No selection made"}</p>
      </div>
    );
  } else if (question.answer_type === "multiple_choice") {
    const selectedAnswers = answer ? answer.split("|") : [];
    return (
      <div className="p-3 bg-light rounded">
        <ul className="list-unstyled mb-0">
          {selectedAnswers.map((answer, i) => (
            <li key={i}>{answer}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <p>Unknown question type: {question.answer_type}</p>;
  }
};

export default function SubmissionSection({ currentForm, currentSubmission }) {
  const { sectionIndex = 0 } = useParams();

  const currentSection = currentForm.sections.sort((a, b) => a.order - b.order)[
    Number(sectionIndex)
  ];
  const isLastSection = Number(sectionIndex) + 1 >= currentForm.sections.length;
  const isFirstSection = Number(sectionIndex) === 0;

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

      <Stack gap={4}>
        {currentSection.questions
          .sort((a, b) => a.order - b.order)
          .map((question, index) => {
            const submissionAnswer = currentSubmission.answers.find(
              (a) => String(a.question_id) === String(question.id)
            );

            return (
              <>
                {index > 0 && <hr className="text-muted opacity-25" />}
                <div key={question.id} className="question-container">
                  <Form.Group>
                    <Form.Label className="fw-bold mb-2">
                      {question.question}
                    </Form.Label>
                    {question.description && (
                      <Form.Text className="text-muted d-block mb-2">
                        {question.description}
                      </Form.Text>
                    )}
                    <ReadOnlyAnswer
                      question={question}
                      answer={submissionAnswer?.answer}
                    />
                  </Form.Group>
                </div>
              </>
            );
          })}
      </Stack>

      <div className="d-flex gap-2 justify-content-between mt-4">
        {!isFirstSection && (
          <Button
            variant="outline-secondary"
            as={Link}
            to={`/submission/${currentSubmission.id}/${
              Number(sectionIndex) - 1
            }`}
            className="px-4"
            style={{ borderColor: "#4b0082", color: "#4b0082" }}
          >
            Previous Section
          </Button>
        )}
        {!isLastSection && (
          <Button
            variant="primary"
            as={Link}
            to={`/submission/${currentSubmission.id}/${
              Number(sectionIndex) + 1
            }`}
            className="ms-auto px-4"
            style={{ backgroundColor: "#4b0082", borderColor: "#4b0082" }}
          >
            Next Section
          </Button>
        )}
      </div>
    </div>
  );
}
