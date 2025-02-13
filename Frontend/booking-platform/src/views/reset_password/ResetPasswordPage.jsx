import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
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
    <>
    <CustomToast/>
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ maxWidth: "400px", width: "100%" }} className="p-4 shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">Reset Password</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Set New Password"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
};

export default ResetPasswordPage;
