import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Radio, DatePicker, message } from 'antd';
import { companyLogo } from '@/constants/images';
import FormContainer from '@/components/auth/FormContainer';
import { REGISTER } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';

export default function Register() {
  const [register] = useMutation(REGISTER);
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    const { password, email, name, birth_date, phone_no, role } = values;
    try {
      const { data } = await register({
        variables: {
          user: {
            email,
            name,
            password,
            birth_date,
            phone_no,
            role,
          },
        },
      });
      if (!data.register) {
        message.error('Error creating account. Try again later.');
        return;
      }
      message.success('Account created Successfully!');
      navigate('/login');
    } catch (e) {
      message.error(e.message);
    }
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
          label="Name"
          name="name"
          required
          rules={[
            {
              pattern: /^[A-Za-z\-'\s]{3,50}$/,
              message:
                'Name can only contain alphabets, hyphen and whitespace and must be between 3 and 50 characters long.',
            },
          ]}
        >
          <Input required />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          required
          rules={[
            { required: true, message: 'email is required' },

            { type: 'email', message: 'Please input a valid email.' },
          ]}
        >
          <Input required />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone_no"
          required
          rules={[
            {
              pattern: /^[0-9]{10}$/,
              message: 'Phone Number must be a 10 digit number.',
            },
          ]}
        >
          <Input required />
        </Form.Item>
        <Form.Item
          name="role"
          rules={[{ required: true, message: 'Please pick a role.' }]}
        >
          <Radio.Group>
            <Radio value={'student'}>Student</Radio>
            <Radio value={'teacher'}>Teacher</Radio>
            <Radio value={'admin'}>Admin</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="birth_date"
          rules={[
            { required: true, message: 'Birth date is required.' },
            {
              validator: async (_, date, __) => {
                const birth_date = new Date(date);
                const now = new Date();
                const ageDifferenceMs = now - birth_date;
                const ageInYears =
                  ageDifferenceMs / (1000 * 60 * 60 * 24 * 365);
                if (ageInYears < 18 || ageInYears > 80) {
                  return Promise.reject('Age must be between 18 to 80 years.');
                }
              },
            },
          ]}
        >
          <DatePicker format={'YYYY-MM-DD'} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          required
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
