'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImageAction } from '@/app/actions/image-upload';

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

        // Client-side validation: Max 9MB (leaving buffer for encoding overhead)
        if (file.size > 9 * 1024 * 1024) {
            alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 9MB.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            formData.append('file', file);

            // Call the imported action directly
            const result = await uploadImageAction(formData);

            if (result.success && result.url) {
                setPreview(result.url);
                // We're relying on the hidden input to pass the value to the parent form
            } else {
                console.error('Upload failed:', result.error);
                alert('Upload failed. Please try again.');
                setPreview(defaultValue || null); // Revert
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            // Alert the actual error message for debugging
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

