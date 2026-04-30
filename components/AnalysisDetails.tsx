'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Sigma, Info, Activity, FunctionSquare, Table as TableIcon } from 'lucide-react';
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

  // 6. Données pour l'Indice Aléatoire (RI) de Saaty
  const saatyRI = [
    { n: 1, ri: 0.00 },
    { n: 2, ri: 0.00 },
    { n: 3, ri: 0.58 },
    { n: 4, ri: 0.90 },
    { n: 5, ri: 1.12 },
    { n: 6, ri: 1.24 },
    { n: 7, ri: 1.32 },
    { n: 8, ri: 1.41 },
    { n: 9, ri: 1.45 },
    { n: 10, ri: 1.49 }
  ];

  const currentRI = saatyRI.find(item => item.n === n)?.ri ?? 1.49;

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
          Détails de l'Analyse Mathématique
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Exploration rigoureuse des étapes de la méthode AHP (Analytical Hierarchy Process) de Saaty pour la détermination des poids et la validation de la cohérence.
        </p>
      </div>

      {/* 1. Matrice de comparaison avec sommes */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">1</div>
              <CardTitle className="text-xl font-bold">Matrice de Comparaison Initiale (A)</CardTitle>
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
                      Somme Colonne (Sj)
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
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 1 : Construction et Sommation</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              La matrice de comparaison réciproque est construite à partir des jugements de l'utilisateur. La sommation de chaque colonne <strong>Sj = Σ a_ij</strong> est une étape intermédiaire impérative pour l'obtention du vecteur de priorité par la méthode de normalisation.
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
              <CardTitle className="text-xl font-bold">Normalisation et Calcul du Vecteur de Priorité (W)</CardTitle>
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
                    <th className="px-6 py-4 text-center border-b border-primary/20 bg-primary/10 text-primary font-black">Poids Final (W_i)</th>
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
                      Total Normalisé
                    </td>
                    {normalizedColumnSums.map((sum, j) => (
                      <td key={j} className="px-6 py-4 text-center border-t border-border/20 font-mono text-xs">
                        {Math.round(sum)}
                      </td>
                    ))}
                    <td className="px-6 py-4 bg-primary/10 border-l border-primary/20 text-center font-bold text-primary text-xs">1.000</td>
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
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 2 : Vecteur Propre Approximatif</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              L'étape de normalisation consiste à diviser chaque élément par la somme de sa colonne (<strong>b_ij = a_ij / Sj</strong>). Le vecteur de priorité (W) est ensuite obtenu en calculant la moyenne arithmétique des lignes de la matrice normalisée. Cette méthode fournit une approximation robuste du vecteur propre principal de la matrice.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Consistency - Pondération */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600 font-bold text-sm">3</div>
              <CardTitle className="text-xl font-bold">Produit Matriciel (A × W)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    {criteria.map((c, i) => (
                      <th key={i} className="px-6 py-4 text-center border-b border-border/20 italic font-medium opacity-70">{c} (×W_j)</th>
                    ))}
                    <th className="px-6 py-4 text-center border-b border-green-600/20 bg-green-500/5 text-green-700 font-black">Somme Pondérée (A·W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {weightedMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-green-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10">{criteria[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="px-6 py-4 text-center font-mono text-[10px] opacity-60">{val.toFixed(4)}</td>
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
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 3 : Vecteur de Somme Pondérée</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pour initier le test de cohérence, on calcule le produit matriciel de la matrice originale (A) par le vecteur de poids (W). On obtient ainsi un nouveau vecteur (A·W) dont chaque composante est la somme des produits de la ligne par les poids respectifs.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Lambda_i */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 font-bold text-sm">4</div>
              <CardTitle className="text-xl font-bold">Estimation des Valeurs Propres (λi)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    <th className="px-6 py-4 text-center border-b border-border/20 font-medium opacity-70">Somme Pondérée (A·W)_i</th>
                    <th className="px-6 py-4 text-center border-b border-border/20 font-medium opacity-70">Crit. Weight (W_i)</th>
                    <th className="px-6 py-4 text-center border-b border-orange-600/20 bg-orange-500/5 text-orange-700 font-black">Lambda (λi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {criteria.map((criterion, i) => (
                    <tr key={i} className="hover:bg-orange-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10">{criterion}</td>
                      <td className="px-6 py-4 text-center font-mono text-xs opacity-60">{weightedSums[i].toFixed(4)}</td>
                      <td className="px-6 py-4 text-center font-mono text-xs opacity-60">{criteriaWeights[i].toFixed(4)}</td>
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
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 4 : Détermination des Rapports de Cohérence Individuels</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le rapport <strong>λi = (A·W)_i / W_i</strong> est calculé pour chaque critère. Si les jugements étaient parfaitement cohérents, chaque λi serait exactement égal à n (le nombre de critères). Les variations observées ici reflètent l'incohérence relative des comparaisons.
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
                <h4 className="font-bold uppercase tracking-wider text-xs">1. Valeur Propre Maximale (λmax)</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/20 flex flex-col items-center justify-center gap-4 shadow-inner">
                  <span className="text-xs text-muted-foreground font-medium italic">Formule Algébrique :</span>
                  <div className="text-2xl font-mono tracking-tighter">
                    λmax = <span className="text-primary font-black">1/n</span> · Σ <span className="text-primary font-black">λi</span>
                  </div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-blue-600/60 font-medium italic">Application Numérique :</span>
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
                <h4 className="font-bold uppercase tracking-wider text-xs">2. Indice de Cohérence (CI)</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/20 flex flex-col items-center justify-center gap-4 shadow-inner">
                  <span className="text-xs text-muted-foreground font-medium italic">Formule de Saaty :</span>
                  <div className="text-2xl font-mono tracking-tighter text-center">
                    CI = (λmax - n) / (n - 1)
                  </div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-blue-600/60 font-medium italic">Application Numérique :</span>
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
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 5 : Mesure du Degré d'Incohérence</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le <strong>λmax</strong> représente la valeur propre moyenne. L'<strong>Indice de Cohérence (CI)</strong> est un indicateur de la déviance par rapport à une cohérence parfaite. Une matrice est dite consistante si CI est proche de 0. L'écart (λmax - n) est utilisé comme mesure de l'erreur systématique dans les jugements.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Random Index (RI) */}
      <div className="space-y-4">
        <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 font-bold text-sm">6</div>
              <CardTitle className="text-xl font-bold">Indice Aléatoire de Saaty (RI)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">n (Ordre de la matrice)</th>
                    {saatyRI.map((item) => (
                      <th key={item.n} className={cn("px-4 py-4 text-center border-b border-border/20", item.n === n ? "bg-purple-600 text-white" : "")}>{item.n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  <tr>
                    <td className="px-6 py-6 font-bold bg-muted/10">RI (Indice Aléatoire)</td>
                    {saatyRI.map((item) => (
                      <td key={item.n} className={cn("px-4 py-6 text-center font-mono text-xs", item.n === n ? "bg-purple-500/10 text-purple-700 font-black border-t-2 border-purple-600" : "opacity-60")}>
                        {item.ri.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-6 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex gap-4 items-start shadow-inner">
          <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <TableIcon className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground/80 mb-1">Étape 6 : Normalisation par Aléatoire</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              L'<strong>Indice Aléatoire (RI)</strong> est la valeur CI moyenne pour une matrice de même ordre remplie de jugements aléatoires. Saaty a déterminé ces valeurs empiriquement. Pour n={n}, nous utilisons RI = <strong>{currentRI.toFixed(2)}</strong>. Ce dénominateur permet de transformer CI en un ratio relatif (CR).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
