import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const handleNotFound = () => {

}

const Notfound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Link to="/" ><Button type="primary" onClick={handleNotFound} >Back Home</Button></Link>}
  />
);

export default Notfound;