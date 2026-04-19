import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { History as HistoryIcon, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/history');
        setHistory(res.data);
      } catch (err) {
        setError('Failed to fetch analysis history. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 max-w-5xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 border-b border-zinc-200 pb-8"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-zinc-900">
          <HistoryIcon className="text-zinc-400 w-8 h-8" />
          Analysis History
        </h1>
        <p className="text-zinc-500 text-base">Review past analyses and monitor misinformation trends.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white border border-zinc-200 rounded-2xl subtle-shadow">
          <Loader2 className="animate-spin text-zinc-400 w-8 h-8" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl font-medium text-center">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white border border-zinc-200 p-16 rounded-2xl text-center subtle-shadow">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
            <HistoryIcon className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold mb-3 text-zinc-900">No history found</h2>
          <p className="text-zinc-500 mb-8">You haven't analyzed any articles yet. Start by submitting your first article.</p>
          <Link to="/analyze" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Start Analyzing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item, index) => (
            <motion.div
              key={item.article_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover-shadow transition-shadow relative overflow-hidden"
            >
              {/* Subtle status indicator bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                item.ml_label === 'Credible' ? 'bg-emerald-500' :
                item.ml_label === 'Suspicious' ? 'bg-amber-500' :
                'bg-red-500'
              }`} />

              <div className="flex-1 pl-3">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                    item.ml_label === 'Credible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.ml_label === 'Suspicious' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {item.ml_label}
                  </span>
                  <span className="text-zinc-500 text-xs font-medium">
                    {new Date(item.created_at).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  {item.source_url && item.source_url !== 'User Input' && item.source_url !== 'Upload File' && (
                    <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 px-2.5 py-1 rounded-md text-xs truncate max-w-[200px] border border-zinc-200 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      {item.source_url}
                    </a>
                  )}
                </div>
                <p className="text-zinc-600 leading-relaxed text-sm line-clamp-2 pr-4">
                  "{item.content}"
                </p>
              </div>
              
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 shrink-0 w-full md:w-auto border-t border-zinc-100 md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-zinc-900">{(item.confidence * 100).toFixed(1)}<span className="text-sm text-zinc-500">%</span></p>
                </div>
                
                <Link
                  to="/results"
                  state={{ 
                    result: { 
                      ml_prediction: { 
                        label: item.ml_label, 
                        confidence_percentage: item.confidence * 100,
                        probability: item.confidence,
                        important_keywords: ["historical", "data", "retrieved"],
                        model_used: "Logistic Regression"
                      },
                      agent_report: item.report
                    }
                  }}
                  className="flex items-center gap-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  View Report <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}