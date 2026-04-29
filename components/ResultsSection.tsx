'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsSectionProps {
  results: {
    weights: number[];
    cr: number;
    ranking: { alternative: string; score: number }[];
    isConsistent: boolean;
  };
  criteria: string[];
}

export default function ResultsSection({ results, criteria }: ResultsSectionProps) {
  const winner = results.ranking[0];
  
  const chartData = results.ranking.map((item) => ({
    name: item.alternative,
    score: parseFloat((item.score * 100).toFixed(2)),
  }));

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Top Banner - Winner */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary via-primary/80 to-indigo-600 text-white rounded-3xl shadow-2xl shadow-primary/20">
        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <Badge className="bg-white/20 hover:bg-white/30 border-none text-white px-4 py-1 rounded-full backdrop-blur-md">
              Meilleure Option Détectée
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {winner.alternative}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-md font-medium">
              Basé sur votre analyse, cette option présente le score optimal de <span className="text-white font-bold">{(winner.score * 100).toFixed(2)}%</span>.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
            <div className="relative h-32 w-32 md:h-40 md:w-40 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-inner">
              <Trophy className="h-16 w-16 md:h-20 md:w-20 text-yellow-300 drop-shadow-lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Weights & Consistency */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Poids des Critères
              </CardTitle>
              <CardDescription>Importance relative de vos facteurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {criteria.map((criterion, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-foreground/80">{criterion}</span>
                    <span className="font-bold text-primary">{(results.weights[idx] * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={results.weights[idx] * 100} className="h-2 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={cn(
            "rounded-3xl border-none shadow-xl",
            results.isConsistent ? "bg-green-500/10" : "bg-destructive/10"
          )}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className={cn(
                  "font-bold flex items-center gap-2",
                  results.isConsistent ? "text-green-600" : "text-destructive"
                )}>
                  {results.isConsistent ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  Indice de Cohérence
                </h4>
                <Badge variant={results.isConsistent ? "default" : "destructive"} className="rounded-full">
                  {(results.cr * 100).toFixed(2)}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {results.isConsistent 
                  ? "Vos comparaisons sont logiques et cohérentes. Les résultats sont fiables." 
                  : "Attention : Vos jugements présentent des contradictions. Un ratio > 10% suggère de revoir vos comparaisons."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Chart & Ranking */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Analyse Comparative</CardTitle>
              <CardDescription>Visualisation de la performance des options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      unit="%"
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                    />
                    <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Classement Complet</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {results.ranking.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "flex items-center justify-between p-6 transition-colors",
                      idx === 0 ? "bg-primary/5" : "hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-6">
                      <span className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                        idx === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {idx + 1}
                      </span>
                      <span className={cn(
                        "text-lg font-bold",
                        idx === 0 ? "text-primary" : "text-foreground"
                      )}>
                        {item.alternative}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-black text-foreground">
                          {(item.score * 100).toFixed(1)}%
                        </div>
                        <div className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Score Global</div>
                      </div>
                      <ArrowRight className={cn(
                        "h-5 w-5",
                        idx === 0 ? "text-primary" : "text-muted-foreground/30"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
