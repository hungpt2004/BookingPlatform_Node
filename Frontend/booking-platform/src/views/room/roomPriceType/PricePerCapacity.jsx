import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button, Row, Col, Form } from 'react-bootstrap';
import { FaCircleInfo } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { formatCurrencyVND } from '../../../utils/FormatPricePrint';

const PricePerPerson = () => {
    const navigate = useNavigate();
    const [isEnabled, setIsEnabled] = useState(false);
    const [editableDiscounts, setEditableDiscounts] = useState([]);
    const savedData = JSON.parse(sessionStorage.getItem('groupDiscounts'));
    const roomPrice = savedData?.roomPrice || 0;
    // Load saved data on mount
    useEffect(() => {

        setIsEnabled(savedData.enabled);
        setEditableDiscounts(savedData.discounts.length > 0 ?
            savedData.discounts :
            []
        );
    }, []);

    const handleToggle = (checked) => {
        setIsEnabled(checked);
        // Reset discounts to 0% when disabled
        if (!checked) {
            setEditableDiscounts(prev => prev.map((item, idx) => ({
                ...item,
                discount: idx === 0 ? 0 : 0
            })));
        }
        if (checked) {
            setEditableDiscounts(prev =>
                prev.map((item, idx) => ({
                    ...item,
                    discount: Math.min((idx) * 0.05, 0.3) // Increase by 5%, max 30%
                }))
            );
        }
    };

    const handleDiscountChange = (index, value) => {
        const newDiscounts = [...editableDiscounts];
        newDiscounts[index].discount = Math.min(Number(value) / 100, 0.99);
        setEditableDiscounts(newDiscounts);
    };

    const handleSave = () => {
        sessionStorage.setItem('groupDiscounts', JSON.stringify({
            enabled: isEnabled,
            discounts: editableDiscounts
        }));
        navigate(-1);
    };

    return (
        <Container className="mt-4 w-50">
            <h3 className='fw-bold'>Giá theo cỡ nhóm</h3>

            <Card>
                <Card.Body>

                    <Card.Text className='mt-2'>
                        Cài đặt giá thấp hơn cho nhóm dưới {editableDiscounts.length} sẽ giúp chỗ nghỉ hấp dẫn hơn trong mắt khách đặt tiềm năng.
                    </Card.Text>
                    <Card.Text className='mt-2'>
                        Các giảm giá được khuyến nghị được dựa trên dữ liệu từ các chỗ nghỉ tương tự với Quý vị. Những giảm giá này có thể được chỉnh sửa bất cứ lúc nào.
                    </Card.Text>

                    <Form.Check
                        type="switch"
                        id="enable-group-pricing"
                        label="Đã bật"
                        checked={isEnabled}
                        onChange={(e) => handleToggle(e.target.checked)}
                        className="mb-4"
                    />
                    {isEnabled && (
                        <Table>
                            <thead>
                                <tr>
                                    <th>Số khách</th>
                                    <th>Giảm giá (%)</th>
                                    <th>Giá sau giảm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableDiscounts.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.guests} khách</td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={(item.discount * 100).toFixed(0)}
                                                onChange={(e) => handleDiscountChange(idx, e.target.value)}
                                                min="0"
                                                max="99"
                                                disabled={!isEnabled || idx === 0}
                                                style={{
                                                    opacity: isEnabled ? 1 : 0.7,
                                                    backgroundColor: isEnabled ? 'white' : '#f8f9fa'
                                                }}
                                            />
                                        </td>
                                        <td>
                                            {formatCurrencyVND(
                                                isEnabled ?
                                                    roomPrice * (1 - item.discount) :
                                                    roomPrice
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-between gap-3 mt-4">
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Lưu thay đổi
                </Button>
            </div>
        </Container>
    );
};

export default PricePerPerson;