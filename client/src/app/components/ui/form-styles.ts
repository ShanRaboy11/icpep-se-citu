export const labelStyle = "block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1";

export const titleLabelStyle = "block text-sm font-bold font-raleway text-primary3 mb-2 ml-1";

export const INPUT_CLASS =
  "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-rubik text-base text-gray-800 outline-none transition-all placeholder-gray-400 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10";

export const ERROR_CLASS = "border-red-300 ring-2 ring-red-100";

export const inputClass = (invalid = false) => (invalid ? `${INPUT_CLASS} ${ERROR_CLASS}` : INPUT_CLASS);
