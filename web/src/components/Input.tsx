type InputProps = {
  type: string;
  className?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<InputProps> = ({ type, className = '', ...rest }) => {
  return (
    <>
      <input type={type} className={`px-3 bg-transparent ring py-2 outline-none text-white font-medium h-10 rounded-md ring-dark-1 ${className}`} {...rest} />
    </>
  )
}

export default Input;
