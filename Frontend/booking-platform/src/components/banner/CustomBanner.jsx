import React from 'react'
import { Button, Container, Image, Row } from 'react-bootstrap'
import './CustomBanner.css'

export const CustomBanner = () => {
   return (
      <Container fluid className='p-0 m-0 vh-80 position-relative'>
         {/* <Image loading='lazy' src='https://cdn.pixabay.com/photo/2022/11/06/17/32/lake-thun-7574547_1280.jpg' fluid style={{ objectFit: 'cover', height: '100vh', width: '100%', opacity: 'black 0.5' }} /> */}
         <div className="position-absolute top-0 start-0 w-100 h-100 overlay-blur" style={{ willChange: 'transform' }}></div>
         <div className="position-absolute top-50 start-50 translate-middle text-white">
            <p className="text-center text-light" style={{ fontSize: '30px' }}>Welcome to Our Travelofy</p>
            <p className="text-center fw-bold" style={{ fontSize: '50px' }}>IT'S NICE TO MEET YOU</p>
            <div className='d-flex align-items-center '><Button variant='warning' className='mx-auto w-50'><p className='text-center p-0 m-0 py-2 fs-5 text-light'>TELL ME MORE</p></Button></div>
         </div>
      </Container>
   )
}
