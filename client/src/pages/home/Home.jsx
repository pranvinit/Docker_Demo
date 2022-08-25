import "./home.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [moods, setMoods] = useState({});

  const getData = async () => {
    const ideasRes = await axios.get("/api/ideas/all").data;
    const moodsRes = await (await axios.get("/api/moods/all")).data;
    console.log(ideasRes, moodsRes);
    setIdeas(ideas);
    setMoods(moods);
  };

  useEffect(() => {
    getData();
  }, []);

  const [ideaInput, setIdeaInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const resetForm = () => {
    setNameInput("");
    setIdeaInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ideaInput || !nameInput) return;

    await axios.post("/api/ideas", { name: nameInput, idea: ideaInput });
    resetForm();
    getData();
  };

  return (
    <div className="home">
      <form className="top" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={nameInput}
          onChange={({ target }) => setNameInput(target.value)}
        />
        <input
          type="text"
          name="idea"
          placeholder="What's your idea?"
          value={ideaInput}
          onChange={({ target }) => setIdeaInput(target.value)}
        />
        <div className="fromOptions">
          <button type="reset" onClick={resetForm}>
            Discard
          </button>
          <button type="submit"> Submit</button>
        </div>
      </form>
      <div className="bottom">
        {!!ideas.length && (
          <div className="left">
            <h2>Ideas</h2>
            {ideas.map((idea) => (
              <span className="ideaItem">{idea}</span>
            ))}
          </div>
        )}
        {!!moods.length && (
          <div className="right">
            <h2>Moods</h2>
            {Object.keys(moods).map((key) => (
              <span className="moodItem">
                {key} is {moods[key]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
