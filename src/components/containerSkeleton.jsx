const ContainerSkeleton = ({ title, type, children }) => {
  return (
    <div className="w-full bg-surface-raised rounded-2xl overflow-hidden mb-5 md:col-span-2 md:mt-0 ring-1 ring-surface-border">
      <div className={`bg-${type} px-4 py-2.5`}>
        <h2 className="font-bold text-lg text-white">{title}</h2>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
};
export default ContainerSkeleton;
