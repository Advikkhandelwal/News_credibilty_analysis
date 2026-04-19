import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Link as LinkIcon, UploadCloud, Loader2, Search } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://news-credibilty-analysis.onrender.com';

export default function Analyze() {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (activeTab === 'text') {
        if (!text.trim()) throw new Error('Please enter some text to analyze.');
        response = await axios.post(`${API_BASE_URL}/analyze-text`, { text });
      } else if (activeTab === 'url') {
        if (!url.trim()) throw new Error('Please enter a valid URL.');
        response = await axios.post(`${API_BASE_URL}/analyze-url`, { url });
      } else {
        if (!file) throw new Error('Please upload a .txt file.');
        const formData = new FormData();
        formData.append('file', file);
        response = await axios.post(`${API_BASE_URL}/upload-file`, formData);
      }
      
      navigate('/results', { state: { result: response.data } });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'text/plain': ['.txt']} });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-16 max-w-3xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-zinc-200 rounded-2xl p-8 md:p-12 subtle-shadow"
      >
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-50 border border-zinc-200 mb-6">
            <Search className="w-6 h-6 text-zinc-900" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-zinc-900 tracking-tight">Analyze News Credibility</h1>
          <p className="text-zinc-500">Choose your input method below to begin the verification process.</p>
        </div>

        <div className="flex gap-2 p-1 bg-zinc-50 rounded-lg mb-8 border border-zinc-200">
          <TabButton active={activeTab === 'text'} onClick={() => setActiveTab('text')} icon={<FileText size={16} />} label="Paste Text" />
          <TabButton active={activeTab === 'url'} onClick={() => setActiveTab('url')} icon={<LinkIcon size={16} />} label="Enter URL" />
          <TabButton active={activeTab === 'file'} onClick={() => setActiveTab('file')} icon={<UploadCloud size={16} />} label="Upload File" />
        </div>

        <div className="min-h-[220px] mb-8">
          {activeTab === 'text' && (
            <motion.textarea
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-64 bg-white border border-zinc-300 rounded-xl p-5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 resize-none transition-all text-base"
              placeholder="Paste the full article content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          {activeTab === 'url' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 flex items-center">
              <input
                type="url"
                className="w-full bg-white border border-zinc-300 rounded-xl p-5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all text-base"
                placeholder="https://example.com/news-article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </motion.div>
          )}

          {activeTab === 'file' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64">
              <div
                {...getRootProps()}
                className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  isDragActive ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className={`p-3 rounded-full mb-3 ${isDragActive ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-100 text-zinc-500'}`}>
                  <UploadCloud className="w-6 h-6" />
                </div>
                {file ? (
                  <div className="text-center">
                    <p className="text-zinc-900 font-medium mb-1">{file.name}</p>
                    <p className="text-zinc-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="text-center px-4">
                    <p className="text-zinc-700 font-medium mb-1">Drag & drop your .txt file here</p>
                    <p className="text-zinc-500 text-sm">or click to browse your computer</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
            <div className="text-red-700 bg-red-50 p-4 rounded-lg border border-red-200 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </div>
          </motion.div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-medium py-4 rounded-xl flex justify-center items-center gap-3 transition-colors text-base"
        >
          {loading ? (
            <><Loader2 className="animate-spin w-5 h-5" /> Processing Analysis...</>
          ) : (
            'Analyze Credibility'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
        active 
          ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50' 
          : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100/50 border border-transparent'
      }`}
    >
      {icon} {label}
    </button>
  );
}