import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { companyLogo } from '../constants/images';
import FormContainer from '../components/auth/FormContainer';

export default function Login() {
  const handleSubmit = async (values) => {
    const { password, username } = values;
    console.log({ username, password });
  };

  return (
    <FormContainer>
      <header className="my-4 flex flex-col">
        <div className="logo flex justify-center align-middle">
          <img src={companyLogo} alt="company-logo" />
        </div>
        <h1 className="text-center text-3xl text-gray-700">Welcome Back!</h1>
      </header>
      <Form className=" m-auto" layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Username" name="username">
          <Input required />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password required />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="bg-blue-400 text-white my-2"
            // styles={{ color: 'white' }}
            block
            size="large"
            htmlType="submit"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
      <nav className="">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-blue-400">
          Sign Up
        </Link>
      </nav>
    </FormContainer>
  );
}
