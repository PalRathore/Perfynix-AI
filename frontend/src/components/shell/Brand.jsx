import BrandLogo from '../common/BrandLogo';

export default function Brand({ collapsed }) {
  if (collapsed) {
    return (
      <div className="brand is-collapsed flex justify-center py-1">
        <BrandLogo size={32} showText={false} />
      </div>
    );
  }

  return (
    <div className="brand flex items-center min-w-0 overflow-hidden">
      <BrandLogo
        size={34}
        showText={true}
        titleClassName="text-[15px] font-black tracking-tight"
        subtitleClassName="text-[8.5px] font-bold tracking-wider"
      />
    </div>
  );
}
