import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomSpinner.css'; // Style sheet riêng cho component

const SquareSpinner = () => {

   return (
      <Container className="d-flex flex-column mt-5 justify-content-start align-items-center min-vh-100">
         <Row className="mb-4">
            <Col className="d-flex justify-content-center">

               <div className="spinner-container">
                  {/* Vuông ngoài cùng */}
                  <div className="square-spinner level-1"></div>

                  {/* Vuông thứ hai */}
                  <div className="square-spinner level-2"></div>

                  {/* Vuông thứ ba */}
                  <div className="square-spinner level-3"></div>

                  {/* Vuông thứ tư */}
                  <div className="square-spinner level-4"></div>

                  {/* Vuông trung tâm */}
                  {/* <div className="square-spinner level-5"></div> */}

                  {/* Hiệu ứng ánh sáng */}
                  <div className="light-effect"></div>

                  {/* Các hình vuông xoay quanh */}
                  {/* <div className="orbit-square orbit-1"></div>
                  <div className="orbit-square orbit-2"></div>
                  <div className="orbit-square orbit-3"></div>
                  <div className="orbit-square orbit-4"></div> */}
               </div>

            </Col>
         </Row>
      </Container>
   );
};

export default SquareSpinner;