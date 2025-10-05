import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const TAG_API_URL = `https://fegoesim.com/wp-json/wc/v3/products/tags`;
const TAG_API_PARAMS = {
  consumer_key: "ck_ef9f4379124655ad946616864633bd37e3174bc2",
  consumer_secret: "cs_3da596e08887d9c7ccbf8ee15213f83866c160d4",
  per_page: 100,
};

const classifyTag = (tagName) => {
  if (/日本|韓國|台灣|美國|泰國|越南|印尼|馬來西亞|新加坡/.test(tagName))
    return "國家";
  if (/4G|5G|高速|吃到飽|固定流量/.test(tagName)) return "網路類型";
  if (/天/.test(tagName)) return "使用天數";
  if (/QR|App|Email/.test(tagName)) return "啟用方式";
  if (/iPhone|Android|多設備/.test(tagName)) return "裝置支援";
  if (/旅遊|商務|居留/.test(tagName)) return "方案類型";
  return "其他";
};

const FilterSideBar = ({ onFilterChange }) => {
  const [groupedTags, setGroupedTags] = useState({});
  const [activeTags, setActiveTags] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(TAG_API_URL, { params: TAG_API_PARAMS });
        const tagList = res.data;

        const groups = {};
        tagList.forEach((tag) => {
          const group = classifyTag(tag.name);
          if (!groups[group]) groups[group] = [];
          groups[group].push(tag);
        });

        setGroupedTags(groups);

        const initialExpanded = {};
        Object.keys(groups).forEach((g) => (initialExpanded[g] = true));
        setExpandedGroups(initialExpanded);
      } catch (err) {
        console.error("Error fetching tags", err);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const queryTags = router.query.tags?.split(",") || [];
    setActiveTags(queryTags);
  }, [router.query.tags]);

  useEffect(() => {
    onFilterChange?.(activeTags);
  }, [activeTags]);

  const toggleTag = (slug) => {
    const updated = activeTags.includes(slug)
      ? activeTags.filter((t) => t !== slug)
      : [...activeTags, slug];

    setActiveTags(updated);
    const query = { ...router.query, tags: updated.join(",") };
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <nav className="w-full p-4 bg-white rounded-xl p-8">
      {Object.entries(groupedTags).map(([group, tags]) => {
        const isOpen = expandedGroups[group];

        return (
          <div key={group} className="mb-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleGroup(group)}
            >
              <h3 className="font-semibold text-gray-800 text-[18px]">
                {group}
              </h3>
              {isOpen ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              )}
            </div>

            <motion.div
              layout
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              {group === "使用天數" ? (
                <ul className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {tags
                    .sort((a, b) => {
                      const getDays = (name) =>
                        parseInt(name.replace("天", "")) || 0;
                      return getDays(a.name) - getDays(b.name);
                    })
                    .map((tag) => {
                      const dayNumber = tag.name.replace("天", "");
                      return (
                        <li key={tag.id} className="flex-shrink-0">
                          <button
                            onClick={() => toggleTag(tag.slug)}
                            className={`w-12 h-12 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                              activeTags.includes(tag.slug)
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 hover:bg-blue-500 hover:text-white"
                            }`}
                          >
                            {dayNumber}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <ul className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <button
                        onClick={() => toggleTag(tag.slug)}
                        className={`text-sm px-3 py-1 rounded-full transition ${
                          activeTags.includes(tag.slug)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        {tag.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        );
      })}
    </nav>
  );
};

export default FilterSideBar;
