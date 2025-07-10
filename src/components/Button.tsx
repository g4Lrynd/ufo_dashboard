interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button = ({ onClick, disabled = false, children }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} className="button">
      {children}
    </button>
  );
};

export default Button;
