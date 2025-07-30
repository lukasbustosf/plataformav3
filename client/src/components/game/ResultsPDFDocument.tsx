'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts - important for consistent rendering
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v11/KAM9YZA-s2d2fA_L-4g5.ttf' }, // Regular
    { src: 'https://fonts.gstatic.com/s/helvetica/v11/KAM-YZA-s2d2fA_L-4g56A.ttf', fontWeight: 'bold' }, // Bold
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c5282',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#718096',
  },
  section: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4A5568',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryBox: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    width: '30%',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  skillList: {
    paddingLeft: 10,
  },
  skillItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  skillText: {
    color: '#4A5568',
  },
  errorItem: {
    backgroundColor: '#FFF5F5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorQuestion: {
    fontWeight: 'bold',
    color: '#C53030',
  },
  errorAnswer: {
    marginTop: 5,
    color: '#718096',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export const ResultsPDFDocument = ({ results, studentName }: { results: any, studentName: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Informe de Resultados</Text>
      <Text style={styles.subtitle}>{results.gameTitle}</Text>
      <Text style={styles.subtitle}>Estudiante: {studentName}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Rendimiento</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Puntaje Final</Text>
            <Text style={styles.summaryValue}>{results.score}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Precisión</Text>
            <Text style={styles.summaryValue}>{Math.round((results.history.filter((h: any) => h.isCorrect).length / results.history.length) * 100)}%</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Correctas</Text>
            <Text style={styles.summaryValue}>{results.history.filter((h: any) => h.isCorrect).length}/{results.history.length}</Text>
          </View>
        </View>
      </View>

      {results.history.filter((h: any) => !h.isCorrect).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Repaso</Text>
          {results.history.filter((h: any) => !h.isCorrect).map((item: any, index: number) => (
            <View key={index} style={styles.errorItem}>
              <Text style={styles.errorQuestion}>{item.question}</Text>
              <Text style={styles.errorAnswer}>Tu respuesta: {item.userAnswer}</Text>
              <Text style={styles.errorAnswer}>Respuesta correcta: {item.correctAnswer}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Análisis de Habilidades</Text>
        {(Object.entries(results.history.reduce((acc: Record<string, { correct: number; total: number }>, h: any) => {
          const skill = h.skill || 'general';
          if (!acc[skill]) acc[skill] = { correct: 0, total: 0 };
          acc[skill].total++;
          if (h.isCorrect) acc[skill].correct++;
          return acc;
        }, {} as Record<string, { correct: number; total: number }>)) as [string, { correct: number; total: number }][]).map(([skill, data], index) => (
          <View key={index} style={styles.skillItem}>
            <Text style={styles.skillText}>
              {((data.correct / data.total) * 100) >= 100 ? '✅' : '🔄'} {skill}: {data.correct} de {data.total} correctas
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }: { pageNumber: number, totalPages: number }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);
