import React from "react";

const SongSelector = ({ selectedSong, setSelectedSong }) => {
  return (
    <div className="form-group">
      <label>노래 선택</label>
      <select
        value={selectedSong || ""}
        onChange={(e) => setSelectedSong(e.target.value)}
      >
        <option value="">노래를 선택하세요</option>
        <option value="노래1">노래 1</option>
        <option value="노래2">노래 2</option>
        <option value="노래3">노래 3</option>
      </select>
    </div>
  );
};

export default SongSelector;
