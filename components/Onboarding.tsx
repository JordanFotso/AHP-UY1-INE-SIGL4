'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: 'Comparez vos critères facilement',
    description: 'Utilisez les comparaisons par paires pour évaluer vos facteurs de décision de manière objective. Notre interface intuitive simplifie les analyses complexes.',
    icon: '⚖️',
  },
  {
    id: 2,
    title: 'Assurez la cohérence',
    description: 'Bénéficiez d\'une validation automatique pour détecter les contradictions dans votre analyse. Prenez des décisions fiables à chaque fois.',
    icon: '✓',
  },
  {
    id: 3,
    title: 'Obtenez la meilleure alternative',
    description: 'Recevez un classement pondéré de toutes vos options basé sur vos critères. Découvrez le choix optimal instantanément.',
    icon: '🎯',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const slide = slides[currentSlide];

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />

      {/* Animated blobs */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative h-screen flex flex-col items-center justify-center px-6">
        {/* Header with Skip button */}
        <div className="absolute top-8 right-8">
          <button
            onClick={handleSkip}
            className="text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
          >
            Passer
          </button>
        </div>

        {/* Main content - Slide */}
        <div className="max-w-xl w-full animate-fadeIn">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-lg mb-8">
              <span className="text-6xl">{slide.icon}</span>
            </div>

            <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">
              {slide.title}
            </h1>
            <p className="text-xl text-foreground/60 text-balance leading-relaxed">
              {slide.description}
            </p>
          </div>

          {/* Slide indicators */}
          <div className="flex gap-2 justify-center mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-foreground/20 hover:bg-foreground/40'
                }`}
              />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleNext}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold py-3 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              {currentSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
            </Button>

            {currentSlide > 0 && (
              <Button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                variant="ghost"
                size="lg"
                className="w-full rounded-xl font-semibold py-3 hover:bg-foreground/5"
              >
                Retour
              </Button>
            )}
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="text-xs text-foreground/40 font-medium">
            Slide {currentSlide + 1} sur {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
}
