'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Text } from 'recharts';

interface BloomRadarChartProps {
  skillsData: {
    skill: string;
    accuracy: number;
  }[];
}

// Custom Tooltip for better visual feedback
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{`${label}`}</p>
        <p className="text-sm text-indigo-600">{`Dominio: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

// Custom Axis Tick to prevent long labels from overlapping
const CustomAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <Text
      x={x}
      y={y}
      width={80} // Max width for the label
      textAnchor="middle"
      verticalAnchor="middle"
      fontSize={13}
      fill="#4A5568" // A softer, more readable gray
    >
      {payload.value}
    </Text>
  );
};


export function BloomRadarChart({ skillsData }: BloomRadarChartProps) {
  // Ensure all 6 levels of Bloom's taxonomy are present, even if accuracy is 0
  const bloomLevels = ['Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'];
  const formattedData = bloomLevels.map(level => {
    const skill = skillsData.find(s => s.skill === level);
    return {
      subject: level,
      accuracy: skill ? skill.accuracy : 0,
      fullMark: 100,
    };
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="subject" tick={<CustomAxisTick />} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 10, fill: '#718096' }}
            axisLine={false}
          />
          <Radar 
            name="Dominio" 
            dataKey="accuracy" 
            stroke="#4F46E5" // A strong indigo color
            fill="#6366F1"   // A slightly lighter indigo for the fill
            fillOpacity={0.7}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
