import { useUserContext } from '@/context/userContext';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

// const socket_route = `${import.meta.env.VITE_API_ROUTE}/socket.io`;
export default function Class() {
  const { classId } = useParams();
  // const { user } = useUserContext();
  // const socket = useRef();
  // useEffect(() => {
  //   socket.current = io(import.meta.env.VITE_API_ROUTE);
  //   console.log(socket.current);
  //   // socket.current?.emit('add-user', user.id);
  // }, []);
  return <div>{classId}</div>;
}
