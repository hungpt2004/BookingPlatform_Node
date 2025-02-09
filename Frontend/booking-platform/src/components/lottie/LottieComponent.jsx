import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../assets/animation/search.json'

const LottieComponent = () => {
  const defaultOptions = {
    loop: true,  // Set to true for continuous looping of the animation
    autoplay: true,  // Start the animation immediately
    animationData: animationData,  // Pass the animation data here
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice', // Adjusts how the animation fits into its container
    },
  };

  return (
    <div className='row d-flex justify-content-center w-100'>  {/* Set the size of the animation */}
      <Lottie 
         className="img-fluid"
         style={{height: 250, width: 500,}}
         options={defaultOptions} 
      />
    </div>
  );
};

export default LottieComponent;
