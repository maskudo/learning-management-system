import { useParams } from 'react-router-dom';

export default function Error404() {
  const params = useParams();
  const name = params['*'];
  return (
    <div className="error h-screen flex items-center justify-center flex-col">
      <h2 className="text-4xl">Error 404 </h2>
      <h2 className="text-4xl">Page '{name}' doesn't exist.</h2>
    </div>
  );
}
