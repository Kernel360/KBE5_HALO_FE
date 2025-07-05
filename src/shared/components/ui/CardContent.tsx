import React from 'react'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export const CardContent = ({
  children,
  className = '',
  ...rest
}: CardContentProps) => (
  <div
    className={className}
    {...rest}>
    {children}
  </div>
)

export default CardContent
