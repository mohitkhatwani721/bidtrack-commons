
interface ImageUrlDisplayProps {
  imageUrl: string | undefined;
}

const ImageUrlDisplay = ({ imageUrl }: ImageUrlDisplayProps) => {
  if (!imageUrl) return null;
  
  return (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono truncate">
      <p className="text-slate-500 mb-1">Current image URL:</p>
      <p className="overflow-x-auto whitespace-nowrap">{imageUrl}</p>
    </div>
  );
};

export default ImageUrlDisplay;
