
const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {


  const base =
    "inline-flex cursor-pointer items-center justify-center px-3 py-2 font-medium transition focus:outline-none disabled:cursor-not-allowed lg:px-4 lg:py-2";

  // Color / variant styles
  const variants = {
    primary: "bg-btn-primary text-white hover:opacity-90",
    secondary: "bg-btn-secondary text-white hover:opacity-90",
    outline:
      " text-[#1C1C1C] bg-gray-100",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
