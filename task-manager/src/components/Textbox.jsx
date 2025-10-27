import React from 'react'
import clsx from "clsx"

const Textbox = React.forwardRef(({
    type, placeholder, label, className, register, name, error }, 
    ref) => {
        return (
            <div className='w-full flex flex-col gap-2'>
                {label && (
                    <label htmlFor={name} className='text-sm font-medium text-gray-700'>
                        {label}
                    </label>
                )}

                <div className='w-full'>
                    <input 
                        type={type}
                        name={name} 
                        placeholder={placeholder}
                        ref={ref}
                        {...register}
                        aria-invalid={error ? "true" : "false"}
                        className={clsx(
                            "w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 outline-none text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400",
                            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                            className
                        )}
                    />
                </div>
                
                {error && (
                    <span className='text-sm text-red-600 mt-1'>{error}</span>
                )}
            </div>
        );
    }
);

Textbox.displayName = 'Textbox';

export default Textbox;