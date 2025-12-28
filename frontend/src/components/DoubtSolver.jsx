import { useState } from "react";
import { Send, Loader2, Bot } from "lucide-react";
import { api } from "../lib/api";

export const DoubtSolver = () => {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setAnswer("");

        try {
            const { data } = await api.post("/ai/solve-doubt", { prompt: query });
            setAnswer(data.answer);
        } catch (err) {
            console.error(err);
            setError("Failed to get an answer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex items-center gap-3">
                <Bot className="text-white w-6 h-6" />
                <h3 className="font-semibold text-white">AI Doubt Solver</h3>
            </div>

            <div className="p-6">
                <form onSubmit={handleAsk} className="mb-4">
                    <label htmlFor="doubt-input" className="block text-sm font-medium text-slate-700 mb-2">
                        Ask a question about this lesson
                    </label>
                    <div className="relative">
                        <textarea
                            id="doubt-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., Explain the concept of gravity..."
                            className="w-full rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px] text-sm p-3 pr-10 resize-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {answer && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Answer</h4>
                        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {answer}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
