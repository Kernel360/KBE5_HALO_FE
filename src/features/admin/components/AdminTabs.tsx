export interface AdminTab {
  key: string;
  label: string;
}

interface AdminTabsProps {
  tabs: AdminTab[];
  activeKey: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export const AdminTabs = ({
  tabs,
  activeKey,
  onTabChange,
  className = "",
}: AdminTabsProps) => (
  <div className={`flex border-b border-gray-200 ${className}`}>
    {tabs.map((tab) => {
      const isActive = activeKey === tab.key;
      return (
        <div
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`w-40 h-10 px-4 flex justify-center items-center cursor-pointer transition-colors duration-150
            border-b-2
            ${isActive ? "border-indigo-600" : "border-transparent hover:border-indigo-300"}
          `}
        >
          <span
            className={`text-sm transition-colors duration-150
              ${isActive ? "text-indigo-600 font-semibold" : "text-gray-500 font-medium"}
              hover:text-indigo-600 hover:font-semibold`}
          >
            {tab.label}
          </span>
        </div>
      );
    })}
  </div>
);

export default AdminTabs;
