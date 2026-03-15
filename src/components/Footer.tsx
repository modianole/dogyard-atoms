const Footer = () => {
  return (
    <footer className="bg-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl font-display font-bold text-primary-foreground">DogYard</span>
          <span className="text-lg">🐾</span>
        </div>
        <p className="text-sm text-primary-foreground/50">
          © DogYard 2026. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
