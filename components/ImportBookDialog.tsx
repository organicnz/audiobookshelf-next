'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import { Upload, FolderInput, FilePlus2, Loader2, ImagePlus } from 'lucide-react';
import { createBook } from '../app/actions';

export const ImportBookDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'scan' | 'manual'>('scan');
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Form State
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [series, setSeries] = React.useState('');
  const [cover, setCover] = React.useState('');
  const [genres, setGenres] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFolderScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 1. Detect Title from folder name
    // files[0].webkitRelativePath looks like "FolderName/FileName.ext"
    const pathParts = files[0].webkitRelativePath.split('/');
    if (pathParts.length > 0) {
        setTitle(pathParts[0]); 
    }

    // 2. Scan for metadata & images
    let foundCover = false;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simple cover detection
        if (!foundCover && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setCover(ev.target.result as string);
                }
            };
            reader.readAsDataURL(file);
            foundCover = true;
        }

        // Mock audio duration detection
        if (file.type.startsWith('audio/')) {
            setDuration((prev) => prev + 300); // add 5 mins per file
        }
    }

    // Switch to manual view to let user verify/edit
    setActiveTab('manual');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        await createBook({
            title,
            author: author || 'Unknown Author',
            description,
            cover: cover || 'https://picsum.photos/seed/new/400/600',
            series,
            duration: duration || 3600,
            genres: genres.split(',').map(g => g.trim()).filter(Boolean),
        });
        setIsOpen(false);
        // Reset form
        setTitle('');
        setAuthor('');
        setCover('');
        setDuration(0);
    } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to save book. See console.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/10 bg-white/5 text-slate-200">
            <FolderInput className="w-4 h-4" /> Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1e293b] text-slate-200 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Import Audiobook</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a book to your library by scanning a folder or entering details manually.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 my-4 bg-black/20 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('scan')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'scan' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                <FolderInput className="w-4 h-4 inline mr-2" /> Scan Folder
            </button>
            <button 
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'manual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
                <FilePlus2 className="w-4 h-4 inline mr-2" /> Manual Entry
            </button>
        </div>

        {activeTab === 'scan' ? (
            <div className="py-10 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-white/5 gap-4">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-medium text-white">Select Book Folder</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                        We'll try to extract the title, cover art, and duration from the directory.
                    </p>
                </div>
                
                <div className="relative">
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                        Choose Directory
                    </Button>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        // @ts-ignore
                        webkitdirectory="" 
                        directory="" 
                        onChange={handleFolderScan}
                    />
                </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-1/3 space-y-2">
                        <div className="aspect-[2/3] bg-black/40 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative group">
                            {cover ? (
                                <img src={cover} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImagePlus className="w-8 h-8 text-slate-600" />
                            )}
                            <input 
                                type="text" 
                                placeholder="Cover URL" 
                                value={cover}
                                onChange={e => setCover(e.target.value)}
                                className="absolute bottom-0 w-full text-xs bg-black/80 border-none p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <p className="text-[10px] text-center text-slate-500">Cover Preview</p>
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Title</label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Book Title" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Author</label>
                            <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author Name" className="bg-white/5 border-white/10 text-white" />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Series</label>
                            <Input value={series} onChange={e => setSeries(e.target.value)} placeholder="e.g. Dune #1" className="bg-white/5 border-white/10 text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400">Description</label>
                    <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)}
                        className="flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[80px]"
                        placeholder="Book synopsis..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                         <label className="text-xs font-medium text-slate-400">Genres (comma separated)</label>
                         <Input value={genres} onChange={e => setGenres(e.target.value)} placeholder="Sci-Fi, Adventure" className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="space-y-1">
                         <label className="text-xs font-medium text-slate-400">Duration (seconds)</label>
                         <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="bg-white/5 border-white/10 text-white" />
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Book
                    </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
};