
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RefreshButtonProps {
  onRefresh: () => void;
}

const RefreshButton = ({ onRefresh }: RefreshButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRefresh}
      className="text-blue-600"
    >
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
  );
};

export default RefreshButton;
