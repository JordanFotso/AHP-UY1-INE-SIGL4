'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Sigma, Info, Activity, FunctionSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisDetailsProps {
  criteria: string[];
  pairwiseMatrix: number[][];
}

export default function AnalysisDetails({ criteria, pairwiseMatrix }: AnalysisDetailsProps) {
  const n = criteria.length;

  // 1. Calcul des sommes par colonne (Matrice originale)
  const columnSums = pairwiseMatrix[0]?.map((_, j) => 
    pairwiseMatrix.reduce((sum, row) => sum + row[j], 0)
  ) || [];

  // 2. Calcul de la matrice normalisée et des poids (Criteria Weights)
  const normalizedMatrix = pairwiseMatrix.map((row) => 
    row.map((val, j) => columnSums[j] > 0 ? val / columnSums[j] : 0)
  );

  const criteriaWeights = normalizedMatrix.map(row => 
    row.reduce((sum, val) => sum + val, 0) / (n || 1)
  );

  const normalizedColumnSums = normalizedMatrix[0]?.map((_, j) => 
    normalizedMatrix.reduce((sum, row) => sum + row[j], 0)
  ) || [];

  // 3. Calcul de la cohérence (Matrice Originale x Poids)
  const weightedMatrix = pairwiseMatrix.map((row, i) => 
    row.map((val, j) => val * criteriaWeights[j])
  );

  const weightedSums = weightedMatrix.map(row => 
    row.reduce((sum, val) => sum + val, 0)
  );

  // 4. Calcul des Lambda_i
  const lambdas = weightedSums.map((ws, i) => 
    criteriaWeights[i] > 0 ? ws / criteriaWeights[i] : 0
  );

  // 5. Calcul de lambda_max et CI
  const lambdaMax = lambdas.length > 0 
    ? lambdas.reduce((sum, val) => sum + val, 0) / n 
    : 0;
  
  const ci = n > 1 ? (lambdaMax - n) / (n - 1) : 0;

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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          Détails Mathématiques
        </h2>
        <p className="text-muted-foreground">Décomposition pédagogique des étapes de calcul de la méthode AHP.</p>
      </div>

      {/* 1. Matrice de comparaison avec sommes */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">1</div>
              <CardTitle className="text-xl font-bold">Matrice de comparaisons par paires</CardTitle>
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
                  <tr className="bg-primary/5 font-black text-primary">
                    <td className="px-6 py-6 font-black uppercase tracking-wider flex items-center gap-2">
                      <Sigma className="h-4 w-4" />
                      Somme
                    </td>
                    {columnSums.map((sum, j) => (
                      <td key={j} className="px-6 py-6 text-center border-t-2 border-primary/20 font-mono">
                        {sum.toFixed(3)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-6 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex gap-4 items-start shadow-inner">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 1 : Sommation des colonnes</h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              La première étape du processus AHP consiste à construire la matrice de comparaison basée sur l'échelle de Saaty. 
              On calcule ensuite la <strong>somme de chaque colonne</strong>. Ces totaux serviront de dénominateurs pour l'étape de normalisation suivante.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Matrice normalisée et calcul des poids */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 font-bold text-sm">2</div>
              <CardTitle className="text-xl font-bold">Matrice Normalisée & Vecteur Propre (Poids)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    {criteria.map((c, i) => (
                      <th key={i} className="px-6 py-4 text-center border-b border-border/20 font-medium opacity-70">{c}</th>
                    ))}
                    <th className="px-6 py-4 text-center border-b border-primary/20 bg-primary/10 text-primary font-black">Criteria Weight (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {normalizedMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10">{criteria[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="px-6 py-4 text-center font-mono text-xs opacity-60">{val.toFixed(3)}</td>
                      ))}
                      <td className="px-6 py-4 text-center font-black bg-primary/5 text-primary border-l border-primary/10 text-sm whitespace-nowrap">
                        {criteriaWeights[i].toFixed(4)} <span className="text-[10px] opacity-70 font-medium ml-1">({(criteriaWeights[i] * 100).toFixed(2)}%)</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/5 text-muted-foreground">
                    <td className="px-6 py-4 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                      <Sigma className="h-3 w-3" />
                      Somme
                    </td>
                    {normalizedColumnSums.map((sum, j) => (
                      <td key={j} className="px-6 py-4 text-center border-t border-border/20 font-mono text-xs">
                        {Math.round(sum)}
                      </td>
                    ))}
                    <td className="px-6 py-4 bg-primary/10 border-l border-primary/20 text-center font-bold text-primary text-xs">
                      1.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-6 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex gap-4 items-start shadow-inner">
          <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 2 : Normalisation et Moyenne</h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Chaque cellule de la matrice originale est divisée par la somme de sa colonne (normalisation). 
              Le <strong>Criteria Weight (W)</strong> est ensuite calculé en faisant la moyenne arithmétique de chaque ligne de cette matrice normalisée. 
              La somme totale des poids doit être égale à 100% (ou 1).
            </p>
          </div>
        </div>
      </div>

      {/* 3. Consistency - Matrice Originale x Poids */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600 font-bold text-sm">3</div>
              <CardTitle className="text-xl font-bold">Vérification de la Cohérence (Pondération)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    {criteria.map((c, i) => (
                      <th key={i} className="px-6 py-4 text-center border-b border-border/20 italic font-medium opacity-70">{c} (×W)</th>
                    ))}
                    <th className="px-6 py-4 text-center border-b border-green-600/20 bg-green-500/5 text-green-700 font-black">Somme Pondérée (A×W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {weightedMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-green-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10">{criteria[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="px-6 py-4 text-center font-mono text-[10px] opacity-60">
                          {val.toFixed(4)}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-center font-black bg-green-500/10 text-green-700 border-l border-green-500/10 text-base">
                        {weightedSums[i].toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-6 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex gap-4 items-start shadow-inner">
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 3 : Produit Matriciel</h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Pour vérifier la cohérence, on multiplie la matrice de comparaison originale (Étape 1) par le vecteur des poids (Étape 2). 
              Le résultat de cette multiplication ligne par ligne nous donne la <strong>Somme Pondérée</strong>. 
              Ce vecteur est l'élément clé pour déterminer le ratio de cohérence (CR).
            </p>
          </div>
        </div>
      </div>

      {/* 4. Lambda_i Calculation */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 font-bold text-sm">4</div>
              <CardTitle className="text-xl font-bold">Calcul des Valeurs Propres Individuelles (λi)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    <th className="px-6 py-4 text-center border-b border-border/20 font-medium opacity-70">Somme Pondérée (A×W)</th>
                    <th className="px-6 py-4 text-center border-b border-border/20 font-medium opacity-70">Criteria Weight (W)</th>
                    <th className="px-6 py-4 text-center border-b border-orange-600/20 bg-orange-500/5 text-orange-700 font-black">Lambda (λi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {criteria.map((criterion, i) => (
                    <tr key={i} className="hover:bg-orange-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10">{criterion}</td>
                      <td className="px-6 py-4 text-center font-mono text-xs opacity-60">
                        {weightedSums[i].toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-xs opacity-60">
                        {criteriaWeights[i].toFixed(4)}
                      </td>
                      <td className="px-6 py-4 text-center font-black bg-orange-500/10 text-orange-700 border-l border-orange-500/10 text-lg">
                        {lambdas[i].toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-6 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex gap-4 items-start shadow-inner">
          <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <Activity className="h-4 w-4 text-orange-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 4 : Calcul de λi</h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              On calcule la valeur <strong>λi</strong> (Lambda i) pour chaque critère en divisant sa <strong>Somme Pondérée</strong> par son <strong>Poids (Weight)</strong>. 
              La moyenne de ces valeurs λi nous donnera λmax.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Lambda Max & CI Formulas */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 font-bold text-sm">5</div>
              <CardTitle className="text-xl font-bold">Calcul de λmax et CI (Indice de Cohérence)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {/* Lambda Max Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FunctionSquare className="h-5 w-5" />
                <h4 className="font-bold uppercase tracking-wider text-xs">Calcul du Lambda Max (λmax)</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/20 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-muted-foreground font-medium italic">Formule :</span>
                  <div className="text-2xl font-mono tracking-tighter">
                    λmax = <span className="text-primary font-black">1/n</span> * Σ <span className="text-primary font-black">λi</span>
                  </div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-blue-600/60 font-medium italic">Expression :</span>
                  <div className="text-sm font-mono text-center leading-relaxed">
                    ({lambdas.map(l => l.toFixed(4)).join(' + ')}) / {n}
                    <br />
                    <span className="text-2xl font-black text-blue-700 mt-2 block">
                      = {lambdaMax.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CI Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FunctionSquare className="h-5 w-5" />
                <h4 className="font-bold uppercase tracking-wider text-xs">Calcul de l'Indice de Cohérence (CI)</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/20 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-muted-foreground font-medium italic">Formule :</span>
                  <div className="text-2xl font-mono tracking-tighter text-center">
                    CI = (λmax - n) / (n - 1)
                  </div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-blue-600/60 font-medium italic">Expression :</span>
                  <div className="text-sm font-mono text-center leading-relaxed">
                    ({lambdaMax.toFixed(4)} - {n}) / ({n} - 1)
                    <br />
                    <span className="text-2xl font-black text-blue-700 mt-2 block">
                      = {ci.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="p-6 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex gap-4 items-start shadow-inner">
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 5 : Synthèse des indices</h4>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Le <strong>λmax</strong> est la moyenne des valeurs λi calculées précédemment. L'<strong>Indice de Cohérence (CI)</strong> mesure l'écart à la cohérence parfaite (qui serait CI = 0). 
              Plus le λmax est proche de n, plus les jugements sont cohérents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
