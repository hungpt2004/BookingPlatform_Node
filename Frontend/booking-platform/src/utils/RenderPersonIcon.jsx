export const renderPersonIcon = (capacity) => {
   var personString = '';
   for(var i = 0; i < capacity; i++) {
      personString += '👤'
   }
   return personString;
}

export const renderStarIcon = (star) => {
   var personString = '';
   for(var i = 0; i < star; i++) {
      personString += '⭐'
   }
   return personString;
}