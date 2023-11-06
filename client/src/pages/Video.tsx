export default function Video({ file }) {
  return (
    <div className="video">
      <video
        src={import.meta.env.VITE_API_ROUTE + '/video/' + file.id}
        controls
      >
        <source
          src={import.meta.env.VITE_API_ROUTE + '/video/' + file.id}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
