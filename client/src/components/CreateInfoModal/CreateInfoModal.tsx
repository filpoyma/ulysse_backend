import React, { useState } from 'react';
import '../CreateTemplateModal/CreateTemplateModal.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; title: string }) => void;
}

const CreateInfoModal: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  if (!open) return null;

  return (
    <div className="create-template-modal-overlay">
      <div className="create-template-modal-content">
        <h3>Создать информационный блок</h3>
        <input
          type="text"
          placeholder="Имя блока"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', margin: '8px 0', padding: 8, fontSize: 16 }}
        />
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', margin: '8px 0', padding: 8, fontSize: 16 }}
        />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="modal-btn" onClick={onClose}>Отмена</button>
          <button
            className="modal-btn"
            onClick={() => {
              if (name.trim() && title.trim()) onCreate({ name: name.trim(), title: title.trim() });
            }}
            disabled={!name.trim() || !title.trim()}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInfoModal; 