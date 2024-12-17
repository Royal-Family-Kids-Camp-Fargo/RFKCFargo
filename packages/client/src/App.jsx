import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Row, Col } from 'react-bootstrap';

// Import our custom Sass that includes Bootstrap with overrides
import './styles/custom.scss';

import useStore from './zustand/store';
import Navigation from './components/Nav/Nav';
import HomePage from './components/HomePage/HomePage';
import AuthModal from './components/AuthModal/AuthModal';
import Pipeline from './components/Pipeline/Pipeline';
import Profile from './components/Profile/Profile';
import FormPage from './components/FormPage/FormPage';
import SubmissionPage from './components/FormPage/SubmissionPage';
import FormEditor from './components/FormEditPage/FormEditPage';
import FormAdmin from './components/FormAdmin/FormAdmin';
import QuestionManager from './components/QuestionManager/QuestionManager';
import SubmissionView from './components/SubmissionView/SubmissionView';
import Footer from './components/Footer/Footer';
import favicon from '../public/favicon.png';
import { sessionApi } from './api/sessions';
import settings from './config/settings';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const user = useStore((state) => state.user);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      sessionApi.anonymousAuthenticate();
    } else {
      if (localStorage.getItem('accessToken') && localStorage.getItem('roleId') != settings.anonymousRoleId) {
        setIsLoggedIn(true);
      }
      sessionApi.validateAndRefreshSession();
    }
  }, []);

  return (
    <>
      <Navbar bg='light' expand='lg' className='mb-4'>
        <Container>
          <Navbar.Brand>
            <img
              src={favicon}
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
              alt="Brand logo"
            />
            <span className="d-none d-sm-inline">Royal Family Kids Camp</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Navigation onAuthClick={() => setShowAuthModal(true)} />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />

      <Container>
        <main className='py-2'>
          <Routes>
            <Route
              exact
              path='/'
              Component={HomePage}
            />
            <Route exact path='/profile/:userId' Component={Profile} />
            <Route exact path='/pipeline' Component={Pipeline} />
            <Route
              path='/submission/:submissionId/:sectionIndex?'
              element={user.id ? <SubmissionView /> : <Navigate to='/' replace />}
            />
            <Route
              exact
              path='/form/:formId/:sectionIndex'
              element={user.id ? <FormPage /> : <Navigate to='/' replace />}
            />
            <Route exact path='/finish' element={<SubmissionPage />} />
            <Route exact path='/formEdit/:formId' element={<FormEditor />} />
            <Route
              exact
              path='/about'
              element={
                <Container className='py-1'>
                  <Row className='justify-content-center'>
                    <Col md={8}>
                      <div className='bg-white p-4 rounded shadow-sm'>
                        <h1 className='display-4 mb-4'>About Programming</h1>
                        <p className='lead mb-4'>
                          Intelligence doesn't seem like an aspect of personal character, and it isn't. Coincidentally,
                          great intelligence is only loosely connected to being a good programmer.
                        </p>
                        <h2 className='h4 text-primary mb-3'>What? You don't have to be superintelligent?</h2>
                        <p className='mb-4'>
                          No, you don't. Nobody is really smart enough to program computers. Fully understanding an
                          average program requires an almost limitless capacity to absorb details and an equal capacity
                          to comprehend them all at the same time. The way you focus your intelligence is more important
                          than how much intelligence you have…
                        </p>
                        <p className='mb-4'>
                          …most of programming is an attempt to compensate for the strictly limited size of our skulls.
                          The people who are the best programmers are the people who realize how small their brains are.
                          They are humble. The people who are the worst at programming are the people who refuse to
                          accept the fact that their brains aren't equal to the task. Their egos keep them from being
                          great programmers. The more you learn to compensate for your small brain, the better a
                          programmer you'll be.
                        </p>
                        <p className='squiggle h5 text-center my-5'>
                          The more humble you are, the faster you'll improve.
                        </p>
                        <footer className='text-muted text-end'>
                          <small>
                            --From Steve McConnell's <em>Code Complete</em>.
                          </small>
                        </footer>
                      </div>
                    </Col>
                  </Row>
                </Container>
              }
            />
            <Route exact path='/admin/forms' element={user.id ? <FormAdmin /> : <Navigate to='/' replace />} />
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
