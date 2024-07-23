import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ForgotPassword from "./components/ForgotPassword";
import NewPage from "./components/NewPage";
//  import "./components/New.css"
import Profile from "./components/Profile";
import IAMRole from "./components/IAMRole";
import OrgAdmin from "./components/OrgAdmin";

import Register from "./components/UserLogin/Register";
import AssessmentDetails from "./components/assesmentSuper/AssesmentDetails";

function App() {
  return (
    <Container style={{ width: "100%" }}>
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route
                path="/orgAdmin"
                element={
                  <ProtectedRoute>
                    <OrgAdmin />
                  </ProtectedRoute>
                }
              />
             
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/new" element={<NewPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/IAMRole" element={<IAMRole/>} />
              <Route path="/register" element={<Register/>} />
               <Route path="/assessment" element={<AssessmentDetails/>} />
              {/* <Route path="/orgAdmin" element={<OrgAdmin/>} /> */}
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;