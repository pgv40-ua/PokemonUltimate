import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'section';
  glowColor?: string;
  children?: React.ReactNode;
}

function CardRoot({
  as = 'div',
  glowColor,
  className,
  style,
  children,
  ...rest
}: CardProps) {
  const inlineStyle: React.CSSProperties = glowColor
    ? // CSS custom property injection — dynamic value, inline style is the correct approach here
      ({ '--glow-color': glowColor, ...style } as React.CSSProperties)
    : (style ?? {});

  const Tag = as as React.ElementType;

  return (
    <Tag
      className={cn('glass-card', className)}
      style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function CardHeader({ className, children, ...rest }: SlotProps) {
  return (
    <div className={cn('px-6 pt-6 pb-0 lg:px-8 lg:pt-8', className)} {...rest}>
      {children}
    </div>
  );
}

function CardBody({ className, children, ...rest }: SlotProps) {
  return (
    <div className={cn('p-6 lg:p-8', className)} {...rest}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...rest }: SlotProps) {
  return (
    <div
      className={cn(
        'px-6 pb-6 pt-0 lg:px-8 lg:pb-8 border-t border-border-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
CardRoot.displayName = 'Card';

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
