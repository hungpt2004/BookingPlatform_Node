import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';
import { formatDate } from '../../utils/FormatDatePrint';
import { renderStarIcon } from '../../utils/RenderPersonIcon';
import { Card } from 'react-bootstrap';

export const TopCommentSlide = () => {

   const [comments, setComments] = useState([]);

   const fetchTopComments = async () => {
      try {
         const response = await axios.get(`${BASE_URL}/feedback/top-comment`);
         if (response.data && response.data.feedbacks) {
            setComments(response.data.feedbacks);
         }
      } catch (err) {
         console.log(err);
      }
   }

   useEffect(() => {
      fetchTopComments();
   }, [])



   return (
      <motion.div
         initial={{ opacity: 0, y: 50 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 2.5 }}
         viewport={{ once: true, amount: 0.3 }}
         className='mt-5 mb-5'
      >
         <Swiper
            // pagination={{}}
            // modules={[Pagination]}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            autoplay={true}
         >
            {comments.map((item, index) => {
               return (
                  <SwiperSlide key={index}>
                     <Card className='border-0 cursor-pointer mb-5'>
                        <div className='d-flex justify-content-center align-items-center mb-4'>
                           <div style={{ width: '100px', height: '100px', borderRadius: '50%' }}>
                              {/* <Image
                                 src={item.user.image?.url}
                                 fluid
                                 style={{ objectFit: 'cover', borderRadius: '50%' }}
                              /> */}
                           </div>
                        </div>
                        <Card.Title className='text-center'>{item.user.name}</Card.Title>
                        <Card.Subtitle className='text-center text-muted'>{formatDate(item.createdAt)}</Card.Subtitle>
                        <Card.Text className='text-center'>{renderStarIcon(item.rating)}</Card.Text>
                        <Card.Text className='text-center text-secondary'>"{item.content}"</Card.Text>
                     </Card>
                  </SwiperSlide>
               )
            })}
         </Swiper>
      </motion.div>
   )
}
