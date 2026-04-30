'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Sigma, Info, Activity, FunctionSquare, Table as TableIcon, CheckCircle2, AlertCircle } from 'lucide-react';
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

  // 7. Calcul du Ratio de Cohérence (CR)
  const cr = currentRI > 0 ? ci / currentRI : 0;
  const isConsistent = cr < 0.1;

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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
          <Calculator className="h-9 w-9 text-primary" />
          Analyse Mathématique
        </h2>
        <p className="text-muted-foreground text-base">
          Exploration rigoureuse des étapes de la méthode AHP (Analytical Hierarchy Process) de Saaty.
        </p>
      </div>

      {/* 1. Matrice de Comparaison Initiale */}
      <div className="space-y-3">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">1</div>
              <CardTitle className="text-xl font-bold">Matrice de Comparaison Initiale (A)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="text-sm uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    {criteria.map((c, i) => (
                      <th key={i} className="px-6 py-4 text-center border-b border-border/20">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-lg">
                  {pairwiseMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10 text-base">{criteria[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="px-6 py-4 text-center font-medium">{formatValue(val)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-primary/5 font-black text-primary">
                    <td className="px-6 py-6 font-black uppercase text-xs tracking-wider flex items-center gap-2">
                      <Sigma className="h-4 w-4" /> Somme Colonne (Sj)
                    </td>
                    {columnSums.map((sum, j) => (
                      <td key={j} className="px-6 py-6 text-center border-t-2 border-primary/20 font-mono text-xl">
                        {sum.toFixed(3)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-4 bg-muted/5 rounded-xl border border-dashed border-border/40 flex gap-3 items-start shadow-inner">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-foreground/80">Étape 1 : Construction et Sommation</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              La matrice est construite sur les jugements réciproques. La sommation <strong>Sj = Σ a_ij</strong> est impérative pour la normalisation.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Normalisation et Poids */}
      <div className="space-y-3">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">2</div>
              <CardTitle className="text-xl font-bold">Vecteur de Priorité (W)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="text-sm uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    {criteria.map((c, i) => (
                      <th key={i} className="px-6 py-4 text-center border-b border-border/20 font-medium opacity-50">{c}</th>
                    ))}
                    <th className="px-6 py-4 text-center border-b border-primary/20 bg-primary/10 text-primary font-black">Poids Final (W_i)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-lg">
                  {normalizedMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10 text-base">{criteria[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="px-6 py-4 text-center font-mono text-sm opacity-50">{val.toFixed(3)}</td>
                      ))}
                      <td className="px-6 py-4 text-center font-black bg-primary/5 text-primary border-l border-primary/10 text-2xl whitespace-nowrap">
                        {criteriaWeights[i].toFixed(4)} <span className="text-xs opacity-60 ml-1">({(criteriaWeights[i] * 100).toFixed(2)}%)</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/5 text-muted-foreground text-xs uppercase font-bold">
                    <td className="px-6 py-4">Total Normalisé</td>
                    {normalizedColumnSums.map((_, j) => (
                      <td key={j} className="px-6 py-4 text-center font-mono">1.000</td>
                    ))}
                    <td className="px-6 py-4 bg-primary/10 text-primary text-center text-sm font-black">1.000 (100%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-4 bg-muted/5 rounded-xl border border-dashed border-border/40 flex gap-3 items-start shadow-inner">
          <Info className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-foreground/80">Étape 2 : Normalisation et Moyenne</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>b_ij = a_ij / Sj</strong>. Le vecteur de priorité (W) est obtenu par la moyenne arithmétique des lignes normalisées, offrant une approximation du vecteur propre principal.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Produit Matriciel */}
      <div className="space-y-3">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-xs">3</div>
              <CardTitle className="text-xl font-bold">Vérification : Produit Matriciel (A × W)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="text-sm uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">Critères</th>
                    {criteria.map((c, i) => (
                      <th key={i} className="px-6 py-4 text-center border-b border-border/20 font-medium opacity-50 text-[10px]">{c} (×Wj)</th>
                    ))}
                    <th className="px-6 py-4 text-center border-b border-green-600/20 bg-green-500/5 text-green-700 font-black italic text-lg">Vecteur A·W</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-lg">
                  {weightedMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-green-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10 text-base">{criteria[i]}</td>
                      {row.map((val, j) => (
                        <td key={j} className="px-6 py-4 text-center font-mono text-[10px] opacity-40">{val.toFixed(4)}</td>
                      ))}
                      <td className="px-6 py-4 text-center font-black bg-green-500/10 text-green-700 border-l border-green-500/10 text-2xl">
                        {weightedSums[i].toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Lambda_i */}
      <div className="space-y-3">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white font-bold text-xs">4</div>
              <CardTitle className="text-xl font-bold">Valeurs Propres Individuelles (λi)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="text-sm uppercase bg-muted/50 font-bold text-center">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20 text-left">Critères</th>
                    <th className="px-6 py-4 border-b border-border/20 opacity-60">Somme (A·W)_i</th>
                    <th className="px-6 py-4 border-b border-border/20 opacity-60">Poids W_i</th>
                    <th className="px-6 py-4 border-b border-orange-600/20 bg-orange-500/5 text-orange-700 font-black text-lg">Lambda λi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xl">
                  {criteria.map((criterion, i) => (
                    <tr key={i} className="hover:bg-orange-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold bg-muted/10 text-base">{criterion}</td>
                      <td className="px-6 py-4 text-center font-mono text-base opacity-50">{weightedSums[i].toFixed(4)}</td>
                      <td className="px-6 py-4 text-center font-mono text-base opacity-50">{criteriaWeights[i].toFixed(4)}</td>
                      <td className="px-6 py-4 text-center font-black bg-orange-500/10 text-orange-700 border-l border-orange-500/10 text-3xl">
                        {lambdas[i].toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-4 bg-muted/5 rounded-xl border border-dashed border-border/40 flex gap-3 items-start shadow-inner">
          <Activity className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-foreground/80">Étape 4 : Rapports de Cohérence Individuels</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>λi = (A·W)_i / W_i</strong>. Plus ces valeurs sont proches de n ({n}), plus la matrice est cohérente.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Lambda Max & CI */}
      <div className="space-y-3">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">5</div>
              <CardTitle className="text-xl font-bold">Synthèse : λmax et Indice CI</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FunctionSquare className="h-5 w-5" />
                <h4 className="font-bold uppercase tracking-wider text-xs">1. Valeur Propre Maximale (λmax)</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/20 flex flex-col items-center justify-center gap-4 shadow-inner">
                  <span className="text-xs text-muted-foreground font-medium italic">Formule Algébrique :</span>
                  <div className="text-2xl font-mono tracking-tighter">λmax = <span className="text-primary font-black">1/n</span> · Σ <span className="text-primary font-black">λi</span></div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-blue-600/60 font-medium italic">Application Numérique :</span>
                  <div className="text-base font-mono text-center leading-relaxed">
                    ({lambdas.map(l => l.toFixed(4)).join(' + ')}) / {n}
                    <br />
                    <span className="text-4xl font-black text-blue-700 mt-2 block">= {lambdaMax.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FunctionSquare className="h-5 w-5" />
                <h4 className="font-bold uppercase tracking-wider text-xs">2. Indice de Cohérence (CI)</h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/20 flex flex-col items-center justify-center gap-4 shadow-inner">
                  <span className="text-xs text-muted-foreground font-medium italic">Formule de Saaty :</span>
                  <div className="text-2xl font-mono tracking-tighter text-center">CI = (λmax - n) / (n - 1)</div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 flex flex-col items-center justify-center gap-4">
                  <span className="text-xs text-blue-600/60 font-medium italic">Application Numérique :</span>
                  <div className="text-base font-mono text-center leading-relaxed">
                    ({lambdaMax.toFixed(4)} - {n}) / ({n} - 1)
                    <br />
                    <span className="text-4xl font-black text-blue-700 mt-2 block">= {ci.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. Random Index RI */}
      <div className="space-y-3">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/20 py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold text-xs">6</div>
              <CardTitle className="text-xl font-bold">Indice Aléatoire (RI)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead className="text-xs uppercase bg-muted/50 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-border/20">n (Ordre)</th>
                    {saatyRI.map((item) => (
                      <th key={item.n} className={cn("px-4 py-4 text-center border-b border-border/20", item.n === n ? "bg-purple-600 text-white" : "")}>{item.n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  <tr>
                    <td className="px-6 py-8 font-bold bg-muted/10 uppercase text-xs">Valeur RI</td>
                    {saatyRI.map((item) => (
                      <td key={item.n} className={cn("px-4 py-8 text-center font-black text-2xl", item.n === n ? "bg-purple-500/10 text-purple-700 border-t-4 border-purple-600" : "opacity-30")}>
                        {item.ri.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="p-4 bg-muted/5 rounded-xl border border-dashed border-border/40 flex gap-3 items-start shadow-inner text-xs text-muted-foreground italic leading-relaxed">
          <TableIcon className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
          L'<strong>Indice Aléatoire (RI)</strong> est la déviance moyenne pour une matrice aléatoire de même ordre (travaux empiriques de Saaty).
        </div>
      </div>

      {/* 7. Ratio de Cohérence CR */}
      <div className="space-y-3">
        <Card className={cn(
          "rounded-3xl border-none shadow-2xl overflow-hidden transition-all duration-500",
          isConsistent ? "bg-gradient-to-br from-green-500/10 to-emerald-500/20" : "bg-gradient-to-br from-red-500/10 to-orange-500/20"
        )}>
          <CardHeader className="border-b border-border/10 py-6 px-8">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-xl",
                isConsistent ? "bg-green-600 animate-pulse" : "bg-red-600"
              )}>7</div>
              <div>
                <CardTitle className="text-2xl font-black">Ratio de Cohérence Final (CR)</CardTitle>
                <p className="text-xs opacity-70 uppercase tracking-widest font-bold">Validation du Modèle Décisionnel</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 flex flex-col items-center justify-center gap-6 shadow-2xl">
                <span className="text-xs uppercase tracking-widest font-black opacity-60">Formule Finale</span>
                <div className="text-4xl font-mono tracking-tighter">CR = <span className="text-primary font-black">CI / RI</span></div>
              </div>
              <div className={cn(
                "p-8 rounded-3xl border-2 flex flex-col items-center justify-center gap-6 shadow-2xl transition-colors",
                isConsistent ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
              )}>
                <span className="text-xs uppercase tracking-widest font-black opacity-60">Application Numérique</span>
                <div className="text-base font-mono text-center leading-relaxed">
                  {ci.toFixed(4)} / {currentRI.toFixed(2)}
                  <br />
                  <span className={cn("text-6xl font-black mt-4 block tracking-tighter", isConsistent ? "text-green-700" : "text-red-700")}>
                    = {(cr * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className={cn(
              "p-8 rounded-3xl flex gap-6 items-center border-4 shadow-inner",
              isConsistent ? "bg-green-500/20 border-green-500/30 text-green-900" : "bg-red-500/20 border-red-500/30 text-red-900"
            )}>
              {isConsistent ? <CheckCircle2 className="h-12 w-12 shrink-0 animate-in zoom-in" /> : <AlertCircle className="h-12 w-12 shrink-0 animate-bounce" />}
              <div>
                <h4 className="font-black text-2xl mb-2">{isConsistent ? "Analyse Validée" : "Incohérence Critique"}</h4>
                <p className="text-lg opacity-90 leading-relaxed font-medium">
                  {isConsistent 
                    ? `Le ratio de cohérence (${(cr * 100).toFixed(2)}%) est inférieur au seuil de 10%. Vos jugements sont mathématiquement fiables.` 
                    : `Le ratio (${(cr * 100).toFixed(2)}%) dépasse le seuil de 10%. Veuillez réévaluer vos comparaisons par paires pour éliminer les contradictions.`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
