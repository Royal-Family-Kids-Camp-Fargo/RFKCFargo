import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function SubmissionPage() {
  return (
    <Container>
      <Row className='justify-content-center'>
        <Col md={8}>
          <div
            className='bg-white p-4 rounded shadow-sm'
            style={{ backgroundColor: 'rgba(255, 192, 203, 0.1) !important' }}
          >
            <h1 className='text-center mb-4 fw-bold' style={{ color: '#cc0000' }}>
              Thank you for applying!
            </h1>
            <hr className='mb-4' style={{ borderColor: '#4b0082', opacity: 0.25 }} />
            <p className='text-center mb-4 h5' style={{ color: '#4b0082' }}>
              Your application has been received and will be reviewed soon.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
