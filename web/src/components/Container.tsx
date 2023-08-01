type ContainerProps = {
  className?: string
  children?: React.ReactNode
  md?: boolean
  lg?: boolean
  xl?: boolean
}

const Container: React.FC<ContainerProps> = ({ children, className = '', md = false, lg = true, xl = false }) => {
  return (
    <div className={`mx-auto ${!!md && "max-w-[760px]"} ${!!lg && "max-w-[1024px]"} ${!!xl && "max-w-[1440px]"} ${className}`}>
      {children}
    </div >
  )
}

export default Container;
