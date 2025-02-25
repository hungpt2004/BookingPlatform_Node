import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import { Button, Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import CustomNavbar from '../../components/navbar/CustomNavbar';
const FavoriteHotelsList = () => {
    const [favorites, setFavorites] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axiosInstance.get('/favorite/get-all-favorite');
                const hotelIds = response.data.favorites.map(hotel => hotel._id);
                setFavorites(hotelIds);

                // Fetch hotel details
                const hotelDetailsPromises = hotelIds.map(id =>
                    axiosInstance.get(`/hotel/get-hotel-detail/${id}`)
                );

                const hotelsResponse = await Promise.all(hotelDetailsPromises);
                setHotels(hotelsResponse.map(res => res.data.hotel));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (hotelId) => {
        try {
            await axiosInstance.delete('/favorite/remove-favorite', {
                data: { hotelId }
            });
            setFavorites(favorites.filter(id => id !== hotelId));
            setHotels(hotels.filter(hotel => hotel._id !== hotelId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove favorite');
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <>
            <CustomNavbar />

            <Container className="my-5">
                <h2 className="mb-4">Your Favorite Hotels</h2>

                {hotels.length === 0 ? (
                    <Alert variant="info">You haven't added any hotels to favorites yet.</Alert>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {hotels.map((hotel) => (
                            <Col key={hotel._id}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Img
                                        variant="top"
                                        src={hotel.images?.[0]}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body>
                                        <Card.Title>
                                            <Link
                                                to={`/hotel-detail/${hotel._id}`}
                                                className="text-decoration-none text-dark"
                                            >
                                                {hotel.hotelName}
                                            </Link>
                                        </Card.Title>
                                        <Card.Text className="text-muted small">
                                            <i className="bi bi-geo-alt"></i> {hotel.address}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="badge bg-warning text-dark">
                                                ⭐ {hotel.rating}
                                            </span>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemoveFavorite(hotel._id)}
                                            >
                                                <i className="bi bi-trash"></i> Remove
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

        </>);
};

export default FavoriteHotelsList;
