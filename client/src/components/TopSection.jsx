import { useNavigate } from "react-router-dom";

export default function TopSection({ profile, user }) {
  const navigate = useNavigate();
  if (!profile) return null;

  return (
    <>
      {/* purple header */}
      <div className="bg-[#6A7CF6] text-white rounded-b-3xl lg:rounded-b-none">
        <div className="px-4 pt-4 pb-20 lg:px-8 lg:pt-0 lg:pb-0 relative z-10"> {/* inner wrapper */}
          <div className="lg:hidden"> {/* mobile header + profile */}

            {/* mobile header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-sm font-semibold">
                Report Dashboard
              </h1>

              <button
                onClick={() => navigate('/', { replace: true })}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition cursor-pointer text-white/90"
                title="Logout"
              >
                <span className="material-icons">logout</span>
              </button>
            </div>

            {/* mobile profile */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-300 flex items-center justify-center text-lg font-bold text-black border-2 border-white/20">
                {profile.username[0]}
              </div>

              <div>
                <h2 className="font-semibold text-base">
                  {profile.username}
                </h2>

                <p className="text-xs text-white/90">
                  {profile.dept}
                </p>

                <span className="inline-block mt-1 px-2 py-[2px] text-[10px] rounded-full bg-green-500 text-white shadow-sm">
                  Reg: {profile.regNo}
                </span>
              </div>
            </div>
          </div>

          {/* desktop header */}
          <div className="hidden lg:flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">
                Report Dashboard
              </h1>
            </div>

            <button
              onClick={() => navigate('/', { replace: true })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition cursor-pointer text-white/90 hover:text-white"
            >
              <span className="material-icons text-xl">logout</span>
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>

        </div>
      </div>

    </>
  );
}