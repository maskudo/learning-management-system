import { WS_ROUTE } from '@/constants/const';
import { message } from 'antd';
import { Peer } from 'peerjs';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';

// TODO: fix:the event listeners get set twice i think
export default function Class() {
  const { classId } = useParams();
  const [myStream, setMyStream] = useState<MediaStream>();
  const [otherStreams, setOtherStreams] = useState<MediaStream[]>([]);
  useEffect(() => {
    const s = new WebSocket(WS_ROUTE);
    const peer = new Peer({
      config: {
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      },
    });
    const myStr = navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setMyStream((_) => stream);
        peer.on('open', (id) => {
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
        peer.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (otherStream) => {
            setOtherStreams((streams) => {
              if (streams.find((stream) => stream === otherStream)) {
                return [...streams];
              } else {
                return [...streams, otherStream];
              }
            });
          });
        });
        s.onmessage = ({ data }) => {
          const d = JSON.parse(data);
          if (d['event'] === 'join-room') {
            const otherUser = d.data.userId;
            const call = peer.call(otherUser, stream);
            call.on('stream', (otherStream) => {
              setOtherStreams((streams) => {
                if (streams.find((stream) => stream === otherStream)) {
                  return [...streams];
                } else {
                  return [...streams, otherStream];
                }
              });
              call.on('close', () => {
                setOtherStreams((streams) => {
                  otherStream.getTracks().forEach((track) => {
                    track.stop();
                  });
                  return streams.filter((stream) => stream !== otherStream);
                });
              });
            });
          }
        };
        return stream;
      })
      .catch((e) => {
        message.error(e.message);
      });
    return () => {
      s.close();
      peer.destroy();
      myStr.then((str) => {
        str.getTracks().forEach((track) => track.stop());
      });
    };
  }, []);
  return (
    <div className="flex gap-2">
      <ReactPlayer
        playing
        muted
        url={myStream}
        width="100%"
        className="border-2 border-orange-300"
        height="100%"
        key={myStream?.id}
      />
      {otherStreams.map((stream) => (
        <ReactPlayer
          playing
          url={stream}
          className=""
          width="100%"
          height="100%"
          key={stream.id}
        />
      ))}
    </div>
  );
}
