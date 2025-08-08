import React, { useState } from 'react';
import './CreateTemplateModal.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateTemplateModal: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');

  if (!open) return null;

  return (
    <div className="create-template-modal-overlay">
      <div className="create-template-modal-content">
        <h3>Создать шаблон программы</h3>
        <input
          type="text"
          placeholder="Введите имя шаблона"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', margin: '16px 0', padding: 8, fontSize: 16 }}
        />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="modal-btn" onClick={onClose}>Отмена</button>
          <button
            className="modal-btn"
            onClick={() => {
              if (name.trim()) onCreate(name.trim());
            }}
            disabled={!name.trim()}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal; 