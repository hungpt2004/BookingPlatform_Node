const Hotel = require('../models/hotel'); 

exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ message: 'Error fetching hotels', error });
    }
}; 
exports.searchAndFilterHotels = async (req, res) => {
    try {
        const { hotelName, address, checkinDate, checkoutDate, priceRange, numberOfPeople } = req.query;
        let query = {};

        if (hotelName) {
            query.hotelName = { $regex: hotelName, $options: 'i' }; 
        }

        if (address) {
            query.address = { $regex: address, $options: 'i' };
        }

        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            query.pricePerNight = { $gte: minPrice, $lte: maxPrice }; 
        }

        if (numberOfPeople) {
            query.capacity = { $gte: Number(numberOfPeople) }; 
        }
        const hotels = await Hotel.find(Object.keys(query).length ? query : {});
        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ message: 'Error fetching hotels', error });
    }
};