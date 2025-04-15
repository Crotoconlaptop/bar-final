import { useState } from 'react';
import { roomServiceItems } from '../data/roomServiceItems';

export default function RoomService() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-center mt-4">Room Service Menu</h1>
      <div className="flex flex-wrap justify-center mt-4">
        {roomServiceItems.map((item, index) => (
          <div
            key={index}
            className="m-2 p-2 rounded shadow bg-dark"
            style={{ width: 150, cursor: 'pointer' }}
            onClick={() => setSelected(item)}
          >
            <img src={item.image} alt={item.name} className="w-full rounded" />
            <div className="text-center mt-2">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Modal ampliado */}
      {selected && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected.image}
            alt={selected.name}
            style={{ maxWidth: '80%', maxHeight: '60%' }}
            className="rounded"
          />
          <div className="mt-2">{selected.name}</div>
        </div>
      )}
    </div>
  );
}
