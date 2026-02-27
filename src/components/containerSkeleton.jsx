const ContainerSkeleton = ({ title, type, children }) => {
  return (
    <div
      className={`entries w-full h-auto bg-${type} border-border-${type} rounded-2xl border-1 flex flex-col p-2 mb-5 md:col-span-2 md:mt-0`}
    >
      <div className={`header mt-1 mx-1 mb-3 rounded bg-${type}-secondary`}>
        <h2 className="font-bold text-xl text-center text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
};
export default ContainerSkeleton;
