type ButtonProps = {
  className?: string
  children?: React.ReactNode
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <>
      <button {...rest} className={`w-16 px-6 py-2 ${className}`}>
        {children}
      </button>
    </>
  )
}

export default Button;
