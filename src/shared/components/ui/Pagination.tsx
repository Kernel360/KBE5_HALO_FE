import React from 'react'

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}
export const Pagination = ({
  children,
  className = '',
  ...rest
}: PaginationProps) => (
  <div
    className={className}
    {...rest}>
    {children}
  </div>
)

interface PaginationContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}
export const PaginationContent = ({
  children,
  className = '',
  ...rest
}: PaginationContentProps) => (
  <div
    className={className}
    {...rest}>
    {children}
  </div>
)

interface PaginationItemProps {
  children: React.ReactNode
}
export const PaginationItem = ({ children }: PaginationItemProps) => (
  <span>{children}</span>
)

interface PaginationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
  children: React.ReactNode
}
export const PaginationLink = ({
  children,
  className = '',
  ...rest
}: PaginationLinkProps) => (
  <a
    className={className}
    {...rest}>
    {children}
  </a>
)

export const PaginationNext = PaginationLink
export const PaginationPrevious = PaginationLink
