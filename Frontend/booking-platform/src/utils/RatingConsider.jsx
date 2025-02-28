export const RatingConsider = (ratingValue) => {
   if(ratingValue === 5) {
      return "Very Good"
   } else if (3 <= ratingValue <= 4) {
      return "Good"
   } else if (1.5 <= ratingValue <= 2) {
      return "Medium"
   } else {
      return "Not Good"
   }
} 

