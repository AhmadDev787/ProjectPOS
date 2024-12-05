import React, { useState } from 'react';

const Calculator = ({ closeCalculator }) => {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput(prevInput => prevInput + value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleDelete = () => {
    setInput(prevInput => prevInput.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      setInput(eval(input).toString()); // Use eval for calculation (be cautious)
    } catch (e) {
      setInput("Error");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-72">
        <button className="absolute top-2 right-2 bg-white text-red-600 text-2xl px-3 p-2" onClick={closeCalculator}>X</button>
        <div className="text-right text-2xl mb-4 p-2 border-b">{input}</div>
        <div className="grid grid-cols-4 gap-2">
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("1")}>1</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("2")}>2</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("3")}>3</button>
          <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => handleClick("+")}>+</button>

          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("4")}>4</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("5")}>5</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("6")}>6</button>
          <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => handleClick("-")}>-</button>

          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("7")}>7</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("8")}>8</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("9")}>9</button>
          <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => handleClick("*")}>*</button>

          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => handleClick("0")}>0</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={handleClear}>C</button>
          <button className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={handleDelete}>DEL</button>
          <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => handleClick("/")}>/</button>

          <button className="p-4 bg-green-600 text-white col-span-4 rounded-lg hover:bg-green-700" onClick={handleCalculate}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
