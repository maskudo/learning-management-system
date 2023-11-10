import { API_ROUTE } from "@/constants/const";

export default function Video({ file }) {
  return (
    <div className="video">
      <video
        src={API_ROUTE + '/video/' + file.id}
        controls
      >
        <source
          src={API_ROUTE + '/video/' + file.id}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
