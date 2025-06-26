import { Link } from "react-router-dom";

const Welcome = () => {
  const letters = "welcome".split("");

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <Link to="/login">
        <h1 className="text-[#333] font-raleway text-[52px] font-semibold uppercase">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="inline-block opacity-0 transform origin-left animate-slide-in"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </Link>
    </div>
  );
};

export default Welcome;