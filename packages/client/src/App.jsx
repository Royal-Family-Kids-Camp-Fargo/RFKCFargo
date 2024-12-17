import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Row, Col } from 'react-bootstrap';

// Import our custom Sass that includes Bootstrap with overrides
import './styles/custom.scss';
import 'react-toastify/dist/ReactToastify.css';

import useStore from './zustand/store';
import Navigation from './components/Nav/Nav';
import HomePage from './components/HomePage/HomePage';
import AuthModal from './components/AuthModal/AuthModal';
import Pipeline from './components/Pipeline/Pipeline';
import FormPage from './components/FormPage/FormPage';
import SubmissionPage from './components/FormPage/SubmissionPage';
import FormEditor from './components/FormEditPage/FormEditPage';
import FormAdmin from './components/FormAdmin/FormAdmin';
import QuestionManager from './components/QuestionManager/QuestionManager';
import SubmissionView from './components/SubmissionView/SubmissionView';
import Footer from './components/Footer/Footer';
import favicon from '../public/favicon.png';
import { sessionApi } from './api/sessions';
import { ToastContainer } from 'react-toastify';
import ChatBubble from './components/ChatBubble';
import settings from './config/settings';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const roleId = useStore((state) => state.roleId);
  const setRoleId = useStore((state) => state.setRoleId);
  const setClasses = useStore((state) => state.setClasses);
  useEffect(() => {
    async function authenticate() {
      if (!localStorage.getItem('accessToken')) {
        const { roleId } = await sessionApi.anonymousAuthenticate();
        setRoleId(roleId);
      } else {
        sessionApi.validateAndRefreshSession().then((role) => {
          console.log("validated roleId", role);
          setRoleId(role.roleid);
          setClasses(role.classes);
        });
      }
    }
    authenticate();
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
            <Route exact path='/pipeline' Component={Pipeline} />
            <Route exact path='/pipeline/:pipelineId' Component={Pipeline} />
            <Route
              path='/submission/:submissionId/:sectionIndex?'
              element={roleId ? <SubmissionView /> : <Navigate to='/' replace />}
            />
            <Route
              exact
              path='/form/:formId/:sectionIndex'
              element={roleId ? <FormPage /> : <Navigate to='/' replace />}
            />
            <Route exact path='/finish' element={<SubmissionPage />} />
            <Route exact path='/formEdit/:formId' element={<FormEditor />} />
            <Route exact path='/admin/forms' element={roleId ? <FormAdmin /> : <Navigate to='/' replace />} />
            <Route path='/admin/forms/:formId/section/:sectionId' element={<QuestionManager />} />
            <Route path='*' element={<h2>404 Page</h2>} />
          </Routes>
        </main>
      </Container>
      <Footer />
      <ToastContainer />
      {roleId && roleId != String(settings.nobodyRoleId) && <ChatBubble />}
    </>
  );
}

export default App;
