import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  function AddItem(item) {
    setItems((items) => [...items, item]);
  }
  function handleDelete(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleClear() {
    const confirm = window.confirm("Are you sure you want to clear");
    if (confirm) setItems([]);
  }

  function handelCheck(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form AddItem={AddItem} />
      <PackingList
        items={items}
        onDelete={handleDelete}
        onTick={handelCheck}
        handleClear={handleClear}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴🎒 Far Away </h1>;
}

function Form({ AddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(event) {
    event.preventDefault();
    if (!description) return;
    const newItem = { id: Date.now(), description, quantity, packed: false };
    AddItem(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip 🌴 ?</h3>
      <select
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      >
        {Array.from({ length: 20 }, (_, index) => index + 1).map((num) => {
          return (
            <option value={num} key={num}>
              {num}
            </option>
          );
        })}
      </select>
      <input
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></input>
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onDelete, onTick, handleClear }) {
  const [sortby, setSortby] = useState("input");
  let sorteditems;

  if (sortby === "input") sorteditems = items;
  if (sortby === "description")
    sorteditems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortby === "packed")
    sorteditems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sorteditems.map((item) => (
          <List item={item} key={item.id} onDelete={onDelete} onTick={onTick} />
        ))}
      </ul>
      <div className="actions">
        <select
          value={sortby}
          onChange={(event) => setSortby(event.target.value)}
        >
          <option value="input">Sort by Input Order</option>
          <option value="description">Sort by Description</option>
          <option value="packed">Sort by Packed Status</option>
        </select>
        <button onClick={handleClear}>Clear List</button>
      </div>
    </div>
  );
}

function List({ item, onDelete, onTick }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onTick(item.id)}
      ></input>
      <span
        style={item.packed === true ? { textDecoration: "line-through" } : {}}
      >
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDelete(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  const items_num = items.length;
  const packed_num = items.filter((item) => item.packed).length;
  const percentage =
    items_num === 0 ? 0 : Math.round((packed_num / items_num) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything ! Ready to go ✈ "
          : `💼 You have ${items_num} items on your list , and you have packed
        ${packed_num}(${percentage}%)`}
      </em>
    </footer>
  );
}
