import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import Button from '../components/Button';
import Loading from '../components/Loader';
import Textbox from '../components/Textbox';
import { useLoginMutation, useRegisterMutation } from '../redux/slices/api/authApiSlice';
import { setCredentials } from '../redux/slices/authSlice';

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const isLoading = isLoginLoading || isRegisterLoading;

  const submitHandler = async (data) => {
    try {
      let result;
      
      if (isLogin) {
        result = await login(data);
        console.log("Login result:", result); // Debug log
        console.log("Result.data:", result.data); // Debug log
        console.log("Result.error:", result.error); // Debug log
        
        if (result.data) {
          dispatch(setCredentials(result.data));
          toast.success("Login successful!");
          console.log("User dispatched, navigating..."); // Debug log
          navigate("/");
        } else if (result.error) {
          toast.error(result.error.data?.message || "Login failed");
        } else {
          toast.error("Login failed - no data received");
        }
      } else {
        result = await registerUser(data);
        toast.success("Registration successful! Please login.");
        setIsLogin(true);
        reset();
      }
    } catch (error) {
      console.log("Login error:", error); // Debug log
      toast.error(error?.data?.message || (isLogin ? "Login failed" : "Registration failed"));
    }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
              Manage all your task in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Cloud-Based</span>
              <span>Task manager</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>   
        
        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                {isLogin ? 'Welcome back!' : 'Create Account'}
              </p>
              <p className='text-center text-base text-gray-700'>
                {isLogin ? 'Keep all your credential safe.' : 'Join our task management platform.'}
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              {/* Name field - only for register */}
              {!isLogin && (
                <Textbox
                  placeholder='John Doe'
                  type='text'
                  name='name'
                  label='Full Name'
                  classname='w-full rounded-full'
                  register={register("name", {
                    required: "Full name is required!",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                  error={errors.name ? errors.name.message : ""}
                />
              )}

              {/* Email field */}
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                classname='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                error={errors.email ? errors.email.message : ""}
              />

              {/* Password field */}
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                classname='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                error={errors.password ? errors.password.message : ""}
              />

              {/* Confirm Password field - only for register */}
              {!isLogin && (
                <Textbox
                  placeholder='confirm your password'
                  type='password'
                  name='confirmPassword'
                  label='Confirm Password'
                  classname='w-full rounded-full'
                  register={register("confirmPassword", {
                    required: "Please confirm your password!",
                    validate: (value) => {
                      const password = document.querySelector('input[name="password"]').value;
                      return value === password || "Passwords do not match";
                    }
                  })}
                  error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                />
              )}

              {/* Role field - only for register */}
              {!isLogin && (
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium text-gray-700'>Role</label>
                  <select
                    {...register("role", { required: "Role is required!" })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>Select a role</option>
                    <option value='developer'>Developer</option>
                    <option value='designer'>Designer</option>
                    <option value='manager'>Manager</option>
                    <option value='tester'>Tester</option>
                    <option value='other'>Other</option>
                  </select>
                  {errors.role && (
                    <span className='text-red-500 text-sm'>{errors.role.message}</span>
                  )}
                </div>
              )}

              {/* Title field - only for register */}
              {!isLogin && (
                <Textbox
                  placeholder='Software Engineer'
                  type='text'
                  name='title'
                  label='Job Title'
                  classname='w-full rounded-full'
                  register={register("title", {
                    required: "Job title is required!"
                  })}
                  error={errors.title ? errors.title.message : ""}
                />
              )}

              {/* Admin checkbox - only for register */}
              {!isLogin && (
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    {...register("isAdmin")}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <label className='text-sm text-gray-700'>
                    Admin privileges (optional)
                  </label>
                </div>
              )}

              {/* Forgot Password - only for login */}
              {isLogin && (
                <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                  Forget Password?
                </span>
              )}
              
              {/* Submit Button */}
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type='submit'
                  label={isLogin ? 'Login' : 'Register'}
                  className='w-full h-10 bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-full hover:from-purple-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-300'
                />
              )}

              {/* Toggle between login and register */}
              <div className='text-center'>
                <span className='text-sm text-gray-600'>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  type='button'
                  onClick={toggleMode}
                  className='ml-2 text-sm bg-gradient-to-r from-purple-600 to-blue-700 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-800 hover:underline font-medium transition-all duration-300'
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;