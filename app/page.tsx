'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import CriteriaManagement from '@/components/CriteriaManagement';
import AlternativesManagement from '@/components/AlternativesManagement';
import PairwiseComparison from '@/components/PairwiseComparison';
import AlternativeScoring from '@/components/AlternativeScoring';
import ResultsSection from '@/components/ResultsSection';
import Onboarding from '@/components/Onboarding';
import { Sparkles, LayoutDashboard, Settings2, Table2, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('setup');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [criteria, setCriteria] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [pairwiseMatrix, setPairwiseMatrix] = useState<number[][]>([]);
  const [scoringMatrix, setScoringMatrix] = useState<number[][]>([]);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('ahp_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
    setIsLoaded(true);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('ahp_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleAddCriterion = (name: string) => {
    const newCriteria = [...criteria, name];
    setCriteria(newCriteria);
    const n = newCriteria.length;
    const newMatrix = Array(n).fill(0).map((_, i) => 
      Array(n).fill(0).map((_, j) => {
        if (i === j) return 1;
        if (i < pairwiseMatrix.length && j < pairwiseMatrix.length) return pairwiseMatrix[i][j];
        return 1;
      })
    );
    setPairwiseMatrix(newMatrix);
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(newCriteria);
    const newMatrix = pairwiseMatrix.filter((_, i) => i !== index).map(row => 
      row.filter((_, j) => j !== index)
    );
    setPairwiseMatrix(newMatrix);
  };

  const handleRenameCriterion = (index: number, newName: string) => {
    const newCriteria = [...criteria];
    newCriteria[index] = newName;
    setCriteria(newCriteria);
  };

  const handleAddAlternative = (name: string) => {
    const newAlternatives = [...alternatives, name];
    setAlternatives(newAlternatives);
    const m = newAlternatives.length;
    const scoringExpanded = Array(m).fill(0).map((_, i) =>
      Array(criteria.length).fill(0).map((_, j) => {
        if (i < scoringMatrix.length && j < scoringMatrix[i]?.length) return scoringMatrix[i][j];
        return 0;
      })
    );
    setScoringMatrix(scoringExpanded);
  };

  const handleRemoveAlternative = (index: number) => {
    const newAlternatives = alternatives.filter((_, i) => i !== index);
    setAlternatives(newAlternatives);
    const newMatrix = scoringMatrix.filter((_, i) => i !== index);
    setScoringMatrix(newMatrix);
  };

  const handleRenameAlternative = (index: number, newName: string) => {
    const newAlternatives = [...alternatives];
    newAlternatives[index] = newName;
    setAlternatives(newAlternatives);
  };

  const handlePairwiseChange = (i: number, j: number, value: number) => {
    const newMatrix = pairwiseMatrix.map(row => [...row]);
    newMatrix[i][j] = value;
    if (i !== j) newMatrix[j][i] = 1 / value;
    setPairwiseMatrix(newMatrix);
  };

  const handleScoringChange = (i: number, j: number, value: number) => {
    const newMatrix = scoringMatrix.map(row => [...row]);
    newMatrix[i][j] = value;
    setScoringMatrix(newMatrix);
  };

  const computeResults = () => {
    if (criteria.length === 0 || alternatives.length === 0) {
      return;
    }

    const weights = computeWeights(pairwiseMatrix);
    const cr = computeConsistencyRatio(pairwiseMatrix);

    const normalizedScoring = scoringMatrix.map(row => {
      const sum = row.reduce((a, b) => a + b, 0);
      return row.map(val => sum > 0 ? val / sum : 0);
    });

    const finalScores = normalizedScoring.map(altScores => {
      return altScores.reduce((sum, score, idx) => sum + score * (weights[idx] || 0), 0);
    });

    const ranking = alternatives
      .map((alt, idx) => ({ alternative: alt, score: finalScores[idx] }))
      .sort((a, b) => b.score - a.score);

    setResults({ weights, cr, ranking, isConsistent: cr < 0.1 });
    setActiveSection('results');
  };

  const computeWeights = (matrix: number[][]): number[] => {
    const n = matrix.length;
    if (n === 0) return [];
    const geometricMeans = matrix.map(row => {
      const product = row.reduce((a, b) => a * b, 1);
      return Math.pow(product, 1 / n);
    });
    const sum = geometricMeans.reduce((a, b) => a + b, 0);
    return geometricMeans.map(gm => gm / sum);
  };

  const computeConsistencyRatio = (matrix: number[][]): number => {
    const n = matrix.length;
    if (n <= 2) return 0;
    const weights = computeWeights(matrix);
    let sumWeightedSum = 0;
    for (let i = 0; i < n; i++) {
      let weightedSum = 0;
      for (let j = 0; j < n; j++) {
        weightedSum += matrix[i][j] * weights[j];
      }
      sumWeightedSum += weightedSum / weights[i];
    }
    const lambda = sumWeightedSum / n;
    const ci = (lambda - n) / (n - 1);
    const ri = [0, 0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    const cr = ci / (ri[n] || 1.49);
    return cr;
  };

  const handleReset = () => {
    setCriteria([]);
    setAlternatives([]);
    setPairwiseMatrix([]);
    setScoringMatrix([]);
    setResults(null);
    setActiveSection('setup');
  };

  if (!isLoaded) return null;

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/95">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 px-6 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-border/60" />
              <h1 className="text-lg font-semibold tracking-tight text-foreground/90 flex items-center gap-2">
                {activeSection === 'setup' && <><Settings2 className="h-4 w-4" /> Configuration</>}
                {activeSection === 'analysis' && <><Table2 className="h-4 w-4" /> Analyse Pairée</>}
                {activeSection === 'results' && <><BarChart3 className="h-4 w-4" /> Résultats & Ranking</>}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="rounded-full border-border/60 hover:bg-muted/50"
              >
                Réinitialiser
              </Button>
              {criteria.length > 0 && alternatives.length > 0 && (
                <Button 
                  size="sm" 
                  onClick={computeResults}
                  className="rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Calculer
                </Button>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeSection === 'setup' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                  <CriteriaManagement 
                    criteria={criteria}
                    onAdd={handleAddCriterion}
                    onRemove={handleRemoveCriterion}
                    onRename={handleRenameCriterion}
                  />
                  <AlternativesManagement 
                    alternatives={alternatives}
                    onAdd={handleAddAlternative}
                    onRemove={handleRemoveAlternative}
                    onRename={handleRenameAlternative}
                  />
                </div>
              )}

              {activeSection === 'analysis' && (
                <div className="space-y-8 max-w-5xl mx-auto">
                  {criteria.length > 1 ? (
                    <PairwiseComparison 
                      criteria={criteria}
                      matrix={pairwiseMatrix}
                      onChange={handlePairwiseChange}
                    />
                  ) : (
                    <Card className="border-dashed bg-muted/30">
                      <CardContent className="pt-12 pb-12 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                          <Settings2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">
                          Ajoutez au moins deux critères pour commencer l'analyse.
                        </p>
                        <Button 
                          variant="link" 
                          onClick={() => setActiveSection('setup')}
                          className="mt-2 text-primary"
                        >
                          Aller à la configuration
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  {alternatives.length > 0 && criteria.length > 0 && (
                    <AlternativeScoring 
                      alternatives={alternatives}
                      criteria={criteria}
                      matrix={scoringMatrix}
                      onChange={handleScoringChange}
                    />
                  )}
                </div>
              )}

              {activeSection === 'results' && (
                <div className="max-w-5xl mx-auto">
                  {results ? (
                    <ResultsSection results={results} criteria={criteria} />
                  ) : (
                    <Card className="border-dashed bg-muted/30">
                      <CardContent className="pt-20 pb-20 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                          <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Prêt pour les résultats ?</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                          Complétez vos comparaisons et cliquez sur "Calculer" pour voir le classement optimal.
                        </p>
                        <Button onClick={() => setActiveSection('analysis')}>
                          Retour à l'analyse
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
