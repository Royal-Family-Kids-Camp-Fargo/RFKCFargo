import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import useStore from '../../zustand/store';
import Navigation from '../Nav/Nav';
import HomePage from '../HomePage/HomePage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import Pipeline from '../Pipeline/Pipeline';
import Profile from '../Profile/Profile';
import FormPage from '../FormPage/FormPage';
import SubmissionPage from '../FormPage/SubmissionPage';
import FormEditor from '../FormEditPage/FormEditPage';
import FormAdmin from '../FormAdmin/FormAdmin';
import QuestionManager from '../QuestionManager/QuestionManager';
import SubmissionView from '../SubmissionView/SubmissionView';
import Footer from '../Footer/Footer';

function App() {
  const user = useStore((state) => state.user);
  const fetchUser = useStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Debug Helper
  const store = useStore((store) => store);
  useEffect(() => {
    console.log(`Current Store: `, store);
  }, [store]);

  console.log(`user:`, user);
  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>EDA Solo Project</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Navigation />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <main className="py-2">
          <Routes>
            <Route
              exact
              path='/'
              element={
                user.id ? (
                  <HomePage /> // Render HomePage for authenticated user.
                ) : (
                  <Navigate to='/login' replace /> // Redirect unauthenticated user.
                )
              }
            />
            <Route
              exact
              path='/login'
              element={
                user.id ? (
                  <Navigate to='/' replace /> // Redirect authenticated user.
                ) : (
                  <LoginPage /> // Render LoginPage for unauthenticated user.
                )
              }
            />
            <Route exact path='/profile/:userId' Component={Profile} />

            <Route exact path='/pipeline' Component={Pipeline} />

            <Route
              exact
              path='/registration'
              element={
                user.id ? (
                  <Navigate to='/' replace /> // Redirect authenticated user.
                ) : (
                  <RegisterPage /> // Render RegisterPage for unauthenticated user.
                )
              }
            />
            <Route
              path='/submission/:submissionId/:sectionIndex?'
              element={user.id ? <SubmissionView /> : <LoginPage />}
            />
            <Route
              exact
              path='/form/:formId/:sectionIndex'
              element={
                user.id ? (
                  <FormPage /> // Render Form Page for authenticated user.
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route exact path='/finish' element={<SubmissionPage />} />
            <Route exact path='/formEdit/:formId' element={<FormEditor />} />

            <Route
              exact
              path='/about'
              element={
                <Container className="py-1">
                  <Row className="justify-content-center">
                    <Col md={8}>
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h1 className="display-4 mb-4">About Programming</h1>
                        
                        <p className="lead mb-4">
                          Intelligence doesn't seem like an aspect of personal character, and it isn't. 
                          Coincidentally, great intelligence is only loosely connected to being a good programmer.
                        </p>
                        
                        <h2 className="h4 text-primary mb-3">What? You don't have to be superintelligent?</h2>
                        
                        <p className="mb-4">
                          No, you don't. Nobody is really smart enough to program computers. Fully understanding an average
                          program requires an almost limitless capacity to absorb details and an equal capacity to comprehend
                          them all at the same time. The way you focus your intelligence is more important than how much
                          intelligence you have…
                        </p>
                        
                        <p className="mb-4">
                          …most of programming is an attempt to compensate for the strictly limited size of our skulls. The
                          people who are the best programmers are the people who realize how small their brains are. They are
                          humble. The people who are the worst at programming are the people who refuse to accept the fact that
                          their brains aren't equal to the task. Their egos keep them from being great programmers. The more you
                          learn to compensate for your small brain, the better a programmer you'll be.
                        </p>
                        
                        <p className="squiggle h5 text-center my-5">
                          The more humble you are, the faster you'll improve.
                        </p>
                        
                        <footer className="text-muted text-end">
                          <small>--From Steve McConnell's <em>Code Complete</em>.</small>
                        </footer>
                      </div>
                    </Col>
                  </Row>
                </Container>
              }
            />
            <Route exact path='/admin/forms' element={user.id ? <FormAdmin /> : <LoginPage />} />
            <Route path='/admin/forms/:formId/section/:sectionId' element={<QuestionManager />} />
            <Route path='*' element={<h2>404 Page</h2>} />
          </Routes>
        </main>
      </Container>
      <Footer />
    </>
  );
}

export default App;
