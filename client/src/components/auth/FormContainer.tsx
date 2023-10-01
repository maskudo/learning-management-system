export default function FormContainer({ children }) {
  return (
    <div className="form-container">
      <div className="w-1/5 mx-auto p-4 mt-16 shadow-md shadow-gray-300">
        {children}
      </div>
    </div>
  );
}
