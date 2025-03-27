import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Lock } from "lucide-react";
import {toast} from "react-toastify";
import { CustomToast } from "../../components/toast/CustomToast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully, redirecting to login page...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.message || "Error resetting password");
    }
  };

  return (
    <div 
      className="min-vh-100 bg-dark d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #1a1e21, #0d47a1, #0097a7)',
      }}
    >
      <CustomToast/>
      <Container className="d-flex justify-content-center align-items-center">
        <Card 
          className="bg-dark text-light shadow-lg rounded-3" 
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <Card.Body className="p-4">
            <h2 className="text-center fw-bold mb-4 text-info">Reset Password</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={18} />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock size={18} />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Button 
                variant="info" 
                type="submit" 
                className="w-100 mt-3" 
                disabled={isLoading}
              >
                {isLoading ? <Spinner animation="border" size="sm" /> : "Set New Password"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;