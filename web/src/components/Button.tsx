type ButtonProps = {
  className?: string
  children?: React.ReactNode
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <>
      <button {...rest} className={`min-w-fit font-semibold ring ring-dark-1 focus:ring-blue-900 rounded-md px-6 py-2 ${className}`}>
        {children}
      </button>
    </>
  )
}

export default Button;
