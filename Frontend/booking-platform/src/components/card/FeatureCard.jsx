"use client"

import { motion } from "framer-motion"
import { CreditCard, Lock, HeadphonesIcon } from "lucide-react"
import { Container, Row, Col } from "react-bootstrap"

export default function FeaturesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-light py-5"
    >
      <Container>
        <h2 className="text-center fw-bold mb-4">
          Why Choose <span style={{ color: "#003b95" }}>Travelofy?</span>
        </h2>

        <Row className="justify-content-center">
          <Col md={4} className="text-center">
            <FeatureCard
              icon={<CreditCard size={42} color="#003b95" />}
              title="Best Prices"
              description="We offer the most competitive rates with no hidden fees."
            />
          </Col>

          <Col md={4} className="text-center">
            <FeatureCard
              icon={<Lock size={42} color="#003b95" />}
              title="Security"
              description="Your information is encrypted and secure with us."
            />
          </Col>

          <Col md={4} className="text-center">
            <FeatureCard
              icon={<HeadphonesIcon size={42} color="#003b95" />}
              title="24/7 Support"
              description="Our team is available round-the-clock to assist you."
            />
          </Col>
        </Row>
      </Container>
    </motion.div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <div className="d-flex flex-column align-items-center">
        <div
          className="bg-white p-3 rounded-circle shadow-sm mb-3 d-flex justify-content-center align-items-center"
          style={{ width: "80px", height: "80px" }}
        >
          {icon}
        </div>
        <h3 className="fw-bold mt-2 mb-2" style={{ color: "#003b95" }}>
          {title}
        </h3>
        <p className="text-muted">{description}</p>
      </div>
    </motion.div>
  )
}

