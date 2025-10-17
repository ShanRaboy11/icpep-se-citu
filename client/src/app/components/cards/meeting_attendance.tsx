type Officer = {
  title: string;
  name: string;
};

function MeetingAttendanceCard({ onViewFull }: { onViewFull: () => void }) {
  const councilOfficers: Officer[] = [
    { title: 'President', name: 'Maria Elena Santos' },
    { title: 'VP - Internal', name: 'John Rafael Cruz' },
    { title: 'VP - External', name: 'Patricia Anne Villanueva' },
    { title: 'Secretary', name: 'Sarah Mae Rodriguez' },
    { title: 'Treasurer', name: 'Miguel Angelo Fernandez' },
    { title: 'Auditor', name: 'Ana Gabriela Reyes' },
    { title: 'PIO', name: 'Carlos David Mendoza' }
  ];

  return (
    <div className="bg-blue-900 rounded-2xl shadow-md p-6 text-white">
      <h3 className="text-xl font-bold mb-4">Meeting Attendance</h3>
      
      <div className="bg-white/10 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-2 opacity-90">Council Officers</h4>
            {councilOfficers.slice(0, 4).map((officer, index) => (
              <div key={index} className="flex justify-between py-1.5 text-sm">
                <span className="opacity-80">{officer.title}</span>
                <span className="font-medium">{officer.name}</span>
              </div>
            ))}
            <p className="text-xs opacity-70 mt-2">+ {councilOfficers.length - 4} more officers</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onViewFull}
        className="w-full bg-white text-blue-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        View Full Attendance
      </button>
    </div>
  );
}
