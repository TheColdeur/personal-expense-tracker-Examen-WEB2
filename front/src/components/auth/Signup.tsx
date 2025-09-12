import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import type { SignupData } from './types';
import { authService } from '../../services/authservices';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [signupData, setSignupData] = useState<SignupData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData({
            ...signupData,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if(signupData.username == "" || signupData.email == "" || signupData.password == "" ||signupData.confirmPassword == ""){
            setLoading(false);
            return setError('All field must be specified');
        }

        if(signupData.password !== signupData.confirmPassword){
            setLoading(false);
            return setError("The password doesn't match");
        }

        try {
            const response = await authService.signup(signupData);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.response.data.message || 'Signup failed');
        } finally{
            setLoading(false);
        }
    }
  return (
    <div className='h-screen flex flex-col items-center justify-center bg-gray-50 gap-4' onClick={() => setError('')}>
        {error && (
            <div className='fixed top-4 z-50 w-1/5 mb-4 p-3 bg-white border-2 border-red-400 text-red-500 rounded text-center text-sm font-medium'>
                {error}
            </div>
        )}
        <div className='relative flex flex-col justify-center items-center gap-2'>
            <h3 className='text-4xl font-bold text-yellow-400'>Sign up</h3>
            <div className='bg-yellow-400 w-1/2 h-1.5 border border-solid border-yellow-400 rounded-2xl'></div>
        </div>
        <form 
        onSubmit={handleSubmit}
        className='w-1/3 h-4/5 py-4 px-8 flex flex-col justify-around items-center bg-white rounded-xl shadow-xl border-2 border-gray-100 border-solid transition-all duration-500'>
            
            <div className='flex flex-col w-full gap-2'>
                <div className='flex flex-col w-full'>
                    <label htmlFor="username" className='font-medium pb-2 text-sm'><FontAwesomeIcon icon={faUser} className='mr-1 text-yellow-400'/>Username</label>
                    <input 
                    type="text" 
                    placeholder='username' 
                    id="username" 
                    value={signupData.username}
                    onChange={handleChange}
                    className='w-full py-2.5 px-4 outline-gray-400 outline-solid outline transition-all duration-100 focus:outline-yellow-400 focus:outline-2 rounded-lg bg-gray-100 placeholder:text-gray-400 placeholder:text-sm' />
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="email" className='font-medium pb-2 text-sm'><FontAwesomeIcon icon={faEnvelope} className='mr-1 text-yellow-400'/>Email</label>
                    <input 
                    type="text" 
                    placeholder='Email' 
                    id="email" 
                    value={signupData.email}
                    onChange={handleChange}
                    className='w-full py-2.5 px-4 outline-gray-400 outline-solid outline transition-all duration-100 focus:outline-yellow-400 focus:outline-2 rounded-lg bg-gray-100 placeholder:text-gray-400 placeholder:text-sm' />
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="password" className='font-medium pb-2 text-sm'><FontAwesomeIcon icon={faKey} className='mr-1 text-yellow-400' />Password</label>
                    <input 
                    type="password" 
                    placeholder='Password' 
                    id='password' 
                    value={signupData.password}
                    onChange={handleChange}
                    className='w-full py-2.5 px-4 outline-gray-400 outline-solid outline transition-all duration-100 focus:outline-yellow-400 focus:outline-2 rounded-lg bg-gray-100 placeholder:text-gray-400 placeholder:text-sm' />
                </div>
                <div className='flex flex-col w-full'>
                    <label htmlFor="password" className='font-medium pb-2 text-sm'><FontAwesomeIcon icon={faKey} className='mr-1 text-yellow-400' />Confirm Password</label>
                    <input 
                    type="password" 
                    placeholder='Password' 
                    id='confirmPassword' 
                    value={signupData.confirmPassword}
                    onChange={handleChange}
                    className='w-full py-2.5 px-4 outline-gray-400 outline-solid outline transition-all duration-100 focus:outline-yellow-400 focus:outline-2 rounded-lg bg-gray-100 placeholder:text-gray-400 placeholder:text-sm' />
                </div>
            </div>
            <div className='w-full flex flex-col items-center justify-center'>
                <Link 
                to="/login" 
                className='text-yellow-500 underline cursor-pointer transition-all duration-300 hover:text-yellow-400 mb-4 text-sm'
                >Already have an account? Login here</Link>
                <button 
                type='submit'
                className='w-full py-3 border-2 border-solid border-black text-white bg-black rounded-3xl transition-all duration-300 hover:text-yellow-400 hover:shadow-yellow-500/50 shadow-md cursor-pointer font-medium'>
                    {loading ? 'Loading...': 'Sign up'}
                </button>
            </div>
        </form>
    </div>
  )
}

export default Signup
