import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, MessageSquare, BarChart3, PieChart as PieIcon, 
  LineChart as LineIcon, Loader2, Database, CheckCircle2, 
  Table as TableIcon, Sparkles, Terminal 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart as ReLineChart, Line, 
  PieChart as RePieChart, Pie, Cell, Legend 
} from 'recharts';

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null); 
    const [headers, setHeaders] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [chartKey, setChartKey] = useState(0); 
    const [selectedChartType, setSelectedChartType] = useState(null);
    
    // NEW: States for SQL mode and View Toggling
    const [isSqlMode, setIsSqlMode] = useState(false);
    const [activeView, setActiveView] = useState('chart'); // 'chart' or 'table'

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    useEffect(() => {
        if (data) {
            setChartKey(prev => prev + 1);
            // Fallback to 'bar' if SQL query doesn't specify a chart type
            setSelectedChartType(data.chartType || 'bar');
        }
    }, [data]);

    const handleUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        const formData = new FormData();
        formData.append('file', selectedFile); 

        try {
            const response = await axios.post('http://localhost:8080/api/data/upload', formData);
            if (response.data.headers) {
                setHeaders(response.data.headers);
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Upload failed:", error.response?.data);
            alert("Upload Error: " + (error.response?.data || "Check Server"));
        }
    };

    const handleQuery = async () => {
        if (!query) return;
        setLoading(true);
        try {
            // We pass the isSqlMode flag so the backend knows whether to use Gemini or H2
            const res = await axios.post('http://localhost:8080/api/data/query', { 
                query, 
                sqlMode: isSqlMode 
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
            alert("Query Error: Check your SQL syntax or connection.");
        } finally {
            setLoading(false);
        }
    };

    const addHeaderToQuery = (header) => {
        setQuery(prev => prev + (prev ? " " : "") + header);
    };

    const renderChart = () => {
        if (!data || !data.chartData || data.chartData.length === 0) return null;
        
        const cleanedData = data.chartData.map(item => ({
            ...item,
            value: parseFloat(item.value) || 0
        }));

        if (selectedChartType === 'pie') {
            return (
                <RePieChart key={chartKey}>
                    <Pie 
                        data={cleanedData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" cy="50%" 
                        outerRadius={140}
                        innerRadius={80} 
                        paddingAngle={5}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {cleanedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Legend verticalAlign="bottom" height={36} />
                </RePieChart>
            );
        }

        if (selectedChartType === 'line') {
            return (
                <ReLineChart data={cleanedData} key={chartKey} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} />
                </ReLineChart>
            );
        }

        return (
            <BarChart data={cleanedData} key={chartKey} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={45} />
            </BarChart>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                            <Database className="text-blue-600 w-10 h-10" /> 
                            Trail <span className="text-blue-600">AI</span>
                        </h1>
                        <p className="text-slate-500 font-medium">SQL & AI Data Console</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {uploadSuccess && (
                            <div className="flex items-center gap-2 text-green-600 font-bold animate-fade-in">
                                <CheckCircle2 size={20} />
                                Data Indexed
                            </div>
                        )}
                        <label className="cursor-pointer bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-2xl hover:border-blue-500 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                            <Upload size={20} />
                            <span className="font-bold">{file ? file.name : "Upload CSV"}</span>
                            <input type="file" className="hidden" accept=".csv" onChange={handleUpload} />
                        </label>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* SIDEBAR */}
                    <aside className="lg:col-span-4 space-y-6">
                        
                        {/* MODE TOGGLE */}
                        <div className="bg-white p-2 rounded-2xl border border-slate-200 flex gap-2">
                            <button 
                                onClick={() => setIsSqlMode(false)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${!isSqlMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Sparkles size={18} /> AI Mode
                            </button>
                            <button 
                                onClick={() => setIsSqlMode(true)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${isSqlMode ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Terminal size={18} /> SQL Mode
                            </button>
                        </div>

                        {headers.length > 0 && (
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Table: data</h3>
                                <div className="flex flex-wrap gap-2">
                                    {headers.map((header, index) => (
                                        <button 
                                            key={index} 
                                            onClick={() => addHeaderToQuery(header)}
                                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            {header}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold mb-5 flex items-center gap-3 text-slate-800">
                                {isSqlMode ? <Terminal size={24} className="text-slate-900" /> : <MessageSquare size={24} className="text-blue-500" />} 
                                {isSqlMode ? "Query Console" : "Analyst Chat"}
                            </h2>
                            <textarea
                                className={`w-full border-2 rounded-2xl p-5 h-40 resize-none outline-none transition-all font-mono text-sm ${isSqlMode ? 'bg-slate-900 text-green-400 border-slate-800 focus:border-green-500' : 'bg-slate-50 text-slate-700 border-slate-50 focus:border-blue-400'}`}
                                placeholder={isSqlMode ? "SELECT category, SUM(value) FROM data GROUP BY category..." : "Show me the distribution of..."}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button 
                                onClick={handleQuery} 
                                disabled={loading || !file} 
                                className={`w-full mt-5 py-4 rounded-2xl font-black flex justify-center items-center gap-3 transition-all disabled:opacity-50 ${isSqlMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Execute Query"}
                            </button>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 min-h-[600px] flex flex-col relative overflow-hidden">
                        
                        {/* VIEW TABS */}
                        <div className="flex justify-between items-center mb-10 border-b border-slate-100">
                            <div className="flex gap-8">
                                <button 
                                    onClick={() => setActiveView('chart')}
                                    className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all ${activeView === 'chart' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400'}`}
                                >
                                    <BarChart3 size={20} /> Visualization
                                </button>
                                <button 
                                    onClick={() => setActiveView('table')}
                                    className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all ${activeView === 'table' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400'}`}
                                >
                                    <TableIcon size={20} /> Raw Data
                                </button>
                            </div>

                            {data && activeView === 'chart' && (
                                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-4">
                                    <button onClick={() => setSelectedChartType('bar')} className={`p-2 rounded-lg transition-all ${selectedChartType === 'bar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><BarChart3 size={18} /></button>
                                    <button onClick={() => setSelectedChartType('pie')} className={`p-2 rounded-lg transition-all ${selectedChartType === 'pie' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><PieIcon size={18} /></button>
                                    <button onClick={() => setSelectedChartType('line')} className={`p-2 rounded-lg transition-all ${selectedChartType === 'line' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><LineIcon size={18} /></button>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-grow flex flex-col items-center justify-center">
                            {data ? (
                                activeView === 'chart' ? (
                                    <div className="h-[450px] w-full animate-fade-in">
                                        <ResponsiveContainer width="100%" height="100%">
                                            {renderChart()}
                                        </ResponsiveContainer>
                                        {data.summary && (
                                            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 text-sm font-medium">
                                                <strong>Insight:</strong> {data.summary}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full overflow-auto max-h-[500px] border border-slate-100 rounded-2xl shadow-inner animate-fade-in">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 sticky top-0">
                                                <tr>
                                                    {Object.keys(data.chartData[0] || {}).map(key => (
                                                        <th key={key} className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">{key}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.chartData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                        {Object.values(row).map((val, j) => (
                                                            <td key={j} className="p-4 text-sm text-slate-600 border-b border-slate-50">{val}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            ) : (
                                <div className="text-center space-y-4">
                                    <Database size={64} className="text-slate-100 mx-auto" />
                                    <p className="text-slate-400 font-medium text-lg">Upload data and run a query to begin</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;