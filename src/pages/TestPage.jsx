import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function TestPage() {
  return (
    <Section centered>
      <h2>Тестируем компоненты</h2>
      <div style={{ marginTop: 'var(--space-4)' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary" style={{ marginLeft: 'var(--space-4)' }}>Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      
      <Card style={{ marginTop: 'var(--space-8)' }}>
        <h3>Это карточка</h3>
        <p>Используется из компонента Card.jsx</p>
      </Card>
    </Section>
  );
}

import { Icon } from '../components/icons/Icon';
import { ClockIcon, CheckIcon, MenuIcon } from '../components/icons/icons';

export function TestIcons() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Icon svg={ClockIcon} size="32px" color="var(--color-primary)" ariaLabel="Time" />
      <Icon svg={CheckIcon} size="32px" color="var(--color-success)" ariaLabel="Done" />
      <Icon svg={MenuIcon} size="32px" color="var(--color-text)" ariaLabel="Menu" />
    </div>
  );
}

