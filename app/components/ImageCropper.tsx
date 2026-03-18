import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { 
  Loader2, 
  Check, 
  X, 
  Crop as CropIcon, 
  Facebook, 
  Instagram, 
  Twitter, 
  Smartphone, 
  LayoutGrid 
} from "lucide-react";

// Helper to create the cropped image
const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, "image/jpeg");
  });
}

type Platform = 'all' | 'facebook' | 'instagram' | 'twitter' | 'tiktok';

const PRESETS: { label: string; aspect: number | undefined; platforms: Platform[] }[] = [
  { label: "Free", aspect: undefined, platforms: ['all', 'facebook', 'instagram', 'twitter', 'tiktok'] },
  { label: "1:1 (Square)", aspect: 1, platforms: ['all', 'facebook', 'instagram', 'twitter'] },
  { label: "4:5 (Portrait)", aspect: 4 / 5, platforms: ['all', 'facebook', 'instagram'] },
  { label: "16:9 (Landscape)", aspect: 16 / 9, platforms: ['all', 'facebook', 'instagram', 'twitter'] },
  { label: "9:16 (Story)", aspect: 9 / 16, platforms: ['all', 'facebook', 'instagram', 'tiktok'] },
  { label: "2:1 (Header/Card)", aspect: 2 / 1, platforms: ['facebook', 'twitter'] },
  { label: "3:2 (FB Album)", aspect: 3 / 2, platforms: ['facebook'] },
  { label: "1.91:1 (Link)", aspect: 1.91, platforms: ['facebook', 'twitter'] },
  { label: "7:8 (Twitter)", aspect: 7 / 8, platforms: ['twitter'] },
];

interface ImageCropperProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

export function ImageCropper({ imageSrc, isOpen, onClose, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(4 / 3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [platform, setPlatform] = useState<Platform>('all');

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setProcessing(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  const filteredPresets = PRESETS.filter(p => p.platforms.includes(platform) || p.platforms.includes('all'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CropIcon className="w-5 h-5" /> ปรับขนาดรูปภาพ
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-slate-900 min-h-[300px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white space-y-6">
          {/* Platform Selector */}
          <div className="flex gap-2 pb-2 overflow-x-auto">
            {[
              { id: 'all', icon: LayoutGrid, label: 'All' },
              { id: 'facebook', icon: Facebook, label: 'FB' },
              { id: 'instagram', icon: Instagram, label: 'IG' },
              { id: 'twitter', icon: Twitter, label: 'X' },
              { id: 'tiktok', icon: Smartphone, label: 'TikTok' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id as Platform)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition whitespace-nowrap ${
                  platform === p.id 
                    ? "bg-slate-800 text-white border-slate-800" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <p.icon className="w-3 h-3" />
                {p.label}
              </button>
            ))}
          </div>

          {/* Aspect Ratio Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredPresets.map((preset) => (
               <button
                key={preset.label}
                onClick={() => setAspect(preset.aspect)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition border ${
                  aspect === preset.aspect 
                    ? "bg-primary-50 text-primary-700 border-primary-200 ring-1 ring-primary-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8">
             {/* Zoom Control */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
            {/* Rotation Control */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">Rotation</label>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={processing}
              className="flex-1 py-3 px-4 rounded-xl bg-primary-600 font-semibold text-white hover:bg-primary-700 transition shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
            >
              {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              บันทึกรูปภาพ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
