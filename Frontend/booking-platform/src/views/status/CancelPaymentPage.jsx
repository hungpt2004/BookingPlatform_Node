import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";

const CancelPaymentPage = () => {

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Card className="text-center p-4 shadow-lg" style={{ maxWidth: "400px" }}>
        <Card.Body>
          {loading ? (
            <>
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Processing cancellation...</span>
              </Spinner>
              <Card.Title>Processing Cancellation</Card.Title>
              <Card.Text className="text-muted">
                Please wait while we update your reservation.
              </Card.Text>
            </>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <Card.Title className="text-danger fw-bold">Cancellation Failed</Card.Title>
              <Card.Text className="text-muted">
                We were unable to process your cancellation request.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate("/home")}>
                Back to Home
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CancelPaymentPage;
