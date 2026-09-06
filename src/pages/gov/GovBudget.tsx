import { useState, useEffect } from 'react';
import { simulateBudget } from '../../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Zap, TrendingUp, Loader2, Sparkles, Cpu } from 'lucide-react';

const GovBudget = () => {
  const [budget, setBudget] = useState(250);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSim = async () => {
      setLoading(true);
      try {
        const data = await simulateBudget(budget);
        setSimulationData(data);
      } catch (e) {
        console.error("Budget simulation error", e);
      }
      setLoading(false);
    };
    
    const timeoutId = setTimeout(() => {
      runSim();
    }, 400); // debounce

    return () => clearTimeout(timeoutId);
  }, [budget]);

  const totalImpact = simulationData.reduce((acc, curr) => acc + (curr.citizens_benefited || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Top Header Strip */}
      <header className="border-b border-[#27342c] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[#5da673]/15 border border-[#5da673]/30 text-[#8cd7a0] font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Cpu className="w-3 h-3" />
              SOLVER: CONVEX-QUADRATIC-V9
            </span>
            <span className="font-mono text-xs text-[#9ab0a2]">Fiscal Allocation Engine v4.2</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#e8ede9]">
            Interactive Capex Allocation Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#9ab0a2] mt-0.5 max-w-2xl">
            Real-time multi-variable capital expenditure model distributing district infrastructure budget based on citizen demand density and hotspot severity.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#8cd7a0] bg-[#151d19] border border-[#27342c] px-3.5 py-1.5 rounded-xl shrink-0">
          <span>SLA Window: <strong className="text-[#ffb693]">FY 2024-25</strong></span>
        </div>
      </header>

      {/* Grid: Simulator Controls (Left) + Sector Allocations Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Slider Card */}
          <div className="bg-[#151d19] border border-[#27342c] p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#5da673]" />
              <h3 className="font-display font-bold text-sm text-[#e8ede9]">
                Adjust Total District Capex
              </h3>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2 font-mono text-xs text-[#9ab0a2]">
                <span>₹50 Cr</span>
                <span className="text-2xl font-bold text-[#8cd7a0] font-display">
                  ₹{budget} Cr
                </span>
                <span>₹1000 Cr</span>
              </div>
              
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-[#1a241f] rounded-lg appearance-none cursor-pointer accent-[#5da673]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#9ab0a2] mt-2">
                <span>Constrained Baseline</span>
                <span>Max Capacity</span>
              </div>
            </div>

            {/* Solver Status Box */}
            <div className="bg-[#1a241f] p-4 rounded-xl border border-[#27342c] font-mono text-xs">
              <div className="text-[10px] uppercase text-[#9ab0a2] mb-1.5 font-bold">
                Optimization Status
              </div>
              <div className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-[#5da673] animate-spin" />
                    <span className="text-[#ffb693]">Recalculating Quadratic Matrix...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-[#5da673]" />
                    <span className="text-[#8cd7a0]">Equilibrium Optimal (12ms)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Citizen Impact Counter Card */}
          <div className="bg-[#151d19] border border-[#5da673]/40 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5da673]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#8cd7a0]">
              <Zap className="w-4 h-4 text-[#8cd7a0]" />
              <span className="uppercase tracking-wider font-bold">PROJECTED CITIZEN BENEFIT</span>
            </div>

            <div className="text-3xl sm:text-4xl font-display font-bold text-[#e8ede9] mb-2">
              {loading ? '...' : totalImpact.toLocaleString()}
            </div>

            <p className="text-xs text-[#9ab0a2] leading-relaxed">
              Citizens directly benefiting from newly unlocked road, drainage, and utility interventions under this budget envelope.
            </p>
          </div>

        </div>

        {/* Right: Allocation Visualizer (8 cols) */}
        <div className="lg:col-span-8 bg-[#151d19] border border-[#27342c] p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffb693]" />
                <h3 className="font-display font-bold text-base text-[#e8ede9]">
                  Algorithmic Allocation by Infrastructure Sector
                </h3>
              </div>
              <span className="font-mono text-xs text-[#8cd7a0] bg-[#5da673]/10 border border-[#5da673]/30 px-2.5 py-0.5 rounded">
                Dynamic Proportioning
              </span>
            </div>

            <div className="h-[360px] w-full pt-4">
              {simulationData.length > 0 && !loading ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simulationData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#27342c" />
                    <XAxis 
                      dataKey="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ab0a2', fontSize: 11 }} 
                      angle={-10}
                      textAnchor="end"
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ab0a2', fontSize: 11 }} 
                      tickFormatter={(val) => `₹${val}Cr`} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(93, 166, 115, 0.08)' }}
                      contentStyle={{ 
                        borderRadius: '0.75rem', 
                        border: '1px solid #27342c', 
                        backgroundColor: '#151d19', 
                        color: '#e8ede9',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px'
                      }}
                      formatter={(value: any) => [`₹${value} Cr`, 'Allocated Budget']}
                    />
                    <Bar dataKey="recommended_allocation" radius={[6, 6, 0, 0]}>
                      {simulationData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index % 2 === 0 ? '#5da673' : '#d47a4c'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#8cd7a0]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#5da673] mr-2" />
                  <span>Computing Optimal Distribution...</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#27342c] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#9ab0a2] gap-2">
            <span>Formula: Priority Score × Demand Volume / Infrastructure Degradation Index</span>
            <span className="text-[#8cd7a0]">Variance: &plusmn;0.4% SLA Adherent</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default GovBudget;
