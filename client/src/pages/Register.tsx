import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { companyLogo } from '../constants/images';
import FormContainer from '../components/auth/FormContainer';

export default function Register() {
  const handleSubmit = async (values) => {
    const { username, password } = values;
    console.log({ username, password });
  };

  return (
    <FormContainer>
      <header className="my-4 flex flex-col">
        <div className="logo flex justify-center align-middle">
          <img src={companyLogo} alt="company-logo" />
        </div>
      </header>
      <Form className=" m-auto" layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Username"
          name="username"
          required
          rules={[
            { required: true, message: 'Username is required' },
            {
              min: 3,
              message: 'Username must be at least 3 characters long.',
            },
            {
              max: 20,

              message: 'Username must be at most 20 characters long.',
            },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message:
                'Username can contain only letters, numbers and _ characters. ',
            },
          ]}
        >
          <Input required />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              max: 30,
              message: 'Password cannot be more than 30 characters long',
            },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/,
              message:
                'Password must contain at least 1 uppercase, 1 lowercase, 1 digit, 1 special character and 8 characters long.',
            },
          ]}
        >
          <Input.Password required />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      <nav className="">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400">
          Sign In
        </Link>
      </nav>
    </FormContainer>
  );
}
