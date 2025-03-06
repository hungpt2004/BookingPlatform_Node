
import Proptype from 'prop-types';
import { Container, Card } from 'react-bootstrap';
const Step15 = ({ prevStep, nextStep }) => {
    return (
       <Container>
        <Card className='p-4 mt-3'>
            {/* Input Data */}
            
        </Card>
       </Container>
    )
}
Step15.prototype = {
    prevStep: Proptype.func.isRequired,
    nextStep: Proptype.func.isRequired
}
export default Step15