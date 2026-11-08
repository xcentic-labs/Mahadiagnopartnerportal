const Steps = ({ active, labels }) => (
  <div className="flex items-center mb-6">
    {labels.map((label, i) => {
      const step = i + 1
      const done = step < active
      const current = step === active
      return (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                done || current ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
            <span className={`text-[11px] mt-1 whitespace-nowrap ${current ? 'text-primary font-semibold' : 'text-gray-500'}`}>{label}</span>
          </div>
          {step < labels.length && <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? 'bg-primary' : 'bg-gray-200'}`} />}
        </div>
      )
    })}
  </div>
)

export default Steps
