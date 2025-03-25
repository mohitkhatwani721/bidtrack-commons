
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, HelpCircle, CheckCircle, Loader2 } from "lucide-react";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured } from "@/lib/cloudinary";
import { toast } from "sonner";

type ConfigStatus = "valid" | "invalid" | "incomplete" | "checking";

const CloudinaryConfig = () => {
  const [configStatus, setConfigStatus] = useState<ConfigStatus>("checking");

  useEffect(() => {
    console.log("CloudinaryConfig component mounted");
    console.log("Cloudinary config:", {
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY ? "[REDACTED]" : undefined,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET
    });
    
    const hasCloudName = !!CLOUDINARY_CLOUD_NAME;
    const hasApiKey = !!CLOUDINARY_API_KEY;
    const hasUploadPreset = !!CLOUDINARY_UPLOAD_PRESET;
    
    if (hasCloudName && hasApiKey && hasUploadPreset) {
      setConfigStatus("valid");
      console.log("Cloudinary configuration is valid");
    } else if (hasCloudName && hasApiKey) {
      setConfigStatus("incomplete");
      console.warn("Cloudinary configuration is incomplete - missing upload preset");
    } else {
      setConfigStatus("invalid");
      console.error("Missing critical Cloudinary configuration");
    }
    
    const testUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_100/sample`;
    
    fetch(testUrl)
      .then(response => {
        if (!response.ok) {
          console.error("Cloudinary test request failed");
          toast.error("Failed to connect to Cloudinary");
        } else {
          console.log("Cloudinary test request succeeded");
        }
      })
      .catch(error => {
        console.error("Error testing Cloudinary connection:", error);
      });
  }, []);

  if (configStatus === "checking") {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="animate-spin h-4 w-4" />
        <span>Checking Cloudinary configuration...</span>
      </div>
    );
  }

  return (
    <>
      <Alert className={configStatus === "valid" ? "bg-green-50 border-green-200" : configStatus === "invalid" ? "bg-red-50 border-red-200" : "mb-4"}>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Cloudinary Configuration</AlertTitle>
        <AlertDescription>
          <div className="space-y-2">
            <p><strong>Status:</strong> {
              configStatus === "valid" ? (
                <span className="text-green-600 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> Valid
                </span>
              ) : configStatus === "invalid" ? (
                <span className="text-red-600 font-medium">Invalid</span>
              ) : (
                <span className="text-amber-600 font-medium">Incomplete</span>
              )
            }</p>
            <p><strong>Cloud Name:</strong> <code className="bg-muted px-1 rounded">{CLOUDINARY_CLOUD_NAME || "Not set"}</code></p>
            <p><strong>API Key:</strong> <code className="bg-muted px-1 rounded">{CLOUDINARY_API_KEY ? `${CLOUDINARY_API_KEY.substring(0, 6)}...` : "Not set"}</code></p>
            <p><strong>Upload Preset:</strong> <code className="bg-muted px-1 rounded">{CLOUDINARY_UPLOAD_PRESET || "Not set"}</code></p>
            <p><strong>Destination Folder:</strong> <code className="bg-muted px-1 rounded">asset/bid</code></p>
          </div>
        </AlertDescription>
      </Alert>
      
      {configStatus === "invalid" && (
        <Alert variant="destructive">
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Configuration Issue</AlertTitle>
          <AlertDescription>
            Your Cloudinary configuration appears to be incomplete. Please ensure you have set 
            CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_UPLOAD_PRESET properly.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default CloudinaryConfig;
