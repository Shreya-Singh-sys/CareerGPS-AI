

const FooterSection = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CareerGPS AI" className="h-8 w-8 rounded-lg object-contain" />
            <span className="font-display text-lg font-bold text-foreground">
              Career<span className="text-gradient-primary">GPS</span> AI
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            From Skill-Gap to Job-Fit — Powered by AI. Built for India's future workforce.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2026 CareerGPS AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
