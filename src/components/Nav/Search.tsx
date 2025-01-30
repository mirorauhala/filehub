"use client";

export const Search = () => {
  return (
    <form className="flex items-center">
      <input
        type="text"
        className="w-80 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-center text-neutral-600 outline-hidden transition-all duration-150 ease-in-out placeholder:text-neutral-400 placeholder:transition-colors after:absolute after:h-full after:w-full after:border-white hover:cursor-pointer hover:border-neutral-300 hover:shadow-sm hover:shadow-neutral-200 hover:placeholder:text-neutral-500 focus:w-96 focus:cursor-text focus:border-blue-500 focus:bg-blue-50 focus:text-blue-600 focus:placeholder:text-blue-500"
        placeholder="Search"
      />
    </form>
  );
};
