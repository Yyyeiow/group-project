import React from "react";

const MemoryLineInput = ({ memoryLine, setMemoryLine }) => {
  return (
    <div className="form-group">
      <label>한 줄 추억</label>
      <input
        id="memory-line-input"
        type="text"
        value={memoryLine}
        onChange={(e) => setMemoryLine(e.target.value)}
        placeholder="이 음악과 관련된 추억 한 줄"
      />
    </div>
  );
};

export default MemoryLineInput;

