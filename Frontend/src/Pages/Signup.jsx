import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authSlice";
import { useEffect, useState } from "react";
import { User, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const signUpSchema = z.object({
    firstName: z.string().min(3, "Name must be at least 3 characters"),
    emailId: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const { 
        register, 
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: zodResolver(signUpSchema) });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = (data) => {
        const { emailId, ...info } = data;
        info.emailID = emailId;
        dispatch(registerUser(info));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-800 hover:border-blue-500/30 transition-all duration-300">
                    <div className="text-center mb-8">
                        <div className="flex items-center gap-3 justify-center">
                            <img 
                                src="https://res.cloudinary.com/dsty8mkcl/image/upload/v1750091120/m6ninozwcarwvbtnt5bq.png" 
                                alt="CodeStrike Logo" 
                                className="h-12 w-12"
                            />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                CodeStrike
                            </h1>
                        </div>
                        <p className="text-gray-400 mt-2">Level Up Your Coding Game</p>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="firstName"
                                    {...register("firstName")}
                                    placeholder="John Doe"
                                    className={`pl-10 w-full bg-gray-800/50 border ${errors.firstName ? 'border-red-500/50' : 'border-gray-700'} rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors`}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.firstName && (
                                <p className="mt-1.5 flex items-center text-sm text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="emailId" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="emailId"
                                    {...register("emailId")}
                                    placeholder="john@example.com"
                                    className={`pl-10 w-full bg-gray-800/50 border ${errors.emailId ? 'border-red-500/50' : 'border-gray-700'} rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors`}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.emailId && (
                                <p className="mt-1.5 flex items-center text-sm text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.emailId.message}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className={`pl-10 w-full bg-gray-800/50 border ${errors.password ? 'border-red-500/50' : 'border-gray-700'} rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors pr-10`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 flex items-center text-sm text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isLoading || isSubmitting}
                                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading || isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link 
                                to="/signin" 
                                className="font-medium text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;