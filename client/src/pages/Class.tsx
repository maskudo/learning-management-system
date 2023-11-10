import { WS_ROUTE } from '@/constants/const';
import { useUserContext } from '@/context/userContext';
import { message } from 'antd';
import { Peer } from 'peerjs';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';

export default function Class() {
  const { classId } = useParams();
  const { user } = useUserContext()
  const [streams, setStreams] = useState<MediaStream[]>([])
  useEffect(() => {
    if (!user) {
      return
    }
    const myPeer = new Peer()
    const s = new WebSocket(WS_ROUTE);
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      setStreams([...streams, stream])
    }).catch(e => message.info(e))
    myPeer.on("open", id => {
      s.send(JSON.stringify({
        event: "join-room",
        data: {
          userId: id,
          roomId: classId
        }
      }));
    })
    s.onmessage = ({ data }) => {
      console.log(data)
    }
    return () => {
      s.close();
      setStreams([])
      myPeer.disconnect()

    }

  }, [user, classId])
  return <div className="flex">
    {
      streams.map(stream => (
        <ReactPlayer playing muted url={stream} className="h-[50px] w-[100px]" />
      ))
    }
  </div>;
}
