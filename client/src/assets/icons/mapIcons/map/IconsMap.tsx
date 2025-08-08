import iconsMap from './icons.map.ts';

const IconsMap = ({ name }: { name: keyof typeof iconsMap }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: iconsMap[name] }} style={{ width: 32, height: 32 }} />
  );
};

export default IconsMap;
