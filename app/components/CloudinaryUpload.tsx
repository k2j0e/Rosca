'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { getCloudinarySignature } from '@/app/actions/image-upload';

interface ImageUploadProps {
    name: string;
    label?: string;
    defaultValue?: string | null;
    shape?: 'square' | 'circle' | 'wide';
    className?: string;
}

export default function CloudinaryUpload({
    name,
    label,
    defaultValue,
    shape = 'square',
    className = ''
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Shape styles
    const shapeClasses = {
        square: 'aspect-square rounded-2xl',
        circle: 'aspect-square rounded-full',
        wide: 'aspect-[2/1] rounded-2xl'
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation: Max 95MB (Cloudinary free tier is generous, but let's be safe)
        if (file.size > 95 * 1024 * 1024) {
            alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 95MB.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsUploading(true);

        try {
            // 1. Get Signature from Server
            const signatureResult = await getCloudinarySignature();

            if ('error' in signatureResult && signatureResult.error) {
                throw new Error(signatureResult.error as string);
            }

            const { timestamp, folder, signature, cloudName, apiKey } = signatureResult as any;

            // 2. Prepare FormData for Direct Upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey || '');
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', folder);

            // 3. Upload Directly to Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await response.json();

            // 4. Success
            if (data.secure_url) {
                setPreview(data.secure_url);
            } else {
                throw new Error("No URL returned from Cloudinary");
            }

        } catch (error: any) {
            console.error('Upload error:', error);
            alert(`Upload failed: ${error.message || 'Unknown error'}`);
            setPreview(defaultValue || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={`relative group ${className}`}>
            {label && <label className="text-sm font-bold uppercase tracking-wide text-text-sub block mb-2">{label}</label>}

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 
                    hover:border-primary dark:hover:border-primary transition-colors cursor-pointer flex items-center justify-center
                    ${shapeClasses[shape]}
                `}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Upload preview"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Change</span>
                        </div>
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 bg-white/90 text-slate-900 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">add_photo_alternate</span>
                        <p className="text-xs text-slate-500 font-medium">Click to upload</p>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Hidden inputs for form submission */}
            <input
                type="hidden"
                name={name}
                value={preview || ''}
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}

