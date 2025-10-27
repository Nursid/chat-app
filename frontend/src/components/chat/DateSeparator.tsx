// Create a new file, e.g., DateSeparator.tsx or DateSeparator.jsx

interface DateSeparatorProps {
    label: string;
  }
  
  const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-700 mx-4"></div>
        <span className="flex-shrink-0 bg-[#16213e] text-gray-400 text-xs font-medium px-3 py-1 rounded-full shadow-md">
          {label}
        </span>
        <div className="flex-grow border-t border-gray-700 mx-4"></div>
      </div>
    );
  };
  
  export default DateSeparator;
  