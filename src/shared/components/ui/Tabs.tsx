import React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}
export const Tabs = ({
  value,
  onValueChange,
  children,
  className = "",
}: TabsProps) => {
  // 재귀적으로 TabsTrigger에 props를 주입
  const injectPropsToTriggers = (child: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(child)) return child;
    if ((child.type as any).displayName === "TabsTrigger") {
      return React.cloneElement(
        child as React.FunctionComponentElement<TabsTriggerProps>,
        {
          selected: value === (child.props as any).value,
          onValueChange,
        },
      );
    }
    // 자식이 또 자식을 가진 경우 (TabsList 등)
    if (child.props && (child.props as any).children) {
      return React.cloneElement(child, {
        ...(child.props as any),
        children: React.Children.map(
          (child.props as any).children,
          injectPropsToTriggers,
        ),
      });
    }
    return child;
  };

  return (
    <div className={className}>
      {React.Children.map(children, injectPropsToTriggers)}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}
export const TabsList = ({ children, className = "" }: TabsListProps) => (
  <div className={className}>{children}</div>
);

interface TabsTriggerProps {
  value: string;
  selected?: boolean;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}
export const TabsTrigger = ({
  value,
  selected = false,
  onValueChange,
  children,
  className = "",
  ...props
}: TabsTriggerProps) => (
  <button
    className={
      className +
      (selected
        ? " border-b-2 border-indigo-600 text-indigo-600 font-semibold bg-indigo-50"
        : " text-gray-500 font-medium") +
      " hover:bg-indigo-100 transition"
    }
    onClick={() => onValueChange && onValueChange(value)}
    type="button"
    {...props}
  >
    <span>{children}</span>
  </button>
);
TabsTrigger.displayName = "TabsTrigger";
