'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface MasteryGaugeProps {
  accuracy: number;
}

const COLORS = ['#4ade80', '#f3f4f6']; // Green for correct, Gray for incorrect

export function MasteryGauge({ accuracy }: MasteryGaugeProps) {
  const data = [
    { name: 'Correctas', value: accuracy },
    { name: 'Incorrectas', value: 100 - accuracy },
  ];

  let masteryText = "En Progreso";
  if (accuracy >= 90) masteryText = "¡Dominado!";
  else if (accuracy >= 75) masteryText = "Avanzado";
  else if (accuracy >= 60) masteryText = "Logrado";

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy={-10}
              className="text-4xl font-bold text-gray-800"
            >
              {`${accuracy}%`}
            </text>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy={20}
              className="text-lg font-semibold text-gray-500"
            >
              {masteryText}
            </text>
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
