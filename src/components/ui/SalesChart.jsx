import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'

// Chart data should be passed via props; default to empty array (no dummy data)

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  const value = payload[0].value
  return (
    <div className="bg-transparent p-0">
      <div className="rounded-t-md px-3 py-1 text-white font-medium" style={{ background: '#0F766E' }}>
        {label}
      </div>
      <div className="bg-white rounded-b-md px-3 py-2 shadow-md flex items-center gap-2">
        <div className="text-base text-[#0F766E] font-semibold">${value.toLocaleString()}</div>
      </div>
    </div>
  )
}

export default function SalesChart({ className = '', data = [] }) {
  const [period, setPeriod] = useState('this-year')

  // Use provided data or empty array
  const chartData = data || []

  return (
    <div className={`w-full bg-white rounded-lg shadow-sm p-4 ${className} mb-4 md:mb-6`}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h3 className="text-lg font-medium text-[#191B1C]">Sales Performance</h3>
        </div>

        <div className="relative inline-flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="block pl-3 pr-8 py-1 bg-white border border-gray-200 rounded-md shadow-sm text-base text-[#464646] appearance-none"
            aria-label="Select period"
          >
            <option value="this-year">This year</option>
            <option value="last-year">Last year</option>
            <option value="last-12">Last 12 months</option>
          </select>

          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden />
        </div>
      </div>

      <div className="w-full h-64 md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#179B91" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#179B91" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0F766E', strokeWidth: 1, strokeDasharray: '4 4' }} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#0F766E"
              strokeWidth={2}
              fill="url(#colorUv)"
              activeDot={{ r: 4, stroke: '#0F766E', strokeWidth: 2, fill: '#fff' }}
            />

            <ReferenceLine x="Jun" stroke="#D1FAE5" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
