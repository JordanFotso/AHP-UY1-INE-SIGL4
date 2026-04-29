'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Sigma } from 'lucide-react';

interface AnalysisDetailsProps {
  criteria: string[];
  pairwiseMatrix: number[][];
}

export default function AnalysisDetails({ criteria, pairwiseMatrix }: AnalysisDetailsProps) {
  // Calcul des sommes par colonne
  const columnSums = pairwiseMatrix[0]?.map((_, j) => 
    pairwiseMatrix.reduce((sum, row) => sum + row[j], 0)
  ) || [];

  const formatValue = (value: number): string => {
    if (value === 1) return '1';
    if (value < 1) {
      const reciprocal = Math.round(1 / value);
      return `1/${reciprocal}`;
    }
    return Math.round(value).toString();
  };

  if (criteria.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          Détails Mathématiques
        </h2>
        <p className="text-muted-foreground">Décomposition des étapes de calcul de la méthode AHP.</p>
      </div>

      {/* 1. Matrice de comparaison avec sommes */}
      <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-sm font-bold">1</span>
            </div>
            <CardTitle className="text-xl">Matrice de comparaisons par paires</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 font-bold">
                <tr>
                  <th className="px-6 py-4 border-b border-border/20">Critères</th>
                  {criteria.map((c, i) => (
                    <th key={i} className="px-6 py-4 text-center border-b border-border/20">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {pairwiseMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold bg-muted/10">{criteria[i]}</td>
                    {row.map((val, j) => (
                      <td key={j} className="px-6 py-4 text-center">{formatValue(val)}</td>
                    ))}
                  </tr>
                ))}
                {/* Ligne des Sommes */}
                <tr className="bg-primary/5 font-black text-primary">
                  <td className="px-6 py-6 font-black uppercase tracking-wider flex items-center gap-2">
                    <Sigma className="h-4 w-4" />
                    Somme
                  </td>
                  {columnSums.map((sum, j) => (
                    <td key={j} className="px-6 py-6 text-center border-t-2 border-primary/20">
                      {sum.toFixed(3)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="p-6 bg-muted/20 rounded-2xl border border-dashed border-border/60">
        <p className="text-sm text-muted-foreground leading-relaxed italic text-center">
          La première étape consiste à sommer les valeurs de chaque colonne de la matrice de comparaison. 
          Ces sommes seront utilisées pour normaliser la matrice à l'étape suivante.
        </p>
      </div>
    </div>
  );
}
