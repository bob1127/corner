import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSearch = ({ onLocationSelect }) => {
  const [query, setQuery] = useState(""); // 用户输入的查询
  const [suggestions, setSuggestions] = useState([]); // 显示的建议列表
  const [isLoading, setIsLoading] = useState(false); // 加载状态

  // 监听输入变化并获取自动补全建议
  useEffect(() => {
    if (query.trim()) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // 调用后端 API 路由获取自动补全建议
  const fetchSuggestions = async (input) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/places-autocomplete`, {
        params: {
          query: input, // 将查询字符串传递给后端 API
        },
      });

      // 如果返回的数据有 predictions，更新 suggestions
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 用户点击建议时选择一个地点
  const handleSuggestionClick = (place) => {
    setQuery(place.description); // 显示用户选择的地点
    setSuggestions([]);
    onLocationSelect(place); // 调用父组件传入的回调函数
  };

  return (
    <div className="location-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="请输入地点名称"
      />
      {isLoading && <div>加载中...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSuggestionClick(place)}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
