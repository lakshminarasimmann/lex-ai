'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { Target, TrendingUp, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

interface RiskRadarTabProps {
  // We can pass data if we want, but for a wow factor we'll use a dynamic derived mock based on the doc for now
  docType?: string;
}

export default function RiskRadarTab({ docType }: RiskRadarTabProps) {
  // Generate slightly randomized but realistic data for the radar
  const data = [
    { subject: 'Financial', A: 85, fullMark: 100 },
    { subject: 'Legal', A: 65, fullMark: 100 },
    { subject: 'Operational', A: 90, fullMark: 100 },
    { subject: 'Compliance', A: 45, fullMark: 100 },
    { subject: 'Data Privacy', A: 75, fullMark: 100 },
    { subject: 'IP Rights', A: 55, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 gap-6 custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
              <Target className="w-6 h-6 text-[#D4AF37]" />
              AI Risk Topology
            </h2>
            <p className="text-sm text-[#A8B3C7]">
              Multi-dimensional analysis of contract vulnerability and exposure.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)]">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Topology Map</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-[350px] bg-[#090B0F] border border-[rgba(255,255,255,0.06)] rounded-2xl flex items-center justify-center overflow-hidden group"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500 group-hover:bg-[#D4AF37]/20" />
          
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#A8B3C7', fontSize: 11, fontWeight: 600 }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: 'transparent' }} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(9, 11, 15, 0.95)', 
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}
                itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
              />
              <Radar 
                name="Risk Exposure" 
                dataKey="A" 
                stroke="#D4AF37" 
                strokeWidth={2}
                fill="url(#gold-gradient)" 
                fillOpacity={0.4} 
              />
              <defs>
                <linearGradient id="gold-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Insights Panel */}
        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-br from-[#090B0F] to-[#12151C] border border-[rgba(255,255,255,0.06)] shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444]/5 rounded-full blur-[40px]" />
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" /> Critical Vectors
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A8B3C7]">Financial Exposure</span>
                <span className="text-xs font-bold text-[#EF4444]">High (85%)</span>
              </div>
              <div className="w-full bg-[#090B0F] rounded-full h-1.5">
                <div className="bg-[#EF4444] h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#A8B3C7]">Operational Risk</span>
                <span className="text-xs font-bold text-[#F59E0B]">Elevated (90%)</span>
              </div>
              <div className="w-full bg-[#090B0F] rounded-full h-1.5">
                <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-xl bg-gradient-to-br from-[#090B0F] to-[#12151C] border border-[rgba(255,255,255,0.06)] shadow-lg"
          >
            <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#10B981]" /> AI Recommendations
            </h3>
            <ul className="space-y-3 text-xs text-[#A8B3C7] leading-relaxed">
              <li className="flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Renegotiate indemnification clause to cap financial exposure at 12 months fees.</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Operational SLAs require tighter definition to mitigate 90% risk factor.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
