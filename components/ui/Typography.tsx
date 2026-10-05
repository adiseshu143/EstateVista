import React from 'react';
import { cn } from '@/lib/utils';

export function DisplayHeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'font-serif font-normal tracking-tight text-white leading-[1.1] sm:leading-[1.12]',
        'text-[34px] sm:text-[48px] md:text-[56px] lg:text-[68px]',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function PageHeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'font-serif font-normal tracking-tight text-white leading-tight',
        'text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px]',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({
  children,
  className,
  dark = false,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { dark?: boolean }) {
  return (
    <h2
      className={cn(
        'font-serif font-normal tracking-tight leading-snug',
        'text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px]',
        dark ? 'text-white' : 'text-[#0b132b]',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SubSectionHeading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-serif font-normal tracking-tight text-[#0b132b]',
        'text-[22px] sm:text-[26px] md:text-[30px]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
