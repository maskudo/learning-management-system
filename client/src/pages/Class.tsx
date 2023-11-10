import { WS_ROUTE } from '@/constants/const';
import { useUserContext } from '@/context/userContext';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Class() {
  const { classId } = useParams();
  const { user } = useUserContext()
  useEffect(() => {
    if (!user) {
      return
    }
    const s = new WebSocket(WS_ROUTE);

    s.onopen = (_) => {
      s.send(JSON.stringify({
        event: "join-room",
        data: {
          userId: user.id,
          roomId: classId
        }
      }));
    }
    s.onmessage = ({ data }) => {
      console.log(data)
    }
    return () => { s.close() }

  }, [user, classId])
  return <div>{classId}</div>;
}
