import { useParams } from 'react-router-dom';

export default function Submission() {
  const { submission } = useParams();
  return <div className="submission">{submission}</div>;
}
