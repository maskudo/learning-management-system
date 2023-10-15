export default function FormContainer({ children }) {
  return (
    <div className="form-container  h-screen pt-16">
      <div className="w-2/5 2xl:w-1/5 xl:w-1/4 mx-auto p-4  shadow-md shadow-gray-300">
        {children}
      </div>
    </div>
  );
}
