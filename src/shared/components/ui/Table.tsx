import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
  children: React.ReactNode;
}
export const Table = ({ children, className = "", ...rest }: TableProps) => (
  <table className={className} {...rest}>
    {children}
  </table>
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  children: React.ReactNode;
}
export const TableBody = ({
  children,
  className = "",
  ...rest
}: TableBodyProps) => (
  <tbody className={className} {...rest}>
    {children}
  </tbody>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children: React.ReactNode;
}
export const TableCell = ({
  children,
  className = "",
  ...rest
}: TableCellProps) => (
  <td className={className} {...rest}>
    {children}
  </td>
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children: React.ReactNode;
}
export const TableHead = ({
  children,
  className = "",
  ...rest
}: TableHeadProps) => (
  <th className={className} {...rest}>
    {children}
  </th>
);

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  children: React.ReactNode;
}
export const TableHeader = ({
  children,
  className = "",
  ...rest
}: TableHeaderProps) => (
  <thead className={className} {...rest}>
    {children}
  </thead>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
  children: React.ReactNode;
}
export const TableRow = ({
  children,
  className = "",
  ...rest
}: TableRowProps) => (
  <tr className={className} {...rest}>
    {children}
  </tr>
);
