import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, Bookmark, Users } from "lucide-react";
import slide1 from "@/assets/onboarding-1.jpg";
import slide2 from "@/assets/onboarding-2.jpg";
import slide3 from "@/assets/onboarding-3.jpg";

const slides = [
  {
    image: slide1,
    icon: MapPin,
    title: "Discover Hidden Places",
    subtitle: "Find breathtaking spots that only locals know about — secret beaches, cozy cafés, and stunning viewpoints.",
  },
  {
    image: slide2,
    icon: Bookmark,
    title: "Save & Organize",
    subtitle: "Bookmark your favorite gems and create custom lists for every trip or mood.",
  },
  {
    image: slide3,
    icon: Users,
    title: "Share with the World",
    subtitle: "Submit your own hidden gems and help fellow travelers discover the undiscovered.",
  },
];

const Onboarding = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem("hg_onboarded", "1");
    navigate("/", { replace: true });
  };

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else finish();
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground">
      {/* Image */}
      <div className="relative flex-1 overflow-hidden">
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt={s.title}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
            width={800}
            height={1200}
            {...(i === 0 ? {} : { loading: "lazy" as const })}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground" />

        {/* Skip */}
        <button
          onClick={finish}
          className="absolute right-4 top-12 rounded-full bg-card/20 px-4 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-card/40"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="relative -mt-20 flex flex-col items-center px-8 pb-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>

        <h2
          key={`title-${current}`}
          className="animate-fade-in text-2xl font-bold text-primary-foreground"
        >
          {slide.title}
        </h2>
        <p
          key={`sub-${current}`}
          className="animate-fade-in mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/70"
        >
          {slide.subtitle}
        </p>

        {/* Dots */}
        <div className="mt-6 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-primary-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="mt-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-full gem-gradient py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {current < slides.length - 1 ? "Next" : "Start Exploring"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
