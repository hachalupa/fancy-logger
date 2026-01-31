import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Section } from '../components/ui/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faBars, faXmark, faClock,
  faChartBar, 
  faTag, 
  faFolder, 
  faLock, 
  faMobileAlt  } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '../components/icons/Icon'
import '../styles/navbar.css'

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('#')) {
      // Scroll to section
      const element = document.querySelector(path);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  const featureIcons = [faClock, faChartBar, faTag, faFolder, faLock, faMobileAlt];
  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
        <FontAwesomeIcon icon={faBusinessTime} /> Fancy Logger
        </a>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); }}>
            Features
          </a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavClick('#pricing'); }}>
            Pricing
          </a>
          <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
           <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars}/>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`navbar-mobile ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); }}>
          Features
        </a>
        <a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavClick('#pricing'); }}>
          Pricing
        </a>
        <Button 
          variant="primary" 
          size="lg"
          style={{ width: '100%' }}
          onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
        >
          Sign In
        </Button>
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="landing-hero">
        <div className="landing-hero-content">
          <h1>
            Track Your <span className="highlight">Working Hours</span> with Fancy Logger
          </h1>
          <p>
            Simple, beautiful time-tracking for freelancers and teams. Log your work, track projects, and get insights.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Get Started Free
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="landing-hero-image">
          <div className="landing-mockup">
            <div className="landing-mockup-header">
              <h3 style={{ margin: 0 }}>📊 Your Work Logs</h3>
              <span className="text-sm">Today</span>
            </div>
            <div className="landing-stats">
              <div className="landing-stat-card">
                <div className="landing-stat-value">8</div>
                <div className="landing-stat-label">Hours Logged</div>
              </div>
              <div className="landing-stat-card">
                <div className="landing-stat-value">3</div>
                <div className="landing-stat-label">Projects</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-base)', fontSize: 'var(--font-size-sm)' }}>
                ✓ Design Database Schema - 2h
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-base)', fontSize: 'var(--font-size-sm)' }}>
                ✓ Review Code - 3h
              </div>
              <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-base)', fontSize: 'var(--font-size-sm)' }}>
                ○ Testing - 1.5h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <Section id="features" centered>
        <h2>Why Choose Fancy Logger?</h2>
        <p style={{ maxWidth: '600px', margin: 'var(--space-4) auto var(--space-8)', color: 'var(--color-text-secondary)' }}>
          Everything you need to track time, manage projects, and understand where your hours go.
        </p>

        <div className="landing-features-grid">
          {[
            { icon: 0, title: 'Time Tracking', desc: 'Log work with start/end times or manual entries. Track time across projects effortlessly.' },
            { icon: 1, title: 'Work Logs', desc: 'View and filter your work entries by project, type, and date. See patterns in your work.' },
            { icon: 2, title: 'Task Types', desc: 'Categorize your work: programming, design, meetings, support. Customizable for your workflow.' },
            { icon: 3, title: 'Projects', desc: 'Organize work by project. Set hours allocation and track against budget.' },
            { icon: 4, title: 'Secure & Private', desc: 'Your data is encrypted. We respect your privacy. No tracking, no ads.' },
            { icon: 5, title: 'Works Everywhere', desc: 'Web app that works on desktop, tablet, and mobile. Access your data anywhere.' }
          ].map((feature, i) => (
            <Card key={i}>
              <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-4)' }}>
                <FontAwesomeIcon icon={featureIcons[feature.icon]} />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>{feature.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== CTA ===== */}
      <Section style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))', textAlign: 'center' }}>
        <h2>Ready to Track Your Time?</h2>
        <p style={{ margin: 'var(--space-4) auto var(--space-6)', maxWidth: '600px'}}>
          Start logging your work in seconds. No credit card required. Free forever plan available.
        </p>
        <Button 
          variant="primary"
          size="lg" 
          onClick={() => navigate('/register')}
          style={{ background: 'var(--color-white)', color: 'var(--color-primary)' }}
        >
          Get Started Now
        </Button>
      </Section>

      {/* ===== PRICING ===== */}
      <Section id="pricing" centered>
        <h2>Simple Pricing</h2>
        <p style={{ maxWidth: '600px', margin: 'var(--space-4) auto var(--space-8)', color: 'var(--color-text-secondary)' }}>
          Choose the right plan for you. Upgrade anytime.
        </p>

        <div className="landing-pricing-cards">
          {[
            { name: 'Free', price: '$0', desc: 'Forever', features: ['Unlimited work logs', 'Up to 5 projects', 'Basic filtering'] },
            { name: 'Pro', price: '$5', desc: '/month', features: ['Everything in Free', 'Unlimited projects', 'Advanced analytics', 'Email support'], featured: true },
            { name: 'Team', price: 'Custom', desc: 'Contact us', features: ['Everything in Pro', 'Team management', 'Dedicated support', 'Custom integrations'] }
          ].map((plan, i) => (
            <Card key={i} className={plan.featured ? 'landing-price-card featured' : 'landing-price-card'}>
              {plan.featured && <div className="landing-price-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="landing-price-value">{plan.price}</div>
              <div className="text-sm text-muted">{plan.desc}</div>
              <ul style={{ listStyle: 'none', margin: 'var(--space-6) 0', textAlign: 'left' }}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-success)', marginRight: 'var(--space-2)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.featured ? 'primary' : 'secondary'}
                size="lg"
                style={{ width: '100%' }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </Section>
        <hr/>
      {/* ===== FOOTER ===== */}
      <footer className='footer' style={{ padding: 'var(--space-4) var(--space-0)', textAlign: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p>&copy; 2026 Fancy Logger</p>
        </div>
      </footer>
    </>
  );
}
