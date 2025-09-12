import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import type { LoginData } from './types';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authservices';

const Login = () => {
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    });

    const [error, setError] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if(loginData.email == '' || loginData.password == ''){
            setLoading(false);
            return setError('Email and password must be specified');
        }

        try {
            const response = await authService.login(loginData);
            console.log('Login response:', response);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response.data.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

  return (
        <div className='h-screen flex flex-col items-center justify-center bg-gray-50' onClick={() => setError('')}>
            {error && (
                <div className='fixed top-4 z-50 w-1/5 mb-4 p-3 bg-white border-2 border-red-400 text-red-500 rounded text-center text-sm font-medium'>
                    {error}
                </div>
            )}
            <div className='relative flex flex-col justify-center items-center gap-2 mb-4'>
                <h3 className='text-4xl font-bold text-yellow-400'>Log in</h3>
                <div className='bg-yellow-400 w-1/2 h-1.5 border border-solid border-yellow-400 rounded-2xl'></div>
            </div>
            <form 
            onSubmit={handleSubmit}
            className='w-1/3 h-2/3 py-4 px-8 flex flex-col justify-around items-center bg-white rounded-xl shadow-xl border-2 border-gray-100 border-solid transition-all duration-500'>


                <div className='flex flex-col w-full gap-6'>
                    <div className='flex flex-col w-full'>
                        <label htmlFor='email' className='font-medium pb-2'><FontAwesomeIcon icon={faEnvelope} className='mr-1 text-yellow-400'/>Email</label>
                        <input 
                        type='text' 
                        placeholder='Email' 
                        id='email' 
                        value={loginData.email}
                        onChange={handleChange}
                        className='w-full py-2.5 px-4 outline-gray-400 outline-solid outline transition-all duration-100 focus:outline-yellow-400 focus:outline-2 rounded-lg bg-gray-100 placeholder:text-gray-400 placeholder:text-sm' />
                    </div>
                    <div className='flex flex-col w-full'>
                        <label htmlFor='password' className='font-medium pb-2'><FontAwesomeIcon icon={faKey} className='mr-1 text-yellow-400' />Password</label>
                        <input 
                        type='password' 
                        placeholder='Password' 
                        id='password' 
                        value={loginData.password}
                        onChange={handleChange}
                        className='w-full py-2.5 px-4 outline-gray-400 outline-solid outline transition-all duration-100 focus:outline-yellow-400 focus:outline-2 rounded-lg bg-gray-100 placeholder:text-gray-400 placeholder:text-sm' />
                    </div>
                </div>
                <div className='w-full flex flex-col items-center justify-center'>
                    <Link 
                    to='/signup' 
                    className='text-yellow-500 underline cursor-pointer transition-all duration-300 hover:text-yellow-400 mb-4 text-sm'
                    >Are you new? Sign up here</Link>
                    <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-3 border-2 border-solid border-black text-white bg-black rounded-3xl transition-all duration-300 hover:text-yellow-400 hover:shadow-yellow-500/50 shadow-md cursor-pointer font-medium'>
                        {loading ? 'Loading...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
  )
}

export default Login

