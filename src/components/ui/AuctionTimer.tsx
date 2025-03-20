
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TimerIcon } from "lucide-react";
import { getRemainingTime, isAuctionActive, auctionSettings } from "@/lib/data";

interface AuctionTimerProps {
  className?: string;
  compact?: boolean;
}

const AuctionTimer = ({ className, compact = false }: AuctionTimerProps) => {
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  const [status, setStatus] = useState<"not-started" | "active" | "ended">("not-started");
  
  useEffect(() => {
    const calculateStatus = () => {
      const now = new Date();
      if (now < auctionSettings.startDate) {
        setStatus("not-started");
      } else if (now <= auctionSettings.endDate) {
        setStatus("active");
      } else {
        setStatus("ended");
      }
    };
    
    calculateStatus();
    
    const timer = setInterval(() => {
      setRemainingTime(getRemainingTime());
      calculateStatus();
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = () => {
    if (remainingTime <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const seconds = Math.floor((remainingTime / 1000) % 60);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    
    return { days, hours, minutes, seconds };
  };
  
  const { days, hours, minutes, seconds } = formatTime();
  
  const getStatusText = () => {
    if (status === "not-started") {
      return "Auction starts in:";
    } else if (status === "active") {
      return "Auction ends in:";
    } else {
      return "Auction has ended";
    }
  };
  
  if (compact) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <TimerIcon className={cn(
          "h-4 w-4",
          status === "active" ? "text-green-500" : 
          status === "ended" ? "text-red-500" : "text-yellow-500"
        )} />
        <span className="text-sm font-medium">
          {status === "ended" ? (
            "Ended"
          ) : (
            `${days}d ${hours}h ${minutes}m ${seconds}s`
          )}
        </span>
      </div>
    );
  }
  
  return (
    <div className={cn("rounded-lg border p-4 bg-white", className)}>
      <div className="text-center mb-2">
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          status === "active" ? "bg-green-100 text-green-800" : 
          status === "ended" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
        )}>
          {status === "active" ? "Active" : status === "ended" ? "Ended" : "Coming Soon"}
        </span>
      </div>
      
      <p className="text-sm text-gray-500 text-center mb-3">{getStatusText()}</p>
      
      {status !== "ended" ? (
        <div className="grid grid-cols-4 gap-2">
          <TimeUnit value={days} label="Days" />
          <TimeUnit value={hours} label="Hours" />
          <TimeUnit value={minutes} label="Mins" />
          <TimeUnit value={seconds} label="Secs" />
        </div>
      ) : (
        <p className="text-center text-gray-500">Thank you for participating!</p>
      )}
    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit = ({ value, label }: TimeUnitProps) => (
  <div className="flex flex-col items-center">
    <div className="bg-gray-50 rounded-md w-full py-2 flex items-center justify-center">
      <span className="text-lg font-semibold">{value.toString().padStart(2, '0')}</span>
    </div>
    <span className="text-xs text-gray-500 mt-1">{label}</span>
  </div>
);

export default AuctionTimer;
