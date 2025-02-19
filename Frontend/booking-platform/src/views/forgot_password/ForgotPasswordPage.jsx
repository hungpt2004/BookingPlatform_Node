import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button, Form, Container, Row, Col, Card, Spinner } from "react-bootstrap";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <>
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-dark text-light shadow-lg rounded-3" style={{ maxWidth: "400px" }}>
          <Card.Body className="p-4">
            <h2 className="text-center fw-bold mb-4 text-info">Forgot Password</h2>

            {!isSubmitted ? (
              <Form onSubmit={handleSubmit}>
                <p className="text-center text-secondary mb-3">
                  Enter your email address and we will send you a link to reset your password.
                </p>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="info"
                    type="submit"
                    className="w-100 mt-3"
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner animation="border" size="sm" /> : "Send Reset Link"}
                  </Button>
                </motion.div>
              </Form>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="d-flex justify-content-center align-items-center mx-auto mb-3 bg-info text-white rounded-circle"
                  style={{ width: "60px", height: "60px" }}
                >
                  <Mail size={30} />
                </motion.div>
                <p className="text-secondary">
                  If an account exists for {email}, you will receive a password reset link shortly.
                </p>
              </div>
            )}
          </Card.Body>

          <Card.Footer className="bg-transparent text-center">
            <Link to="/" className="text-info text-decoration-none">
              <ArrowLeft size={16} className="me-1" /> Back to Login
            </Link>
          </Card.Footer>
        </Card>
      </motion.div>
    </Container>
    </>
  );
};

export default ForgotPasswordPage;
