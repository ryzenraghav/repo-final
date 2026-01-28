export default function TotalScore({ overall, aptitude, gd }) {
  return (
    <div className="w-full">
      {/* mobile  */}
      <div className="sm:hidden flex justify-center">
        <div className="bg-white rounded-2xl px-4 py-3 shadow-md w-full max-w-sm">
          <h3 className="text-center text-[11px] font-semibold text-gray-400 tracking-widest mb-1">
            TOTAL SCORE
          </h3>
          <div className="flex items-baseline justify-center leading-none">
            <span className="text-[44px] font-bold text-indigo-500">{overall || 0}</span>
            <span className="text-base text-gray-400 ml-1">/100</span>
          </div>
          <p className="text-center text-[13px] text-gray-500 mt-1">
            Aptitude: <span className="font-semibold">{aptitude || 0}/50</span>
            {" "}•{" "}
            GD: <span className="font-semibold">{gd || 0}/50</span>
          </p>
        </div>
      </div>
      {/* tablet + desktop  */}
      <div className="hidden sm:block">
        <div className="bg-white rounded-2xl shadow-md border-2 border-indigo-200 p-6 relative overflow-hidden w-[90%] max-w-full mt-1 mx-auto lg:mr-auto lg:ml-4">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
          <h3 className="text-center text-sm font-semibold text-gray-400 tracking-widest mb-1 mt-1">
            TOTAL SCORE
          </h3>
          <div className="flex items-end justify-center mb-3">
            <span className="text-5xl font-semibold text-indigo-400 leading-none">{overall || 0}</span>
            <span className="text-2xl text-gray-300 ml-1">/100</span>
          </div>
          <div className="border-t w-full border-gray-200 pt-3.5">
            <div className="w-full mx-auto flex justify-between items-center px-4">
              <div className="text-center">
                <p className="text-xs uppercase text-gray-400 mb-1">Aptitude</p>
                <p className="text-lg font-bold text-gray-700">{aptitude || 0}/50</p>
              </div>
              <div className="w-px bg-gray-300 h-11" />
              <div className="text-center">
                <p className="text-xs uppercase text-gray-400 mb-1">GD Score</p>
                <p className="text-lg font-bold text-gray-700">{gd || 0}/50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

