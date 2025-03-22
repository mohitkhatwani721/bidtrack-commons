
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'default' | 'light';
}

const Spinner = ({ 
  size = 'md', 
  className = '',
  color = 'default'
}: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const colorClasses = {
    default: 'border-primary border-t-transparent',
    light: 'border-white border-t-transparent'
  };
  
  return (
    <div className="flex justify-center items-center">
      <div 
        className={cn(
          "animate-spin rounded-full border-2", 
          sizeClasses[size],
          colorClasses[color],
          className
        )} 
      />
    </div>
  );
};

export default Spinner;
