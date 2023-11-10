import { WS_ROUTE } from '@/constants/const';
import { useUserContext } from '@/context/userContext';
import { message } from 'antd';
import { Peer } from 'peerjs';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';

export default function Class() {
  const { classId } = useParams();
  const { user } = useUserContext();
  const [myStream, setMyStream] = useState<MediaStream>();
  const [otherStreams, setOtherStreams] = useState<MediaStream[]>([]);
  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      const myPeer = new Peer();
      const s = new WebSocket(WS_ROUTE);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      myPeer.on('open', (id) => {
        s.send(
          JSON.stringify({
            event: 'join-room',
            data: {
              userId: id,
              roomId: classId,
            },
          })
        );
      });
      myPeer.on('call', (call) => {
        // console.log("received call, sending my stream", myStream)
        call.answer(stream);
        call.on('stream', (userVideoStream) => {
          // console.log("received call, opeing other stream")
          setOtherStreams([...otherStreams, userVideoStream]);
        });
      });
      s.onmessage = ({ data }) => {
        const d = JSON.parse(data);
        if (d['event'] == 'join-room') {
          const otherUser = d.data.userId;
          const call = myPeer.call(otherUser, stream);
          call.on('stream', (otherStream) => {
            // console.log("receiving other strem")
            setOtherStreams([...otherStreams, otherStream]);
          });
          call.on('close', () => {
            // TODO
            console.log('call closed');
          });
        }
      };
    })();
  }, [user, classId]);
  console.log(otherStreams);
  return (
    <div className="flex">
      <ReactPlayer
        playing
        muted
        url={myStream}
        className="h-[50px] w-[100px]"
        key={myStream?.id}
      />
      {otherStreams.map((stream) => (
        <ReactPlayer
          playing
          muted
          url={stream}
          className="h-[50px] w-[100px]"
          key={stream.id}
        />
      ))}
    </div>
  );
}
