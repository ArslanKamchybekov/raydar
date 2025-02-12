import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

const ImageWithZoom = ({ src, alt }: { src: string; alt: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className="group relative cursor-pointer">
        <Image 
          src={src} 
          alt={alt} 
          width={200} 
          height={200} 
          className="w-32 h-32 object-cover rounded-lg transition-opacity" 
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <Image 
        src={src} 
        alt={alt} 
        width={400} 
        height={400} 
        className="w-full h-auto object-contain rounded-lg" 
      />
    </DialogContent>
  </Dialog>
);

export default ImageWithZoom;